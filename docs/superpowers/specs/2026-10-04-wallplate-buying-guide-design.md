# 面板采购指南：研究与内容设计

日期：2026-10-04

## 已确认的方向与范围

用户已同意下一步新增英文面板选型指南，延续 USB、调光器指南的现有文章模板。目标是帮助北美市场的经销商、项目采购及自有品牌客户分别确认开孔、联数、外框尺寸、固定方式和表面效果，再用 FAHINT 的实际型号准备询价。

只做一篇指南及必要入口。保留网站的深蓝、蓝绿、浅灰、圆角和字体，不重做页面，不新增配置器、兼容性数据库、CMS、依赖或客户资料存储。不推送、合并或部署；域名更正和询盘邮件直达继续留待上线前配置；不提交真实询价。主代理直接完成，不创建子代理。

## 设计任务状态

- [x] 检查现有指南、产品数据、相关尺寸图、文章模板和工作区状态。
- [x] 评估视觉讨论：复用现有模板，不需要新增布局对照稿。
- [x] 明确读者、语言、范围及本地交付方式，无需重复询问。
- [x] 比较三种方案，选择独立采购指南。
- [x] 用户已批准面板指南的方向。
- [x] 写出本方案，完成来源、范围和一致性自查。
- [x] 用户审阅并确认本书面方案（2026-10-06）。
- [x] 确认后编写实施计划、文章及测试，完成本地验证（2026-10-06）。

## 方案选择

1. **推荐：独立指南 + FAHINT 型号对照 + 采购清单。** 复用现有文章功能，既能解释选型区别，也能从 Blog、系列页和资料中心进入；不需要维护新系统。
2. **只扩展系列页问答。** 改动少，但不便集中比较尺寸与固定方式，也缺少可单独分享的完整采购说明。
3. **新增交互式面板匹配器。** 需要经过验证的设备、面板及安装组件配套关系；目前资料不足，且与现有产品工具重复，本轮不做。

## 外部研究与使用边界

已通过网络检索读取以下品牌官方页面。没有 Google 实时排名、关键词搜索量或 Search Console 数据，不虚构指标，也不把内容更新写成排名或 AI 引用保证。

