# Leone1111_online_notes 使用说明

这是一个 Astro 静态个人学术网站，用来展示你的个人主页、研究方向、科研博客、项目作品集、轻量笔记和联系方式。

你以后主要不需要改很多代码，大部分内容都集中在几个文件夹里。

## 1. 本地打开网站

在项目目录运行：

```bash
npm install
npm run dev
```

然后打开：

```text
http://127.0.0.1:4321/Leone1111_online_notes/
```

如果你是在普通终端里运行，也可能显示：

```text
http://localhost:4321/Leone1111_online_notes/
```

两个都可以。

## 2. 最常改的文件

### 修改个人信息

改这个文件：

```text
src/data/site.ts
```

这里可以改：

- 网站名字
- 网站标题
- 网站简介
- 邮箱
- GitHub 链接
- Google Scholar 链接
- 简历链接
- 研究方向
- 技能栈

重点字段：

```ts
export const site = {
  name: "Leone1111",
  email: "your-email@example.com",
  github: "https://github.com/Leone1111",
  scholar: "https://scholar.google.com/",
  resume: "/resume.pdf"
};
```

如果你要改邮箱，就改 `email`。

如果你要改 GitHub，就改 `github`。

如果你要改研究方向，就改下面的 `researchAreas`。

如果你要改技能栈，就改 `skills`。

## 3. 修改首页

首页文件在：

```text
src/pages/index.astro
```

首页主要展示：

- 个人简介
- 研究方向
- 代表项目
- 最新文章

首页最上方的大标题在这个组件里：

```text
src/components/Hero.astro
```

如果你想改首页第一屏的大字，例如：

```text
材料、机器学习与 DFT 方向博士生的研究主页。
```

就去改：

```text
src/components/Hero.astro
```

## 4. 修改 About 页面

About 页面在：

```text
src/pages/about.astro
```

这里适合改：

- 教育背景
- 研究兴趣
- 个人介绍
- 技能说明

如果只是改技能标签，优先改：

```text
src/data/site.ts
```

因为技能栈数据是从那里读取的。

## 5. 修改 Research 页面

Research 页面在：

```text
src/pages/research.astro
```

研究方向的数据主要在：

```text
src/data/site.ts
```

找到：

```ts
export const researchAreas = [
  ...
];
```

你可以在这里改：

- 高熵钠离子层状材料
- 机器学习材料筛选
- DFT 计算与机理分析

如果以后你有新的研究方向，也是在这个数组里新增一项。

## 6. 写博客文章

博客文章放在：

```text
src/content/blog
```

现在已经有示例：

```text
src/content/blog/ml-screening-layered-oxides.mdx
src/content/blog/dft-workflow-note.md
```

你以后新增博客，只要新建一个 `.md` 或 `.mdx` 文件。

示例：

```text
src/content/blog/my-new-paper-note.md
```

文章开头必须有这段信息，叫 frontmatter，可以理解成文章的基本信息：

```md
---
title: "文章标题"
description: "文章简介"
pubDate: 2026-05-20
tags: ["DFT", "论文笔记", "材料"]
draft: false
---
```

下面才是正文：

```md
## 研究背景

这里写正文。
```

如果你暂时不想让文章显示，把：

```md
draft: false
```

改成：

```md
draft: true
```

## 7. 写项目作品

项目放在：

```text
src/content/projects
```

现在有示例：

```text
src/content/projects/high-entropy-sodium-layered-materials.md
src/content/projects/dft-automation-toolkit.md
```

新增项目时，新建一个 `.md` 文件。

示例：

```text
src/content/projects/my-new-project.md
```

项目开头写：

```md
---
title: "项目标题"
description: "项目简介"
date: 2026-05-20
status: "Research Project"
tags: ["DFT", "Machine Learning"]
github: "https://github.com/你的用户名/项目仓库"
download: "https://你的网盘链接"
featured: true
---
```

字段解释：

- `title`：项目标题
- `description`：项目简介
- `date`：项目日期
- `status`：项目状态，比如 Research Project / Code Project
- `tags`：项目标签
- `github`：GitHub 链接
- `download`：OneDrive 或网盘链接
- `featured`：是否显示在首页代表项目里

如果不想放到首页，把：

```md
featured: true
```

改成：

```md
featured: false
```

## 8. 写轻量笔记

轻量笔记放在：

```text
src/content/notes
```

适合记录：

- 一个科研想法
- 一条文献线索
- 一个计算经验
- 一个临时备忘

新增笔记示例：

```text
src/content/notes/my-small-note.md
```

内容格式：

```md
---
title: "笔记标题"
description: "笔记简介"
pubDate: 2026-05-20
tags: ["科研记录"]
---

这里写轻量笔记正文。
```

当前 Notes 页面已经支持目录和详情页。新增一篇 `src/content/notes` 里的 Markdown 文件后，目录会自动出现新的笔记标题。

## 9. 修改联系方式

联系方式页面在：

```text
src/pages/contact.astro
```

但邮箱、GitHub、Google Scholar 这些数据主要来自：

```text
src/data/site.ts
```

所以你一般只需要改 `src/data/site.ts`。

Contact 页面还接入了一个公开 GitHub API，用来自动显示你的 GitHub 头像、公开仓库数量、关注者数量和最近更新时间。

API 组件在：

```text
src/components/GitHubApiCard.astro
```

