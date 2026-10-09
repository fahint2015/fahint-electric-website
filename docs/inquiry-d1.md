# FAHINT 询盘记录：Cloudflare D1

客户通过现有表单提交，经 Turnstile 验证后，网站先保存询盘，再尝试发邮件到 `louis@fahint.com`。页面成功提示代表询盘已存入数据库。邮件通知失败时，询盘仍可在后台查看和跟进。

## 创建、建表和绑定

1. Cloudflare 账户首页 → 存储和数据库 → D1 SQL 数据库 → 创建数据库，名称填 `fahint-inquiries`，位置使用默认设置。
2. 本次数据库 ID：`d52c47c0-17d1-4d6f-90ce-6f32b3abdc66`。这不是密钥。
3. 打开该数据库的 Console（控制台），复制 `migrations/0001_inquiries.sql` 的全部内容并执行。出现 `inquiries` 表表示建表成功。这份 SQL 可以重复执行，不会清空已有询盘。
4. Workers & Pages → `fahint-electric-website` → 设置 → 绑定 → 添加 D1 数据库绑定。在 Production（生产环境）中，变量名填 **`INQUIRY_DB`**，数据库选 **`fahint-inquiries`**，保存。
5. 原有 Resend 和 Turnstile 变量继续使用，见 [询盘邮件说明](inquiry-email.md)。生产绑定和表准备完成后发布带有 D1 功能的新版本；绑定修改需要新部署生效。
6. 用户提交一条标注为测试的真实询盘，检查 D1 的 `inquiries` 表中有记录、页面成功，以及邮箱是否收到通知。无效验证不会存档或发信。

预览部署没有绑定生产数据库时不能接收询盘。初期不在 Preview 中配置生产数据库或发信密钥。

官方说明：[Pages 数据库绑定](https://developers.cloudflare.com/pages/functions/bindings/)、[D1 控制台](https://developers.cloudflare.com/d1/get-started/)。

## 查看客户询盘

在 Cloudflare → D1 → `fahint-inquiries` 的表视图查看 `inquiries`，或在控制台执行：

```sql
SELECT request_id, created_at, name, email, company, country,
  category, model, quantity, status, notes, email_status
FROM inquiries
ORDER BY created_at DESC
LIMIT 100;
```

时间字段使用 UTC，中国时间加 8 小时。多款 USB 产品存入 `items_json`；`inquiry_text` 是包含全部型号、数量、颜色和来源页的可读正文。

跟进状态：`new`（新询盘）、`contacted`（已联系）、`quoted`（已报价）、`won`（成交）、`lost`（未成交）。在控制台按确切询盘编号修改，不用修改客户原始内容：

```sql
UPDATE inquiries
SET status = 'quoted', notes = '已发送报价，等待客户确认'
WHERE request_id = '替换为需要跟进的询盘编号';
```

备注中有英文单引号时，在 SQL 字符串中写成两个单引号。保留 `WHERE request_id = ...`，避免批量修改其他询盘。

查看待处理询盘及通知异常：

```sql
SELECT request_id, created_at, name, email, status, email_status, inquiry_text, notes
FROM inquiries
WHERE status = 'new' OR email_status IN ('pending', 'failed')
ORDER BY created_at DESC
LIMIT 100;
```

邮件状态 `pending` 是等待通知结果，`accepted` 是 Resend 已接受发送，`failed` 是通知未确认。`accepted` 不等于客户邮箱或企业邮箱实际收信，需结合 Resend 投递记录和收件箱检查。邮件正文中附有询盘编号，可与 D1 对应。长时间 pending 也需要人工查看。

## 导出为 Excel 可打开的 CSV

查看和跟进可以直接在 Cloudflare 后台完成。下面的 CSV 导出使用本地命令行，需要通过 `wrangler login` 官方授权登录拥有该数据库权限的 Cloudflare 账户；不需要把密钥发到聊天中。

在仓库目录打开 PowerShell，执行以下命令。导出放在本地私有目录 `output/inquiries`，不会进入网站文件或 Git 提交。文件名带时间，避免覆盖以前的导出。

```powershell
npx wrangler login
New-Item -ItemType Directory -Path output/inquiries -Force | Out-Null
$inquiryStamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$inquiryJsonPath = "output/inquiries/inquiries-$inquiryStamp.json"
$inquiryCsvPath = "output/inquiries/inquiries-$inquiryStamp.csv"
npx wrangler d1 execute fahint-inquiries --remote --config database/wrangler.toml --file database/export-inquiries.sql --json | Set-Content -Encoding utf8 $inquiryJsonPath
if ($LASTEXITCODE -ne 0) { throw 'Database export failed' }
node scripts/export-inquiries.mjs $inquiryJsonPath $inquiryCsvPath
```

CSV 包含客户资料、产品清单、完整需求、跟进备注和邮件状态。支持中文、引号和换行；疑似 Excel 公式的客户文字会作为文本导出。转换程序拒绝失败查询和网站 `public`/`dist` 路径，不覆盖已有文件。修改本地 CSV 不会反向修改数据库。

导出是完整快照，包含个人联系方式，保存在公司受控目录，按实际业务需要限制分享。不会通过公开网站提供下载客户记录的接口。

## 数据库备份和维护

登录命令行后，可以额外导出 SQL 备份：

```powershell
$inquiryBackupStamp = Get-Date -Format 'yyyyMMdd-HHmmss'
npx wrangler d1 export fahint-inquiries --remote --config database/wrangler.toml --table inquiries --output "output/inquiries/backup-$inquiryBackupStamp.sql"
```

Cloudflare 的免费 D1 提供 7 天 Time Travel 恢复窗口。恢复和重新导入会改变数据库数据，操作前先保存当前备份并确认目标时间。官方说明：[导入和导出](https://developers.cloudflare.com/d1/best-practices/import-export-data/)、[D1 限制](https://developers.cloudflare.com/d1/platform/limits/)。

## 接收规则和限制

- 仅接受 `https://fahint.com` 来源、合法 JSON、限定字段和请求大小，以及正确 hostname/action 的 Turnstile 验证。
- 验证完成后，参数化 SQL 原子写入。数据库未绑定、未建表或保存失败时返回失败，表单保留客户草稿。
- 同一草稿的编号和规范化内容重试，只保存一条记录、尝试一次邮件通知；相同编号的不同内容返回 409，不覆盖客户内容或跟进备注。去重不受 Resend 的 24 小时窗口限制。
- 用 Pages `waitUntil` 执行保存之后的通知，Resend 请求最多等待 7 秒。不实现邮件自动重发，pending/failed 由负责人查看并人工跟进。
- D1 不保存 Turnstile token、服务器密钥或额外的 IP/浏览器指纹。网站不公开询盘列表和管理接口；管理依赖 Cloudflare 账户权限。初期没有独立 CRM 管理页面。
- 本地测试模拟验证和邮件服务，并用实际本地 D1 验证 SQL，不发送真实邮件。
