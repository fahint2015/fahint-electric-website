# 部署指南 — Cloudflare Pages

## 当前正式部署

- GitHub 仓库：`fahint2015/fahint-electric-website`，生产分支为 `main`。
- Cloudflare Pages 项目：`fahint-electric-website`，构建命令 `npm run build`，输出目录 `dist`，环境变量 `SITE_BASE=/`。
- 主网址：`https://fahint.com`；`www.fahint.com` 已绑定同一 Pages 项目，并通过 Cloudflare 301 规则跳转到根域。
- `.env.production` 中的 `VITE_SITE_URL=https://fahint.com` 同时供浏览器构建和静态 SEO 生成使用；若在 Cloudflare 配置同名环境变量，值也应为 `https://fahint.com`。
- 修改网站后推送到 `main`，由 Pages 自动构建部署。域名迁移时同步更新 `public/robots.txt`、`public/sitemap.xml` 和正式网址配置。

## 询盘邮件配置

`functions/api/inquiry.js` 提供 Cloudflare Pages 后台发信接口。使用 Resend 的 `notify.fahint.com` 发信子域和 Turnstile 人机验证，通知固定发到 `louis@fahint.com`，邮件回复地址为客户填写的邮箱。

配置步骤、生产环境变量和收信验证见 [docs/inquiry-email.md](docs/inquiry-email.md)。发信域名及密钥配置完成后再同时启用 `VITE_INQUIRY_ENDPOINT` 和 `VITE_TURNSTILE_SITE_KEY`；未启用时网站沿用打开邮件软件的表单流程。

以下章节保留原 GitHub Pages 部署方案作为迁移参考；当前正式网站使用上面的 Cloudflare Pages 配置。

下面的旧 GitHub Pages 方案仅发布静态页面；Cloudflare 正式站点另可运行上面的询盘 Function。

---

## 一、上传到 GitHub

在项目根目录（`fahint-gfci`）执行：

```bash
git init
git add .
git commit -m "Fahint GFCI website"
git branch -M main
git remote add origin https://github.com/<你的账号>/<仓库名>.git
git push -u origin main
```

> `node_modules` 和 `dist` 已在 `.gitignore` 中排除，不会上传。

---

## 二、开启 GitHub Pages

1. 打开仓库 → **Settings** → **Pages**
2. **Source** 选择 **GitHub Actions**（不要选 "Deploy from a branch"）
3. 保存后回到 **Actions** 标签页，工作流 `Deploy to GitHub Pages` 会自动运行

首次部署约需 1–2 分钟。完成后会得到一个地址：
`https://<你的账号>.github.io/<仓库名>/`

---

## 三、设置 SITE_BASE（重要）

站点的资源路径取决于最终访问域名，通过仓库变量控制。

打开仓库 → **Settings** → **Secrets and variables** → **Actions** → **Variables** 标签 → **New repository variable**

| 场景 | 变量名 | 值 |
|---|---|---|
| 用自己的域名（推荐，配 Cloudflare） | `SITE_BASE` | `/` |
| 用自己的域名 | `CUSTOM_DOMAIN` | `www.fahint.com` |
| 只用 GitHub 默认域名 | `SITE_BASE` | `/<仓库名>/` |

**如果你要接 Cloudflare 自有域名，就设置 `SITE_BASE=/` 和 `CUSTOM_DOMAIN=www.fahint.com`。**

设置后，去 Actions 页面点 **Re-run all jobs** 重新构建一次。

---

## 四、接入 Cloudflare

### 4.1 域名托管到 Cloudflare

1. 登录 Cloudflare → **Add a site** → 输入 `fahint.com`
2. 选择 Free 套餐
3. Cloudflare 会给你两个 nameserver（形如 `xxx.ns.cloudflare.com`）
4. 到你的域名注册商后台，把 nameserver 改成 Cloudflare 给的两个
5. 等待生效（通常几分钟到几小时）

### 4.2 添加 DNS 记录

在 Cloudflare → **DNS** → **Records** 添加：

**方案 A：使用 www 子域名（推荐，最省事）**

| Type | Name | Target | Proxy |
|---|---|---|---|
| CNAME | `www` | `<你的账号>.github.io` | 🟠 Proxied |
| CNAME | `@` | `<你的账号>.github.io` | 🟠 Proxied |

**方案 B：根域名走 A 记录**

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 🟠 Proxied |
| A | `@` | `185.199.109.153` | 🟠 Proxied |
| A | `@` | `185.199.110.153` | 🟠 Proxied |
| A | `@` | `185.199.111.153` | 🟠 Proxied |
| CNAME | `www` | `<你的账号>.github.io` | 🟠 Proxied |

> 这四个 IP 是 GitHub Pages 的官方 A 记录地址。

### 4.3 在 GitHub 绑定域名

仓库 → **Settings** → **Pages** → **Custom domain** → 填 `www.fahint.com` → Save
勾选 **Enforce HTTPS**（可能需要等几分钟证书签发）。

### 4.4 Cloudflare SSL 设置（关键）

Cloudflare → **SSL/TLS** → **Overview** → 加密模式必须选 **Full**（不能选 Flexible，否则会无限重定向）。

### 4.5 推荐的 Cloudflare 优化

- **Speed → Optimization**：开启 Brotli
- **Caching → Configuration**：Browser Cache TTL 设为 4 hours 或更长
- **Rules → Page Rules**（可选）：对 `www.fahint.com/assets/*` 设置 Cache Level: Cache Everything，Edge Cache TTL: 1 month

---

## 五、以后怎么更新内容

改完代码后：

```bash
git add .
git commit -m "更新产品信息"
git push
```

推送到 `main` 分支会自动触发重新构建和部署，1–2 分钟后线上生效。
如果配了 Cloudflare 缓存，可在 Cloudflare → **Caching** → **Purge Everything** 立即刷新。

---

## 六、常见内容修改位置

| 想改什么 | 改哪个文件 |
|---|---|
| 公司名、邮箱、电话、地址、数据统计、FAQ | `src/data/company.js` |
| 产品型号、规格、特性、颜色 | `src/data/products.js` |
| 产品图片 | `public/assets/images/products/` |
| 配色、字号、圆角等设计变量 | `src/styles.css` 顶部的 `:root` |
| SEO 标题和描述 | `index.html` |
| 站点地图 | `public/sitemap.xml` |

---

## 七、本地预览

```bash
npm install
npm run dev      # 开发模式，改代码自动刷新
npm run build    # 生产构建，产物在 dist/
npm run preview  # 预览生产构建结果
```

---

## 关于询盘表单

静态站点没有后端，表单提交会调起访客自己的邮件客户端并自动填好内容，发送到 `louis@fahint.com`。

如果以后想要「访客点提交、后台直接收到邮件」而不弹出邮件客户端，可以免费接入 [Formspree](https://formspree.io/) 或 [Web3Forms](https://web3forms.com/)：注册后拿到一个 endpoint URL，把 `src/components/InquiryForm.jsx` 里的 `submit` 函数改成 `fetch(endpoint, { method: 'POST', body: ... })` 即可，不需要改动其他任何地方。