当前调用的 API 地址是：

```text
https://api.github.com/users/Leone1111
```

这个 API 不需要密钥，适合静态网站。以后如果你换 GitHub 用户名，优先改：

```text
src/data/site.ts
```

里面的 `github` 链接即可。

## 10. 替换个人简历

当前简历文件是占位文件：

```text
public/resume.pdf
```

你以后把自己的真实简历 PDF 改名为：

```text
resume.pdf
```

然后替换掉：

```text
public/resume.pdf
```

网站里的 Contact 页面会自动指向它。

## 11. 修改网站样式

全局样式在：

```text
src/styles/global.css
```

这里可以改：

- 背景颜色
- 字体颜色
- 卡片样式
- 按钮样式
- 页面宽度
- 响应式布局

最重要的颜色变量在文件开头：

```css
:root {
  --bg: #f5f7fb;
  --surface: #ffffff;
  --ink: #14202b;
  --muted: #607080;
  --accent: #0f766e;
}
```

如果你想改网站主色，优先改：

```css
--accent: #0f766e;
```

## 12. 修改导航栏

导航栏组件在：

```text
src/components/Header.astro
```

导航数据在：

```text
src/data/site.ts
```

找到：

```ts
export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  ...
];
```

如果你想新增页面，也要在这里加导航。

## 13. 修改页面布局

布局文件在：

```text
src/layouts
```

主要有两个：

```text
src/layouts/BaseLayout.astro
src/layouts/ContentLayout.astro
```

解释一下：

- `BaseLayout.astro`：所有普通页面的基础外壳，包括标题、导航、页脚。
- `ContentLayout.astro`：博客文章和项目详情页使用的文章布局。

一般情况下，你不需要频繁改这里。

## 14. GitHub Pages 部署

部署文件在：

```text
.github/workflows/deploy.yml
```

上线前先在本地运行：

```bash
npm run build
```

如果构建成功，再把项目推送到 GitHub。

第一次上线时，进入 GitHub 仓库设置：

```text
Settings -> Pages -> Source -> GitHub Actions
```

之后每次推送到 `main` 分支，GitHub 会自动构建并部署。

当前项目已经为 GitHub Pages 准备好了这些文件：

```text
astro.config.mjs
.github/workflows/deploy.yml
public/.nojekyll
public/robots.txt
src/pages/sitemap.xml.ts
src/pages/404.astro
```

它们分别负责：

- `astro.config.mjs`：告诉 Astro 网站最终部署在哪个网址、哪个仓库路径下面。
- `.github/workflows/deploy.yml`：GitHub 自动安装、构建、发布网站。
- `public/.nojekyll`：告诉 GitHub Pages 不要用 Jekyll 处理静态文件。
- `public/robots.txt`：告诉搜索引擎可以访问网站，并指向 sitemap。
- `src/pages/sitemap.xml.ts`：自动生成网站地图，方便搜索引擎理解网站页面。
- `src/pages/404.astro`：访问不存在的页面时显示友好的 404 页面。

如果你的仓库名保持 `Leone1111_online_notes`，部署后的网址应该是：

```text
https://leone1111.github.io/Leone1111_online_notes/
```

## 15. 如果仓库名或用户名变了

改这个文件：

```text
astro.config.mjs
```

现在是：

```js
const site = process.env.SITE || "https://leone1111.github.io";
const base = process.env.BASE_PATH || "/Leone1111_online_notes";
```

如果你的 GitHub 用户名不是 `leone1111`，要改 `site`。

如果仓库名不是 `Leone1111_online_notes`，要改 `base`。

例如仓库名改成 `academic-homepage`，就写：

```js
const base = process.env.BASE_PATH || "/academic-homepage";
```

同时还要改：

```text
.github/workflows/deploy.yml
public/robots.txt
```

其中 `.github/workflows/deploy.yml` 里的 `SITE` 和 `BASE_PATH` 要和 `astro.config.mjs` 保持一致。

## 16. 不建议随便改的文件

这些文件是项目运行配置，先不要乱改：

```text
package.json
astro.config.mjs
tsconfig.json
src/content.config.ts
.github/workflows/deploy.yml
```

如果要改，最好先知道它的作用。

简单说：

- `package.json`：项目依赖和命令。
- `astro.config.mjs`：Astro 配置和部署路径。
- `tsconfig.json`：TypeScript 路径配置。
- `src/content.config.ts`：博客、项目、笔记的字段规则。
- `.github/workflows/deploy.yml`：GitHub Pages 自动部署。

## 17. 常用命令

启动开发环境：

```bash
npm run dev
```

构建网站：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

检查项目：

```bash
npm run check
```

## 18. 当前项目目录说明

```text
.
├── public
│   ├── .nojekyll
│   ├── favicon.svg
│   ├── robots.txt
│   └── resume.pdf
├── src
│   ├── components
│   ├── content
│   │   ├── blog
│   │   ├── notes
│   │   └── projects
│   ├── data
│   ├── layouts
│   ├── pages
│   │   ├── 404.astro
│   │   └── sitemap.xml.ts
│   ├── styles
│   └── utils
├── astro.config.mjs
├── package.json
└── README.md
```

最重要的一句话：

> 改内容，优先看 `src/content` 和 `src/data/site.ts`；改页面结构，看 `src/pages`；改样式，看 `src/styles/global.css`。
