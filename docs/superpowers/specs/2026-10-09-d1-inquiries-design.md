# FAHINT D1 询盘存档

用户已确认采用 Cloudflare D1，实现前文讨论的自动保存、邮件通知、跟进状态和表格导出。沿用现有网站和 `/api/inquiry`，由主代理在当前工作区实施。

## 接收与通知

- 保留现有来源、字段、请求体大小和 Turnstile hostname/action 校验。
- Production 通过 `INQUIRY_DB` 绑定专用数据库 `fahint-inquiries`。未绑定或保存失败时返回失败并保留客户草稿。
- 验证通过后使用参数化 SQL 保存规范化询盘。只有数据库确认保存，才返回 `{ok:true}`。现有前端“询盘已收到”提示与这一含义一致。
- `request_id` 是主键，规范化内容的 SHA-256 防止相同编号覆盖不同内容。相同内容重试只产生一条记录和一次通知；不同内容使用同一编号返回 409。
- 用 Pages `waitUntil` 在保存之后尝试邮件通知。邮件失败不会使已经收到的询盘变成提交失败。测试环境没有 `waitUntil` 时等待通知任务，便于核对结果。
- 通知状态为 `pending`、`accepted`、`failed`，其中 accepted 只表示 Resend 接受发送。保存 provider email ID，已有通知不因浏览器重试再次发送。pending/failed 由负责人在后台查看并跟进。

## 记录与管理

`inquiries` 保存提交编号、UTC 时间、姓名、邮箱、公司、国家、询盘类型、类别、型号、数量、颜色、来源页、需求、规范化产品清单、可读询盘正文和内容哈希。

跟进状态为 `new`、`contacted`、`quoted`、`won`、`lost`，另有 `notes`。初期在 Cloudflare 数据库后台查询和修改，只对有 Cloudflare 账户权限的人员开放。网站不新增公开读取或管理接口。

不保存 Turnstile token、服务器密钥或额外的客户 IP/浏览器指纹；不新增客户账号、自动客户回执、CRM、分析或隐私政策页面。

## 导出与验证

提供固定的只读导出 SQL，以及将 Wrangler JSON 查询结果转换为 Excel 可打开的 UTF-8 BOM CSV 的 Node 脚本。转义逗号、引号、换行并防止客户文字被 Excel 当作公式执行。文件留在本地私有目录。

验证保存顺序、通知失败仍存档、数据库失败不确认、重复与内容冲突、产品数据规范化、后台状态默认值、导出格式。沿用 Vitest；用本地 Wrangler/D1 实测建表和编译后的接口，不发真实邮件。生产配置完成后才发布并由用户提交真实测试询盘确认记录和邮箱结果。
