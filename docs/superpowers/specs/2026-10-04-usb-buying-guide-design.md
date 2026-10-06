# USB 插座采购指南：研究与内容设计

日期：2026-10-04

## 已确认的任务

新增一篇英文 USB 插座采购指南，参考同行及市场上的原始资料，再结合 FAHINT 已发布型号。打通“读指南 → 筛选型号 → 对比 → 询价清单”，并在 USB 系列页、Blog 和 Resources 提供入口。

沿用网站现有深蓝、蓝绿、浅灰、圆角、字体和博客模板；不重新设计页面，不增加内容管理系统、依赖或另一套选型工具。不配置域名、邮件直达或统计服务，不自动推送、合并、部署，不发送真实询价。由主代理完成。

## 研究方法与限制

已通过网络检索并读取 Leviton、Legrand、Eaton 和 USB-IF 的官方资料。当前环境直接打开 Google 搜索页失败，因此本轮不能声称检查过 Google 的实时排名、搜索量或完整结果页。没有 Search Console 或关键词工具数据，不编造流量、需求量及排名结论。

同行资料用于提炼采购问题、信息组织方式及通用概念；FAHINT 型号参数只来自本项目已核对的产品资料。不会照搬同行文案、图片、价格、质保、安全特性或充电速度承诺。

### 外部参考与可借鉴之处