| 原始来源 | 可用于文章的采购概念 | 不能迁移给 FAHINT 的内容 |
| --- | --- | --- |
| [Leviton Residential Wallplates](https://leviton.com/products/residential/wallplates) | 开孔样式与外框尺寸是不同的选择维度；不能只看“单联面板”这个名称 | Leviton 的 standard / midway / oversized 尺寸、材质和具体兼容关系 |
| [Legrand radiant 1-Gang Screwless Wall Plate](https://www.legrand.us/wiring-devices/radiant-collection/wall-plates/radiant-1-gang-screwless-wall-plate-white/p/rwp26wcc10) | 无外露螺丝的面盖与其安装组件不是同一概念；该产品明确限定配套系列，说明采购时仍须核对适配范围 | radiant 的专用配套关系、底板结构、包装内容、材质或尺寸 |

访问日期：2026-10-04。其他 Leviton 博客页面未能取得完整正文，不作为本篇依据。行业参考用于解释选择方法；FAHINT 的规格以自己的记录和图纸为依据。采用原创表述，不复制同行图片或营销文案；相关段落和来源区提供直接链接。

## FAHINT 资料依据

已核对 `src/data/catalogProducts.js` 输出的 wallplates 系列、`src/data/catalog/legacy-products.json`、`src/data/catalog/catalogue-products.json`、`src/data/buyingGuides.js` 及现有证书目录记录。

当前有 **21 个已发布条目 / 配置**，其中包含光面与哑光变体；不能称为 21 个互不相关的基础型号。无需把全部条目复制到文章。

尺寸图已目视检查：

- BS1801：`public/assets/images/catalog/models/b63098eef2441a8e.webp`，宽 70 mm、高 115 mm。
- BS1802：`public/assets/images/catalog/models/bfc45357fab9e26c.webp`，宽 79.5 mm、高 123.9 mm。
- BS1803 G / M 系列：`public/assets/images/catalog/models/73b08caf47cc201b.webp`，一联宽 75 mm、高 120 mm；二至四联分别宽 121.2 / 167.4 / 213.6 mm，高均为 120 mm。

公开对照表采用以下 8 个代表配置，尺寸统一写为 **宽 × 高（mm）**，不混入开孔尺寸。型号链接各自的产品详情：

| Model | Opening / gangs | Finish / fixing | Exterior W × H |
| --- | --- | --- | --- |
| BS1801 | Decorator / 1 | Glossy / Screw-fixed | 70 × 115 mm |
| BS1802 | Mid-Size Decorator / 1 | Glossy / Screw-fixed | 79.5 × 123.9 mm |
| BS1804 | Duplex / 1 | Glossy / Screw-fixed | 70 × 115 mm |
| BS1806 | Toggle / 1 | Glossy / Screw-fixed | 70 × 115 mm |
| BS1807 | Blank / 1 | Glossy / Screw-fixed | 70 × 115 mm |
| BS18012 | Decorator / 2 | Glossy / Screw-fixed | 116 × 115 mm |
| BS1803-G | Decorator / 1 | Glossy / Screwless | 75 × 120 mm |
| BS1803-M | Decorator / 1 | Matte / Screwless | 75 × 120 mm |

BS1801、BS1802、BS1803-G 的原始页面分别为 `https://www.fahint.com/?pro7/283.html`、`https://www.fahint.com/?list_50/291.html`、`https://www.fahint.com/?list_49/296.html`，记录用于追溯；文章优先链接本站已整理的产品页。

**必须保留的区别：**

- Decorator、Duplex、Toggle、Blank 是不同开孔配置；按设备的实际面形与图纸核对，不承诺所有同名产品均通用。
- 一至四联描述安装位数量，不能按按钮数量推断。网站已发布的多联示例以 Decorator 为主，不补造缺失的其他多联配置。
- 螺丝固定款和无螺丝款的外框尺寸不同；不能借用一个系列的尺寸描述另一个系列。
- BS1805 的发布分类是 Extension，不将其擅自改称 Jumbo 或一般装饰面板；本篇短表不纳入它。
- 部分螺丝固定哑光条目的 `-M` 是网站用于区分表面效果的标记，原网站使用相同基础型号；订单仍需明确 Matte。不能把这一规则套用到所有 `-M` 型号，BS1803 M / G 本身具有相应来源型号标记。
- 相同颜色名称、相同联数或相同开孔类别都不构成跨品牌兼容、材料一致或包装组件齐全的证明。

## 已发现的资料冲突与承诺边界

BS1802 尺寸图标注厚度 6.4 mm，原始参数表标注 6.5 mm；其营销描述写 PC，Construction 字段写 Thermoset Plastic。**本篇只采用一致的宽、高，不引用有争议的厚度或材料；不通过文章修改或猜测修复目录记录。** 后续如修订产品资料，应另行取得公司确认。

文章中的采购清单应要求确认具体材料、厚度及配套组件，但不能给出当前资料无法支撑的耐冲击、阻燃、防紫外线或其他性能承诺。光面 / 哑光属于表面效果，不当作材料名称。

现有证书目录中的 wallplates 文件范围不是全部 21 个条目。本文链接 `/resources?family=wallplates`，提示逐型号确认文件；本轮未重新审阅 PDF，不新增认证范围判断，也不改动证书。

不提供电气接线或带电安装步骤；不承诺通用适配、所有订单包含面板或螺丝、不凭照片确认实际颜色；不新增 MOQ、交期、质保或市场合规保证。

## 标题选择与页面搜索信息

先比较 10 个标题，再编写正文：

1. **Wallplate Buying Guide: Openings, Sizes and Finishes**（选定）
2. How to Choose Wallplates for Your Product Order
3. Choosing Wallplates: A Guide to Fit and Finish
4. Wallplate Selection: Openings, Gangs and Exterior Sizes
5. Screw-Fixed or Screwless? A Wallplate Buying Guide
6. Before You Order: A Wallplate Specification Checklist
7. Matching Wallplates to Switches and Receptacles
8. FAHINT Wallplates: Comparing Published Configurations
9. From Opening to Finish: Specifying a Wallplate
10. Wallplates for Projects and Private-Label Orders

选定标题直接覆盖读者的选择问题，不使用 best、universal 或 guaranteed 等无法证明的承诺。

- Slug：`wallplate-buying-guide`。
- Category：`Buying Guide`。
- Excerpt：“Compare wallplate openings, gang counts, exterior sizes and finishes. Use FAHINT model examples and a practical checklist to prepare a quotation request.”
- 发布和更新日期使用实际加入网站的日期，不伪造历史时间。
- 约 900–1,100 英文词，以清晰为先，阅读时长按完成稿确定。
- 主题：wallplate selection、wallplate sizes、screw-fixed vs screwless wallplates；它们是内容方向，不是已验证搜索量的关键词。

## 文章结构

开篇先给简明答案：先确认设备开孔和联数，再分别核对外框宽高、固定方式及表面效果；外观相近不等于可互换。将解释与型号表、采购下一步连起来，不写成产品目录复述。

1. **Match the device opening** — 解释 Decorator、Duplex、Toggle、Blank；以 FAHINT 对应型号为例，配套关系仍以图纸和样品为准。
2. **Count gangs, not buttons** — 区分设备安装位与单个设备上的按钮；介绍已发布的一至四联配置，链接完整系列。
3. **Check exterior size separately** — 同样是一联，BS1801、BS1802、BS1803-G 的外框尺寸并不相同；覆盖范围与设备开孔分别核对，不导入同行标准尺寸。
4. **Compare FAHINT wallplate configurations** — 使用上述四列、八行表格；明确是代表配置，不是完整兼容清单。
5. **Specify fixing style and pack contents** — 比较外露螺丝款与无外露螺丝款的选购重点；询问配套底板、固定件和包装内容，不推断所有 FAHINT 无螺丝款与同行结构相同，也不写安装步骤。
6. **Approve finish, fit and model documents** — 光面 / 哑光、颜色样品、网站型号标记、材料、厚度和所需文件；保留现有表面效果文章链接。
7. **Prepare a wallplate quotation request** — 列出面板型号、搭配设备型号及图纸、开孔与联数、尺寸限制、固定方式、颜色与表面、数量、独立或配套包装、授权品牌要求、样品与文件需求。

保留现有文章目录、行业来源区、采购用途提示和技术询问 CTA，不增加重复 FAQ 或虚构问答结构化数据。

## 图片与样式

使用现有 `assets/images/editorial-home/category-wallplates-scene.webp`（1600 × 900），已检查画面。它是面板陈列示意，不是客户安装案例或材质性能证明。目前其他博客封面未使用这张图，无需生成新图。

- Alt：“Single- and multi-gang wallplates arranged on a dark display surface in an illustrated scene.”
- Caption：“Illustrated wallplate configurations. Confirm the selected model’s dimensions, material and finish from its product documents and sample.”
- 封面来源注明现有 FAHINT 场景示意素材，不归为工厂实拍。
- 复用现有响应式文章、圆角、目录和可横向滚动表格；不改 BlogPost 渲染逻辑或新增 CSS。

## 接入与最小实现边界

使用现有 `posts` 注册及 h2 / p / table / list 数据块，沿用页面搜索信息、Article 元信息、预渲染和 sitemap 机制。

- 新增 `src/data/wallplateBuyingGuide.js` 及针对性测试。
- 在 `src/data/posts.js` 注册文章。
- 将 `src/data/buyingGuides.js` 的 `wallplates.resource` 改为本指南；原 `/blog/gfci-colour-finishes-specification` 入口通过新指南正文保留。
- 在 `src/pages/Resources.jsx` 已有 USB、调光器指南入口旁补充面板指南，不替换下载功能或重做资料中心。
- `public/sitemap.xml` 增加 `/blog/wallplate-buying-guide`，不改域名。
- 只调整受文章数量影响的断言，补新路由的预渲染与子路径链接覆盖。

入口为 Blog、Wallplates 系列采购提示及 Resources；正文链接八款产品详情、`/products/wallplates`、`/resources?family=wallplates`、已有表面效果文章，继续使用 `/contact?topic=technical` CTA。型号路由使用既有小写 SKU slug，不新增路由规则，不自动添加产品到询价清单。

## 内容与验证标准

- 五轮校对：结构、清晰度、证据、行文、标题与页面搜索信息。
- 明确区分行业概念、FAHINT 发布参数及待确认事项，来源直接支持相邻陈述。
- 八个型号表的开孔、联数、固定方式、表面与外框尺寸逐项核对；不混写宽高，不将外框尺寸说成开孔尺寸，不使用争议厚度或材料。
- 明确表格不是跨品牌兼容清单；不把 21 个配置称为 21 个独立基础型号，不将所有哑光型号后缀归为网站自行添加。
- 三个入口及产品链接有效，USB、调光器指南、表面效果文章和资料下载保持可达。
- 有一个 H1、正确摘要与 Article 元信息、完整预渲染正文，所有内部链接适应现有 GitHub Pages 子路径。
- 表格保留可访问名称、行列标题与键盘滚动；本地桌面和 390px 手机预览检查正文及页面整体无横向溢出。
- 实施时先运行针对性的失败测试，再写内容与接入；完成后运行相关测试、完整现有测试和生产构建，并检查预览与控制台。
- 本轮仅写方案，不把上一次指南的测试结果当作本次验证；不额外重跑慢网基准或重构字体、目录和性能工具。
- 只提交本任务文件；保留无关未跟踪项目 `%SystemDrive%/`、`.planning/` 和 `Start-FAHINT-Preview.cmd`。

## 自查结果与下一步

方案收敛为一篇已有模板可承载的采购指南，没有新子系统、图片制作或未定义的兼容性承诺。来源尺寸、网站型号别名、证书范围和示意图性质均有边界；发现的原始资料冲突不会被当作已确认事实写入正文。

2026-10-06 用户确认后已完成文章、三个入口及本地验证。详细记录见 `docs/superpowers/plans/2026-10-06-wallplate-buying-guide.md`。文章保留全部资料边界，测试及构建通过，桌面和手机预览已检查。本次实施未提交、推送、合并或部署，等待用户查看本地效果。
