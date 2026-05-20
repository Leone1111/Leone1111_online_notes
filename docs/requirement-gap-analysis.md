# 需求差距分析文档

项目：Leone1111_online_notes  
分析对象：当前 Astro 静态个人科研与知识分享网站  
分析日期：2026-05-20

## 0. 分析依据与说明

本分析基于当前项目代码、`README.md`、`AGENTS.md`、`astro.config.mjs`、`src/content.config.ts`、`src/pages`、`src/content` 和 `public` 目录。

用户要求参考的 `docs/current-implementation-audit.md` 当前在项目中不存在。因此本文件先记录该缺口，并基于现有代码继续完成需求差距分析。后续如果补充 `docs/current-implementation-audit.md`，建议再复核一次本文件。

当前项目的核心技术状态：

- 使用 Astro 构建静态网站。
- 支持 Markdown/MDX 内容集合。
- 已有 Blog、Notes、Projects、Research、About、Contact 等公开页面。
- 已有 GitHub Pages 部署配置。
- 当前没有后端服务、数据库、管理员登录、管理后台、文件上传接口。
- 当前文件下载主要通过外部链接，例如 GitHub、OneDrive 或网盘链接。

## 1. 当前已满足的需求

### 1.1 游客不需要注册和登录

已满足。

当前网站是静态公开站点，游客访问页面不需要注册、登录或身份验证。

相关位置：

- `src/pages/index.astro`
- `src/pages/blog/index.astro`
- `src/pages/notes.astro`
- `src/pages/projects/index.astro`
- `src/pages/contact.astro`

### 1.2 游客可以浏览公开内容

已满足。

当前内容通过 Astro 构建为静态 HTML 页面，游客可以直接浏览首页、研究方向、博客、笔记、项目和联系方式。

### 1.3 游客可以查看科研笔记、读书笔记、代码项目、项目资料

部分满足。

当前已有：

- Blog：适合放科研文章、文献笔记、读书笔记和科研思考。
- Notes：适合放轻量笔记。
- Projects：适合放代码项目、科研项目和资料链接。

但当前内容分类还不够细：

- 科研笔记和读书笔记没有完全分成独立频道。
- 项目资料主要是链接字段，还没有独立资料库。
- 代码项目还没有专门的文件上传、压缩包展示和版本管理。

### 1.4 游客可以下载公开文件

部分满足。

当前项目支持通过链接下载或打开资料：

- `public/resume.pdf`：简历 PDF。
- `src/content/projects/*.md` 里的 `download` 字段：可指向 OneDrive、网盘或其他外部文件地址。

但当前没有真正的站内文件库，也没有按 PDF、Word、Markdown、图片、zip 分类管理下载文件。

### 1.5 内容支持标题、简介、标签、时间

部分满足。

当前内容集合字段包括：

- Blog：`title`、`description`、`pubDate`、`updatedDate`、`tags`、`draft`
- Projects：`title`、`description`、`date`、`status`、`tags`、`github`、`download`、`featured`
- Notes：`title`、`description`、`pubDate`、`tags`

相关位置：

- `src/content.config.ts`

### 1.6 内容是否公开

部分满足。

Blog 已有 `draft` 字段，`draft: true` 的文章不会出现在博客列表和详情页路径中。

但 Projects 和 Notes 当前没有 `draft` 或 `visibility` 字段，因此无法统一控制公开/隐藏。

### 1.7 部署为公开网站

部分满足。

当前项目已经支持静态构建，并已有 GitHub Pages 配置：

- `astro.config.mjs`
- `.github/workflows/deploy.yml`
- `public/.nojekyll`
- `src/pages/sitemap.xml.ts`
- `src/pages/404.astro`

但新需求提出 Vercel 或 Netlify，当前还没有针对 Vercel/Netlify 的部署说明和配置文件。

## 2. 当前未满足的需求

### 2.1 网站拥有者身份识别

未满足。

当前没有登录页面、身份验证流程、管理员 token 校验、session、cookie 或 OAuth 登录。

如果直接在前端写管理员密钥，会暴露给所有访问者，因此不能用纯前端方式实现安全管理员登录。

### 2.2 管理模式

未满足。

当前没有 `/admin` 页面，也没有管理后台。网站拥有者不能通过网页新增、编辑、删除内容。

当前内容管理方式是本地修改 Markdown 文件，然后重新构建和部署。