| 原始资料 | 本轮使用方式 | 不推导的结论 |
| --- | --- | --- |
| [Leviton USB 产品手册](https://leviton.com/content/dam/leviton/residential/product_documents/brochure/USB_Brochure.pdf)，末页选型表 | 把接口组合、单口功率、总功率和交流插座额定值分开说明 | 不把其型号功率分配或“几倍更快”的宣传用于 FAHINT |
| [Legrand radiant 65W 产品页](https://www.legrand.us/wiring-devices/radiant-collection/radiant-65w-usb-outlet-type-c-15a-tamper-resistant-black/p/rd-r26usbpd65bk) | 将设备用途、USB 参数、15A 交流额定值、尺寸和面板选项分开组织 | 不宣称 FAHINT 已验证其列出的笔记本型号、指示灯功能、寿命或安装时间 |
| [Eaton USB 产品系列](https://www.eaton.com/us/en-us/catalog/wiring-devices-and-connectivity/usb-receptacles.html) | 参考“使用需要 → 电气选择 → 深度/安装空间 → 对比”的信息顺序 | 不把其单口输出、安装结构或适用场所直接套给 FAHINT |
| [USB-IF 接口命名与能力说明](https://www.usb.org/sites/default/files/usb_type-c_language_product_and_packaging_guidelines_20230320.pdf)，第 3 页 | 解释 USB-C 接口形式与 USB Power Delivery 是不同维度；有 USB-C 不代表支持 PD | 不宣称 FAHINT 获得 USB-IF 认证，不使用 USB-IF 认证标志 |

访问日期均为 2026-10-04。公开文章中的引用紧跟对应解释，页末列原始来源；同行来源明确标为行业参考，不作为 FAHINT 型号参数依据。

### FAHINT 已核对的内容依据

以 `src/data/catalogProducts.js` 输出的 `specificationSummary`、`specificationGroups` 为准，并对照 `src/data/catalog/catalogue-products.json` 和 `docs/product-data/usb-presentation-source-map.md`。当前 USB 系列共 37 个已发布型号。

| 型号 | 接口 | 交流部分 | 当前公开的 USB 输出 | 文章必须说明 |
| --- | --- | --- | --- | --- |
| FTR15-3100 | 双 USB-A | 15A、125V、NEMA 5-15R | 合计 5V DC / 3.1A | 合计值不是每个接口都能同时获得的数值 |
| FTR15C-3100 | USB-A + USB-C | 15A、125V、NEMA 5-15R | 合计 5V DC / 3.1A | 这是带 USB-C 的常规 5V 型号，不按 PD 型号介绍 |
| FTR15QC-DC20W | 双 USB-C | 15A、125V、NEMA 5-15R | 每个 USB-C 接口标注最高 PD 20W；5V/3A、9V/2.22A、12V/1.67A | 双口同时使用时的功率分配须确认 |
| FTR15QC-DC36W | 双 USB-C | 15A、125V、NEMA 5-15R | 每个 USB-C 接口标注最高 PD 36W；包括 12V/3A、15V/2.4A、20V/1.8A | 双口同时使用时的功率分配须确认 |
| FTR15QC-DC65W | 双 USB-C | 15A、125V、NEMA 5-15R | 每个 USB-C 接口标注最高 PD 65W；包括 20V/3.25A | 不能写成双口总计 130W，也不能承诺两个接口同时各 65W |
| FTR20QC-DC65W | 双 USB-C | 20A、125V、NEMA 5-20R | 每个 USB-C 接口标注最高 PD 65W；包括 20V/3.25A | 与上述 15A 型号的交流额定值不同，不据此宣称 USB 充得更快 |
| F4P | 四个 USB-A | 输入 125V / 60Hz；无交流插孔 | USB 合计 5V DC / 4.2A / 21W | 属于 USB 专用墙面充电器，不能描述为带四个交流插座 |

详细型号链接使用现有 `/products/usb-outlets/<型号小写>` 路径。公开表格简化为已发布的关键数值，不把完整规格表搬进文章。

采购确认项还包括：实际设备及线缆、单口与多口工作要求、型号尺寸、面板、颜色、包装、数量、目的地及相关文件。部分型号没有公开的原始尺寸图，不能用相邻型号推算。文章不提供接线教程或特定电路适用性结论。

## 内容路线选择

1. **推荐并采用：一篇实用采购指南 + FAHINT 型号示例 + 现有工具入口。** 先解决购买问题，再让读者选型，范围与本轮授权一致。
2. 只增加 USB 系列页 FAQ：改动更少，但不便独立分享，无法充分解释功率及采购要求。现有 FAQ 保留，入口指向新指南，不重复堆叠长文。
3. 独立专题站或新增交互选型器：成本更高，重复现有筛选/对比功能；本轮不做。

## 文章定位

- 读者：为北美市场选型的分销商、品牌采购、项目采购。
- 意图：了解 USB 墙面插座如何选择，比较 USB-A/C 与 PD 输出，并准备准确的询价。
- 主主题：USB wall outlet buying guide。
- 补充问题：USB-C versus PD、single-port versus shared power、15A versus 20A、20W/36W/65W、quotation checklist。
- 不做“最好的插座”排名、竞品优劣榜或未经实测的兼容设备清单。
- 定位为采购参考，不冒充安装规范或第三方测评。
- URL：`/blog/usb-wall-outlet-buying-guide`。
- 分类：`Buying Guide`；日期为实际完成日期，不回填虚构的历史更新时间。
- 建议题目：**USB Wall Outlet Buying Guide: Ports, PD and Power**。
- 摘要方向：帮助采购人员分别核对接口、PD 功率、双口同时输出、交流额定值及样品要求，并使用 FAHINT 型号示例完成初选。
- 约 1,000–1,300 英文词，按讲清问题所需长度调整，不为凑 SEO 字数加段落。

### 正文结构

1. **Start with the devices and cables, not the highest wattage.** 开头直接给出选择顺序：设备/线缆 → 接口 → 输出配置 → 安装与文件 → 样品和询价。办公室、床头、酒店等仅作需求示例，不作型号安装许可或兼容性保证。
2. **USB-A, USB-C and PD: what are you choosing?** 用 FTR15C-3100 与 PD 型号说明接口形状不决定是否支持 PD；四口 F4P 与带交流插孔的产品分开。
3. **Single-port output is not the same as shared output.** 解释合计、单口、同时使用三个概念；用 FAHINT 已发布数据举例，突出 PD 双口分配仍需确认。不要把 20W/36W/65W 硬套为手机/平板/笔记本的固定分界。
4. **Choose the AC rating separately.** 用 FTR15QC-DC65W 与 FTR20QC-DC65W 说明交流部分差异；实际电路、位置与安装须由合格专业人员核对。只解释参数，不给换插座或接线步骤。
5. **A practical FAHINT shortlist.** 七个代表型号组成一张紧凑表：型号链接、接口、交流部分、公开充电参数。表下紧邻写明双口功率分配未公开，不暗示所有型号已通过某种通用兼容测试。
6. **Check fit, finish and documentation before ordering.** 查看该型号尺寸与原始资料，确认面板是否单独采购；具体认证范围和现行状态需核对，不把 ISO 9001 当产品认证。
7. **What to put in your quotation request.** 简短清单：型号/数量、目标设备和线缆、所需输出和多口要求、颜色与面板、样品与文件、包装/品牌标识、目的地与期望时间。MOQ、交期和可定制范围以实际报价确认。

开头是可独立理解的直接回答；每个小标题回答一个采购问题。正文以原创解释和本厂实例为主，外部引用用于可核对的通用事实，不拼接同行宣传语。

## 内链与页面呈现

- Blog：新文章按现有列表机制出现，不另建专题框架。
- USB 系列页：复用 `BuyingGuide` 的现有资源链接，改成指向新指南。原证书入口仍在资源中心及型号页可达。
- Resources：增加一个简洁的 USB 选型指南入口，复用现有文字/链接样式，不增加新的图文卡片系统。
- 文章到目录：提供“Browse USB outlet models”，链接到 `/products/usb-outlets`；在相关段落提供 A+C 或 PD 筛选链接，使用现有 `ports` / `charging` 参数。
- 型号表：型号名称链接到真实产品页。读者在系列页或型号页使用已有比较和询价清单功能，不由文章自动选择产品或修改清单。
- 文章到资料：链接 `/resources?family=usb-outlets`，并保留型号文档确认提示。
- 文章到联系：复用现有联系机制；不新建提交接口，不预填未经用户选择的产品配置。
- 封面复用 `assets/images/editorial-home/product-usb-optimized.webp`，以实际图像核对后的 alt 和“应用示意图”说明呈现，不说成真实项目照片或图中型号的性能证明。不下载同行图片。
- 复用现有文章目录、日期、来源区和安全提示。为需要比较的型号提供原生语义表格，为询价项提供列表；仅补充这两种正文块所需的最小渲染支持。
- 手机端表格在局部容器内横向滚动，给出可理解的表题和列标题；正文及整个页面不能横向溢出。沿用现有颜色、字号、圆角、按钮和焦点样式。

## 搜索与可核查性

- 保持现有 Article / Breadcrumb 元数据与完整正文预渲染机制；文章中可见的信息与结构化数据一致。
- 加入现有 sitemap，仅新增文章路径，不改变既有域名策略或查询参数的规范链接规则。
- 不增加虚构专家作者、reviewed-by、测试结果、销量、评分或认证。
- 不宣称这篇文章保证排名、流量或被 AI 引用；目标是增加可访问、可核对、与实际产品相关的采购内容。
- 维持 Blog、Resources 和 USB 系列到指南的直接链接，防止新文章成为孤立页。

## 实施与验收边界

复用现有 posts 数据、BlogPost、BuyingGuide、Resources、元数据与构建机制；不复制目录系统，不改原有文章 URL，不重构整个博客。

验证集中在本次新增内容：

1. 七个示例型号和关键数值与当前目录一致；没有总计 130W、所有设备兼容、固定充电时间或泛化认证等错误承诺。
2. 新文章的目录、来源、表格、列表及入口链接正确，筛选参数可恢复；不误选或清空已有比较/询价项。
3. 新文章一处 H1，标题/描述/Article 元数据有效，公开 HTML 含正文和型号表，sitemap 覆盖新增路径。
4. 既有文章保持原显示方式；原先固定为 6 篇的测试更新为 7 篇，已有封面说明要求保留。
5. 桌面与手机检查阅读布局、局部表格滚动、焦点和点击目标；根路径与 GitHub Pages 子路径链接可用。
6. 运行相关内容/页面/部署测试和构建，不为一篇指南重复全套慢网跑分；不发送真实邮件、不部署。

## 标题候选

按内容策略先列候选，再写正文；第 1 个最直接覆盖采购意图。

1. USB Wall Outlet Buying Guide: Ports, PD and Power
2. How to Choose a USB Wall Outlet for Your Product Range
3. USB-A, USB-C or PD? A Guide to Wall Outlet Selection
4. Choosing USB Wall Outlets: A Buyer’s Checklist
5. USB Outlet Power Explained: Single Ports and Shared Output
6. Comparing USB Wall Outlets Beyond the Wattage
7. 20W, 36W or 65W? Questions to Ask Before Choosing
8. USB Wall Outlets: From Device Requirements to a Shortlist
9. What to Check Before Ordering USB Charging Outlets
10. USB Charging Outlets: Ports, Ratings and Sample Approval

## 状态与自查

- 项目核查完成：现有文章 6 篇，USB 已发布型号 37 个；筛选、对比、询价清单和正文预渲染已存在。
- 范围已明确：一篇英文指南及必要入口，现有品牌风格不变；无需视觉方案讨论或新增需求问卷。
- 来源与产品参数已分开；未公开的多口输出、认证状态和商业承诺保留为确认项，不擅自补值。
- 已检查占位内容、内部矛盾、任务边界和含糊要求；本文没有待填的型号或虚构测试结果。
- 后续英文正文经过结构、清晰度、事实/来源、逐句编辑、标题与 SEO 五轮检查。
- **本文件是实施前设计，不代表文章已经上线。按 brainstorming 技能的书面方案审阅要求，等待用户确认本文件后，再写实施计划并修改网站。**
