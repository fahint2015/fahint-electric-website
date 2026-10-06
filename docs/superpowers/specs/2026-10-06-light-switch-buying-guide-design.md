# 照明开关采购指南 · 已确认设计

日期：2026-10-06。状态：用户已确认本稿，按“先修正有依据的说明、补齐已有文件，再完成指南，争议参数暂不改”的范围实施。配套依据见 `docs/product-data-audit-2026-10-06.md`。

## 目标与推荐方案

沿用当前网站英文采购文章样式，面向北美市场的进口商、经销商和项目采购者。帮助读者区分控制方式、外形和额定值，并找到 FAHINT 的具体型号及对应资料。

三种做法：

1. **独立采购指南（推荐）**：完整说明选择顺序、六款产品及订货信息；从分类页和资源页进入。适合承接产品研究问题，和已有 USB、调光器、墙板指南一致。
2. 只扩充分类页 FAQ：改动更少，但型号对照和文件边界很难在短问答中解释清楚。
3. 新增交互选型器：这次只有六款常规开关，已有产品工具；新增一套交互会重复功能，本轮不做。

不改配色、版式、图片或文章渲染器，不增加新依赖、自动写作系统或 SEO 插件。

## 文章信息

- 推荐标题：**Light Switch Buying Guide: Single-Pole, 3-Way and Combination**。
- 路径：`/blog/light-switch-buying-guide`。
- 语言：英文；采用现有作者/文章元数据结构，不虚构专家署名或审核经历。
- 内容数据：新增 `src/data/lightSwitchBuyingGuide.js`，通过 `posts.js` 注册。
- 封面：复用已存在的 `assets/images/editorial-home/category-switches-optimized.webp`，实施时确认裁切与加载效果；不生成替代产品照片。

备选标题记录（无搜索量或排名推断）：

1. Light Switch Buying Guide: Single-Pole, 3-Way and Combination
2. How to Specify Light Switches for a Product Order
3. Single-Pole vs 3-Way Switches: A Buyer’s Guide
4. Choosing Paddle, Toggle and Combination Switches
5. Light Switch Specifications to Confirm Before Ordering
6. Buying Light Switches: Control Type, Rating and Wallplate Fit
7. Comparing FAHINT Lighting Switch Models
8. What to Include in a Light Switch RFQ
9. Combination Switches: Buttons, Gang Count and Ratings
10. How to Match Light Switches to a Project Schedule

推荐首个标题：覆盖文章实际比较范围，不使用“ultimate”“best”或不实优势词。

## 正文结构

1. **从控制需求开始**：一处控制、两处控制、同一面板控制不同灯路。说明 3-way 不是三按键；不展开接线操作。
2. **外形不是控制方式**：paddle / toggle 和 single-pole / 3-way 是两组不同属性。组合开关的按键数量也不是墙板联数。
3. **六款 FAHINT 对照表**：DS15、DS15.3、DS1502、DS1503、T15、T15.3；列外形/控制、目录额定值、产品链接。明确 120/277V 与 125V 的区别，不把全系列写成相同电压。
4. **额定值与负载**：15A 不能乘以按键数；不把普通开关当调光器或电机控制器。具体负载、端子和安装要求以批准说明书为准，必要时链接现有调光器指南。
5. **墙板和表面搭配**：paddle/toggle 开孔、单联组合设备、颜色与 glossy/matte 样品确认；链接墙板指南，不承诺所有第三方面板通用。
6. **报价与文件检查清单**：型号、数量、控制位置、供电/负载、面板、表面、目标市场、包装及所需型号文件；使用现有产品询价入口，不另建表单。

证书部分严格区分：现有 E528137 附页列 DS15、DS15.3、T15；T15.3 需对应文件；DS1502/DS1503 旧记录引用 ETL，不能用其他开关的 UL 附页替代。归档文件列有型号也不等于已核验当前列名状态。

## 来源与写作边界

- FAHINT 参数：现有产品目录第 25 页与六个原始产品记录；证书范围以完整 PDF 附页为依据。
- Leviton 和 Legrand 的官方资料仅用于术语与选型逻辑，链接详见核查清单。不复制同行段落、参数、图库或服务承诺。
- 先写采购者实际需要作出的选择，再解释差异。避免重复模板句、空泛品牌赞美和每段相同的结尾提示。
- 编辑检查依次覆盖：事实、逻辑、自然英文、精简、采购行动；保留必要限定，不为“去 AI 化”删掉文件范围和安全边界。
- 不写未经证实的认证、交期、MOQ、质保、每按键独立满载能力或全品牌兼容；不提供接线步骤。
- 不新增法规性结论或第三方测试成绩，不承诺 SEO/GEO 排名效果。

## 入口、验证与范围

- 在 `buyingGuides.js` 的 lighting-switches resource 以及 Resources 现有指南区域添加文章入口；保留墙板分类入口在正文中。
- 更新站点地图与预渲染路由；复用当前标题、摘要、Article 结构化数据与站内链接机制。
- 测试六个型号链接、表格内容、精确证书限定、文章入口、站点地图和 SSR 输出；构建后检查手机表格溢出、目录锚点和桌面阅读效果。
- 先修正核查清单 A1 的 GTN 说明和 A2 的墙板文件入口；不由这篇文章顺手改写 B 类有争议参数。
- 保留之前未提交的墙板指南及其他本地改动。实施完成只提供本地预览，不自动推送、合并或部署，不更正域名或启用邮件直达。

## 草案自检

- 对照表型号、电压和原始目录一致；组合设备额定值不相加。
- 第三方概念资料与 FAHINT 产品证据明确分开。
- 证书缺口不表述为“未认证”，已列型号不表述为实时有效性保证。
- 复用现有文章模板，未引入新页面系统；实施范围明确。
