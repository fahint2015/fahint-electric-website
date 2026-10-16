# 正式站旧网址清理

范围：用户要求清理 Google Search Console 导出中的无用网页。基于正式站 `d40d1fd` 单独修复，不发布本地品牌改版，不删除真实产品、文章、原始素材或询盘数据。

## 检查依据

- 输入：2026-10-16 导出的 9 个工作簿，8 类明细共 1,391 个不重复 URL。总览最新数据点是 2026-10-12：已收录 152、未收录 1,391；不代表 10 月 16 日即时状态。
- 共检查 315 个公开 URL，包括全部 181 个 sitemap 页面、全部非异常 PHP 明细 URL 和分层抽样的 24 个异常 PHP URL。最终 242 个 200、73 个 404；两个废弃 CMS 功能端点只使用 HEAD，未触发提交操作。
- 181 个 sitemap 页面最终都返回 200，有自身 canonical、唯一 H1、标题，未发现 noindex 或站内孤立页面；180 个 sitemap 地址先 308 到尾斜杠地址。GSC 列出的三个重定向错误地址当前均正常，并未重现循环。
- 1,119 个异常 PHP 数字地址占明细约 80%。24 个抽样均为真实 404。可判断为历史垃圾地址，不能仅凭 URL 断言当前站点被入侵。
- 40 个旧 CMS 查询网址都显示首页。87 个现有产品页面仍通过“原始型号规格”链接指向这种旧网址。
- 161 个“已发现，尚未收录”地址均无尾斜杠，不能因此断言其规范版本全部未收录，也不能用 181 减 152 推算缺失页面。需后续 Search Console 规范网址检查。

## 已实施规则

| 导出中的地址类型 | 数量 | 处理 |
| --- | ---: | --- |
| `/static/index.php`、`/yineng/index.php` 的异常地址 | 1,119 | 410，`X-Robots-Tag: noindex` |
| 废弃 CMS 功能地址 | 2 | 410 |
| 无对应新内容的旧查询网址 | 6 | 410；不再显示首页 |
| 有对应产品或栏目内容的旧查询网址 | 34 | 301 到明确的规范网址 |
| 已失效语言目录及其他历史路径 | 47 | 保持已验证的 404 |
| 询盘参数、域名/协议别名、现有正式页面 | 183 | 保持既有功能及规范化行为 |

上述合计 1,391 个导出 URL。规则还覆盖已核实的全部 **94 个旧产品查询地址**及 8 个旧栏目入口，不限于导出样本；目标全部是现有公开页面。未公开的 FLB20 不建立产品跳转。没有使用全站跳首页或 robots.txt 阻止抓取来代替移除。

- `src/server/legacy-urls.js`：明确的迁移映射和废弃地址响应；支持原始及 URL 编码查询键，只处理 GET/HEAD。普通推广参数、询盘参数及 POST/OPTIONS 继续交给原处理器。
- `functions/_middleware.js`、`public/_routes.json`：只增加首页查询解析和废弃 PHP 路径的 Functions 调用范围，保留 `/api/inquiry`；静态资源和正常内页仍由 Pages 直接提供。
- 移除产品页面对失效旧规格页的公开链接；保留内部来源 URL、原档案和有效目录 PDF 入口。没有 PDF 的型号保留索取文件入口，不伪造资料。
- sitemap 仍为 181 条，改为最终尾斜杠 canonical 地址。

## 验证与后续

- 全部 54 个测试文件、1,042 项测试通过；包含 94 个产品映射、原始/编码查询、410/HEAD、普通查询和询盘接口旁路。
- 生产构建生成 181 个公开页面、404 和原有 inquiry Functions。逐页核对 canonical、H1、旧规格链接；旧首页仍为 “Wiring devices. Built for your market.”。
- Cloudflare Wrangler 4.151.1 完成 Worker 编译，本机 Pages 运行时验证 301、410、HEAD、静态页面和询盘 GET/OPTIONS 的原有 405 响应；未提交真实询盘。
- 1,391 条导出地址均已对照处理规则分类。审计和测试记录保存在本地 `fahint-gfci/output/gsc-audit-2026-10-16` 与独立修复目录 `output/index-cleanup`，不提交私有工作簿或询盘资料。
- 发布后核对真实 HTTP 响应与 sitemap；Search Console 数字需等待重新抓取。404、410 和重定向地址不需要变成已收录页。不要对它们批量请求收录，也不要提交全站移除申请。真实产品/栏目页才需要继续检查抓取和收录。
- 本地新版后续发布前应合入本次生产修复，再运行新版 182 页检查；不要用旧构建覆盖正式站清理规则。

依据：[Google 网页索引报告](https://support.google.com/webmasters/answer/7440203?hl=zh-Hans)、[Google 网址迁移建议](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)、[Cloudflare Functions 路由](https://developers.cloudflare.com/pages/functions/routing/)、[Pages 重定向限制](https://developers.cloudflare.com/pages/configuration/redirects/)。Pages `_redirects` 不支持按查询参数匹配，所以旧 CMS 查询迁移使用服务端 Functions。