### 2.3 文件上传

未满足。

当前没有上传入口、上传 API、文件存储桶、文件大小限制、文件类型校验、病毒扫描或访问权限控制。

静态网站不能直接安全接收文件上传，因为静态网站没有服务器进程来保存文件，也不能把云存储密钥写在前端。

### 2.4 新增、编辑、删除笔记

未满足。

当前只能通过修改仓库里的 Markdown 文件实现内容变更。没有网页端编辑器，也没有后端保存接口。

### 2.5 给内容设置分类

部分未满足。

当前有 `tags`，但没有统一 `category` 字段。Blog、Notes、Projects 也没有统一内容模型。

新需求中的分类包括：

- 科研笔记
- 代码项目
- 读书笔记
- 项目资料

当前这些分类主要靠页面和文件夹区分，不是统一字段。

### 2.6 控制内容是否公开

部分未满足。

Blog 有 `draft`，Notes 和 Projects 没有。也没有更细的公开状态，例如：

- public
- private
- unlisted

### 2.7 管理员密钥不暴露在前端

当前没有管理员密钥，因此不存在泄露。但如果后续增加上传和管理功能，必须引入后端、Serverless Function 或托管 CMS，不能把密钥写进 Astro 前端代码。

## 3. 静态网站可以直接实现的部分

以下需求可以在 Astro 静态网站中直接实现，不需要后端：

### 3.1 公开内容展示

可以继续用 Markdown/MDX 内容集合实现：

- 科研笔记
- 读书笔记
- 项目介绍
- 项目 README
- 资料说明页

### 3.2 内容分类和标签

可以在 `src/content.config.ts` 中增加字段：

- `category`
- `visibility`
- `fileLinks`
- `cover`
- `type`

然后在列表页中按分类筛选。

### 3.3 公开文件下载链接

可以通过外部链接实现公开下载：

- GitHub Releases
- OneDrive
- 阿里云盘
- 百度网盘
- Cloudflare R2 Public URL
- Supabase Storage Public Bucket

静态站点只保存文件链接，不直接保存大文件。

### 3.4 静态项目资料页

可以为每个项目新增资料清单，例如：

```yaml
files:
  - title: "项目说明 PDF"
    type: "pdf"
    url: "https://..."
  - title: "代码压缩包"
    type: "zip"
    url: "https://..."
```

然后在项目详情页展示下载按钮。

### 3.5 Vercel 或 Netlify 静态部署

Astro 静态输出可以部署到 Vercel 或 Netlify。当前项目只需要补充部署说明，通常不需要大改代码。

## 4. 必须引入后端、数据库或云存储才能实现的部分

### 4.1 安全文件上传

必须引入后端或云函数。

原因：

- 浏览器前端不能安全保存管理员密钥。
- 文件上传需要服务端校验文件类型、大小和权限。
- 文件需要保存到云存储，例如 S3、Cloudflare R2、Supabase Storage、Vercel Blob 或 Netlify Blobs。

### 4.2 管理员登录和身份识别

必须引入认证系统。

可选方案：

- GitHub OAuth
- Auth.js
- Supabase Auth
- Clerk
- Netlify Identity
- 自建管理员密码 + Serverless Session

推荐不要自己手写复杂登录系统，优先使用成熟服务。

### 4.3 网页端新增、编辑、删除笔记

必须有内容保存位置。

可选保存位置：

- 数据库：Supabase Postgres、Neon、PlanetScale
- Headless CMS：Decap CMS、Sanity、Contentful
- GitHub 仓库：通过 GitHub API 提交 Markdown 文件
- 对象存储 + 数据库：文件放对象存储，元数据放数据库

### 4.4 控制内容公开状态

如果只是构建时隐藏内容，静态站可以用 `draft` 或 `visibility` 字段。

如果需要管理员在网页上实时切换公开/私有，则需要数据库或 CMS。

### 4.5 删除内容和删除文件

必须通过后端执行。前端不能直接持有删除云文件的权限，否则任何人都可能拿到权限。

## 5. 推荐的最小改造方案

目标：尽量保持 Astro 静态网站不复杂，同时满足“公开展示 + 管理上传”的初步需求。

### 5.1 技术方案

