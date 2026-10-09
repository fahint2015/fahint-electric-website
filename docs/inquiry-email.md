# FAHINT 询盘邮件：Cloudflare Pages + Resend

客户提交现有表单，经 Turnstile 验证后，由 `/api/inquiry` 发送一封通知到 `louis@fahint.com`。点击邮件的回复按钮即可回复客户。多款 USB 产品的型号、数量、颜色和产品页一起进入通知正文。

## 1. 验证发信子域

1. 注册并登录 [Resend](https://resend.com/signup)。
2. 打开 Domains → Add Domain，填写 `notify.fahint.com`。
3. 只启用 Sending。按照 Resend 实际提供的记录，在 Cloudflare DNS 添加该子域的 DKIM、发信 SPF 和回信路径 MX；TXT/MX 本身无代理开关，如出现 CNAME 则使用 DNS only。
4. 不覆盖 `fahint.com` 根域的网易企业邮箱 MX/SPF，不删除现有 `sh.fahint.com` SendCloud 或 `mail`/`smtp`/`imap`/`pop` 记录。
5. 回到 Resend 检查验证，等待发信域状态为 Verified。

发件人用 `FAHINT Website <inquiries@notify.fahint.com>`。收件人仍为企业邮箱 `louis@fahint.com`；该发件地址无需另外开通一个企业邮箱账户。

官方说明：[发信域与子域验证](https://resend.com/docs/dashboard/domains/introduction)。

## 2. 创建专用发信密钥

在 Resend 的 API Keys 创建 `FAHINT Website`，权限选 Sending access，限制域为 `notify.fahint.com`。密钥直接保存到下一步的 Cloudflare Secret；不要粘贴到聊天、源码或任何 `VITE_*` 变量中，也无需重置其他系统已有的密钥。

## 3. 创建人机验证组件

Cloudflare 账户 → Turnstile → Add widget：名称 `FAHINT Inquiry`，Hostname 填 `fahint.com`，模式 Managed。创建后取得 Site key 和 Secret key。本站不需要开启 Pre-clearance。

官方步骤：[Turnstile 控制台配置](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/)。

## 4. 填入 Cloudflare Pages 生产配置

Workers & Pages → `fahint-electric-website` → Settings → Variables and Secrets，选择 Production。

| 名称 | 类型 | 值 |
|---|---|---|
| `RESEND_API_KEY` | Secret | Resend 专用发信密钥 |
| `TURNSTILE_SECRET_KEY` | Secret | Turnstile Secret key |
| `INQUIRY_FROM` | Text | `FAHINT Website <inquiries@notify.fahint.com>` |
| `VITE_INQUIRY_ENDPOINT` | Text | `https://fahint.com/api/inquiry` |
| `VITE_TURNSTILE_SITE_KEY` | Text | Turnstile Site key（公开值） |

已有 `SITE_BASE=/` 和 `VITE_SITE_URL=https://fahint.com` 继续使用。上述配置完整后重新构建生产部署；前端公开变量会在构建时写入 JavaScript。仅保存变量不会更新已构建的页面。

不要把生产发信密钥添加到 Preview 环境。本接口只接收 `https://fahint.com` 来源；未配置的预览站点继续使用邮件软件流程。

## 5. 确认真实收信

配置后的首页/联系页按钮应显示 Send inquiry。由网站负责人使用自己的邮箱提交一条标注为测试的询盘，完成以下确认：

- 页面收到确认后显示成功提示；邮件服务接受前不会提示成功。
- Resend Emails 中存在该通知，并显示投递结果。
- `louis@fahint.com` 的收件箱（及垃圾邮件箱）中收到完整通知。
- 回复地址为测试时填写的客户邮箱；多款产品的型号、数量和颜色完整。
- 发送失败时保留草稿，可以重试、复制详情或直接发邮件。

API 返回 `{ "ok": true }` 代表 Resend 接受发送，实际投递还需以上收件箱检查。本站不自动向客户发回执，每条询盘发送一封通知；当前 Resend 免费额度为每月 3,000 封且每天最多 100 封：[官方套餐](https://resend.com/pricing)。

## 实现与验证

- `/api/inquiry` 使用服务器端密钥和固定收件人，验证来源、JSON 类型、请求大小、字段内容以及 Turnstile 的 hostname/action。
- 每个草稿使用同一发送编号重试，Resend 的 Idempotency-Key 在 24 小时内防止网络故障重试产生重复邮件；修改草稿生成新编号。
- 表单请求限制 12 秒，后台验证/发信请求分别限制 3 秒/7 秒。服务失败、额度不足或未配置时不返回成功。
- `public/_routes.json` 仅把询盘接口交给 Functions，普通静态页面和资源直接返回。
- 单元检查使用模拟服务，不发送真实邮件：`npm test`。构建：`SITE_BASE=/ npm run build`（PowerShell：`$env:SITE_BASE='/'` 后执行 `npm run build`）。