- 前端：继续使用 Astro。
- 内容展示：继续使用 Markdown/MDX 内容集合。
- 文件存储：使用 GitHub Releases、OneDrive 或 Cloudflare R2 公共链接。
- 管理方式：短期仍然本地编辑 Markdown，不做在线后台。
- 部署：Vercel 或 Netlify 静态部署。

### 5.2 最小改造内容

1. 扩展内容模型：
   - Blog 增加 `category`、`visibility`、`files`
   - Notes 增加 `category`、`visibility`、`files`
   - Projects 增加 `files`

2. 新增资料下载组件：
   - 根据 `files` 字段展示 PDF、Word、Markdown、图片、zip 下载按钮。

3. 新增分类页面或筛选：
   - 科研笔记
   - 读书笔记
   - 代码项目
   - 项目资料

4. 新增 Vercel/Netlify 部署说明。

5. 管理员上传暂不在网站内实现，先通过云盘或 GitHub Releases 上传文件，再把公开链接写入 Markdown。

### 5.3 最小方案优点

- 改动小。
- 安全风险低。
- 仍然可以部署为纯静态网站。
- 不会暴露管理员密钥。

### 5.4 最小方案缺点

- 没有真正的网页端管理后台。
- 上传和编辑仍然需要手动操作。
- 不能在网页上直接删除内容。

## 6. 推荐的完整改造方案

目标：实现真正的管理员管理模式、文件上传、内容增删改、公开状态控制。

### 6.1 推荐架构

- 前端：Astro
- 动态接口：Astro Server Endpoints 或 Vercel/Netlify Serverless Functions
- 身份认证：GitHub OAuth 或 Supabase Auth
- 数据库：Supabase Postgres
- 文件存储：Supabase Storage 或 Cloudflare R2
- 部署：Vercel 或 Netlify

### 6.2 功能模块

#### 6.2.1 游客公开站点

游客访问：

- 首页
- 科研笔记列表和详情
- 读书笔记列表和详情
- 代码项目列表和详情
- 项目资料下载页

只展示 `visibility = "public"` 的内容。

#### 6.2.2 管理员登录

新增：

- `/admin/login`
- 登录回调接口
- 管理员权限校验

管理员身份建议绑定指定 GitHub 账号或指定邮箱。

#### 6.2.3 管理后台

新增：

- `/admin`
- `/admin/posts`
- `/admin/projects`
- `/admin/files`

支持：

- 新增笔记
- 编辑笔记
- 删除笔记
- 上传文件
- 设置分类、标签、标题、简介、上传时间
- 设置公开/私有

#### 6.2.4 文件上传接口

新增后端接口：

- `POST /api/admin/files/upload`
- `DELETE /api/admin/files/:id`
- `GET /api/files`

上传时需要校验：

- 管理员身份
- 文件类型
- 文件大小
- 文件扩展名
- MIME type

#### 6.2.5 内容接口

新增后端接口：

- `GET /api/content`
- `POST /api/admin/content`
- `PATCH /api/admin/content/:id`
- `DELETE /api/admin/content/:id`

数据库表可以包括：

- `content_items`
- `files`
- `tags`
- `content_tags`

### 6.3 完整方案优点

- 真正支持网页端管理。
- 支持上传、编辑、删除。
- 可以安全保存管理员密钥。
- 可以控制公开状态。
- 后续更容易扩展搜索、统计、访问权限。

### 6.4 完整方案缺点

- 开发量明显增加。
- 需要维护数据库和云存储。
- 需要处理认证、安全和上传限制。
- 部署不再是完全纯静态。

## 7. 需要修改或新增的文件清单

### 7.1 最小改造方案文件清单

建议修改：

- `src/content.config.ts`
  - 增加 `category`、`visibility`、`files` 字段。

- `src/components/ProjectCard.astro`
  - 展示资料数量或下载入口。

- `src/pages/projects/[slug].astro`
  - 展示项目资料下载列表。

- `src/pages/blog/index.astro`
  - 支持按分类展示科研笔记和读书笔记。

- `src/pages/blog/[slug].astro`
  - 展示文章关联附件。

- `src/pages/notes.astro`
  - 支持分类、标签和公开状态。

- `src/pages/notes/[slug].astro`
  - 展示笔记附件。

- `README.md`
  - 增加文件资料维护说明和 Vercel/Netlify 部署说明。

建议新增：

- `src/components/FileDownloadList.astro`
  - 统一展示 PDF、Word、Markdown、图片、zip 下载项。

- `src/pages/resources.astro`
  - 公开资料库页面。

- `src/content/resources/`
  - 如果要把资料说明独立成内容集合，可以新增该目录。

### 7.2 完整改造方案文件清单

建议新增前端页面：

- `src/pages/admin/index.astro`
- `src/pages/admin/login.astro`
- `src/pages/admin/content.astro`
- `src/pages/admin/files.astro`

建议新增 API：

- `src/pages/api/admin/upload.ts`
- `src/pages/api/admin/content/index.ts`
- `src/pages/api/admin/content/[id].ts`
- `src/pages/api/admin/files/[id].ts`
- `src/pages/api/auth/login.ts`
- `src/pages/api/auth/logout.ts`
- `src/pages/api/auth/callback.ts`

建议新增服务层：

- `src/lib/auth.ts`
- `src/lib/db.ts`
- `src/lib/storage.ts`
- `src/lib/permissions.ts`
- `src/lib/file-validation.ts`

建议新增类型：

- `src/types/content.ts`
- `src/types/file.ts`
- `src/types/admin.ts`

建议新增数据库迁移：

- `supabase/migrations/001_create_content_items.sql`
- `supabase/migrations/002_create_files.sql`
- `supabase/migrations/003_create_tags.sql`

建议新增环境变量示例：

- `.env.example`

示例变量：

```text
ADMIN_ALLOWED_EMAIL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STORAGE_BUCKET=
```

注意：`SUPABASE_SERVICE_ROLE_KEY` 只能在服务端使用，不能暴露给前端。

## 8. 风险点

### 8.1 管理员密钥暴露

高风险。

不能把管理员密钥、云存储密钥、数据库服务端密钥写进：

- Astro 页面前端代码
- 浏览器脚本
- `src/data/site.ts`
- 公开 Markdown
- GitHub 仓库公开文件

正确做法是使用服务端环境变量。

### 8.2 文件上传安全

高风险。

需要限制：

- 文件类型
- 文件大小
- 文件扩展名
- MIME type
- 上传频率

不能只相信文件扩展名。例如用户可以把恶意文件改名为 `.pdf`。

### 8.3 公开访问权限

中高风险。

如果文件上传到公开 bucket，任何拿到链接的人都可能访问。需要明确哪些资料是公开的，哪些资料是私有的。

### 8.4 删除权限

高风险。

删除内容和删除文件必须在服务端校验管理员身份。不能让前端直接拿到云存储删除权限。

### 8.5 静态站能力边界

中风险。

Astro 静态网站适合展示公开内容，但不适合独立完成安全上传、登录、数据库写入。管理后台必须依赖后端、云函数、CMS 或第三方服务。

### 8.6 大文件仓库膨胀

中风险。

PDF、Word、图片和 zip 如果直接提交到 Git 仓库，会让仓库越来越大。项目压缩包尤其不适合长期放在仓库里。

建议大文件放：

- GitHub Releases
- Cloudflare R2
- Supabase Storage
- OneDrive
- 其他网盘

### 8.7 内容审核和误公开

中风险。

科研笔记可能包含未公开结果、合作项目信息或敏感数据。需要在内容模型里加入 `visibility` 字段，并在发布流程中默认非公开或草稿。

### 8.8 Vercel/Netlify Serverless 限制

中风险。

如果使用 Vercel/Netlify Functions 处理上传，需要注意：

- 函数执行时间限制
- 请求体大小限制
- 文件上传大小限制
- 冷启动
- 免费额度

大文件上传更适合使用“后端签名直传云存储”的方式。

## 9. 结论

当前项目已经适合作为公开展示型个人科研主页，能够满足游客浏览公开内容、查看博客/笔记/项目和通过外部链接下载资料的基础需求。

当前项目尚不能满足“网站拥有者网页端管理、上传文件、新增编辑删除内容、控制公开状态”等动态管理需求。原因是当前架构是静态 Astro 网站，没有安全后端、数据库和云存储。

推荐分两步改造：

1. 先做最小改造：扩展内容字段、增加文件下载列表、增加资料页面、补充 Vercel/Netlify 部署说明。
2. 再做完整改造：引入认证、数据库、云存储和管理后台，实现真正的上传和内容管理。

最重要的原则是：管理员密钥和云存储服务端密钥不能出现在前端代码中。
