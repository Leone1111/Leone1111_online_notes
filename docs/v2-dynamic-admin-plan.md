# V2 动态管理后台方案文档

项目名称：Leone1111_online_notes  
当前版本基础：V1.1 静态资料库和附件下载  
目标版本：V2 动态管理后台  
文档日期：2026-05-20

## 1. 当前 V1.1 已满足的需求

V1.1 已经适合做一个公开访问的个人科研与知识分享静态网站，主要满足以下能力：

1. 游客无需注册和登录。
   - 当前网站是 Astro 静态站，游客打开网址即可访问公开页面。

2. 游客可以浏览公开内容。
   - 已有 Home、About、Research、Projects、Blog、Notes、Resources、Contact 等页面。
   - Blog、Notes、Projects 列表页已经只展示 `visibility` 为 `public` 或未设置 `visibility` 的内容。

3. 游客可以查看科研笔记、读书笔记、代码项目、项目资料。
   - 当前通过 Blog、Notes、Projects 和 Resources 页面承载这些内容。
   - 内容仍然以 Markdown/MDX 文件为主。

4. 游客可以下载公开附件。
   - 当前通过 Markdown frontmatter 中的 `files` 字段配置附件。
   - `FileDownloadList.astro` 统一展示 PDF、Word、Markdown、图片、zip 等附件下载入口。
   - `resources.astro` 汇总所有公开附件。

5. 已经有公开状态字段。
   - `visibility` 支持 `public`、`draft`、`private`。
   - 静态构建时可以过滤非公开内容。

6. 没有把管理员密钥暴露到前端。
   - 当前没有管理后台，也没有上传接口，因此不存在前端泄露管理员密钥的问题。

## 2. V2 还需要新增的功能

V2 的核心变化是：从“本地改 Markdown 再部署”的静态内容管理方式，升级为“网站拥有者可以在网页后台管理内容和文件”的动态管理方式。

需要新增：

1. 管理员身份识别。
   - 网站拥有者可以登录。
   - 只允许指定邮箱或指定账号进入后台。

2. 管理后台页面。
   - `/admin/login`
   - `/admin`
   - `/admin/content`
   - `/admin/files`

3. 在线内容管理。
   - 新增内容。
   - 编辑内容。
   - 删除内容。
   - 设置标题、简介、分类、标签、附件、公开状态。

4. 在线文件管理。
   - 上传 PDF、Word、Markdown、图片、zip 项目压缩包。
   - 删除文件。
   - 为文件设置标题、类型、描述、大小、公开状态。

5. 数据库。
   - 保存内容元数据、正文、标签、附件关系。

6. 云存储。
   - 保存上传文件。
   - 控制公开文件和私有文件的访问权限。

7. 后端接口。
   - 处理登录状态校验。
   - 处理新增、编辑、删除内容。
   - 处理文件上传、删除。
   - 保护服务端密钥，避免暴露给浏览器。

## 3. 推荐技术架构

### 3.1 是否继续使用 Astro

建议继续使用 Astro。

原因：

1. 当前项目已经是 Astro，迁移成本低。
2. Astro 很适合个人主页、科研博客、项目作品集这类内容型网站。
3. 公开页面仍然可以保持轻量、快速、SEO 友好。
4. Astro 可以从纯静态模式升级到服务端模式，配合 Vercel/Netlify Functions 实现后台接口。

推荐方向：

- 公开页面继续用 Astro 页面和组件。
- 内容数据逐步从 Markdown/MDX 迁移到 Supabase Database。
- V2.1 可以先“只读数据库”，不急着删除 Markdown 内容。
- 后台相关接口使用 Astro Server Endpoints 或部署平台的 Serverless Functions。

### 3.2 是否使用 Supabase Auth

建议使用 Supabase Auth。

Supabase Auth 负责登录和身份识别。它可以使用邮箱验证码、密码登录、GitHub OAuth 等方式。

本项目推荐：

- 初期使用邮箱登录。
- 只允许 `ADMIN_ALLOWED_EMAIL` 指定的邮箱进入管理后台。
- 其他用户即使登录成功，也不能访问后台管理接口。

这样做的好处是：

- 不需要自己从零写登录系统。
- 不需要把管理员密码写在前端。
- 可以在服务端校验当前用户是否为网站拥有者。

### 3.3 是否使用 Supabase Database

建议使用 Supabase Database。

Supabase Database 本质上是 PostgreSQL 数据库，适合保存：

- 内容条目。
- 文件元数据。
- 标签。
- 内容和标签的关联关系。
- 内容和附件的关联关系。

相比继续完全依赖 Markdown 文件，数据库的优势是：

- 后台可以即时新增、编辑、删除内容。
- 不需要每次修改内容都重新提交 Git。
- 更容易做分类、标签、搜索、公开状态控制。

### 3.4 是否使用 Supabase Storage

建议使用 Supabase Storage。

Supabase Storage 适合保存上传文件：

- PDF。
- Word 文档。
- Markdown 文件。
- 图片。
- zip 项目压缩包。

推荐建立一个 bucket，例如：

```text
STORAGE_BUCKET=research-assets
```

文件访问策略：

- 公开文件可以使用 public bucket 或生成公开 URL。
- 私有文件应放在 private bucket，通过服务端生成短期 signed URL。

### 3.5 是否需要 Astro Server Endpoints 或 Vercel/Netlify Functions

需要。

只要涉及以下操作，就必须有服务端代码：

- 校验管理员身份。
- 使用 `SUPABASE_SERVICE_ROLE_KEY`。
- 上传文件前做安全检查。
- 删除数据库记录。
- 删除云存储文件。
- 生成私有文件 signed URL。

推荐方式：

1. 如果部署到 Vercel：
   - 使用 Astro SSR + Vercel Adapter。
   - API 写在 `src/pages/api/...`。

2. 如果部署到 Netlify：
   - 使用 Astro SSR + Netlify Adapter。
   - API 写在 `src/pages/api/...` 或 Netlify Functions。

3. 如果继续部署到 GitHub Pages：
   - 只能部署公开静态页面。
   - 不能安全实现登录、上传、删除、数据库写入。

## 4. 推荐整体架构

```text
游客浏览器
  |
  | 访问公开页面
  v
Astro 网站
  |
  | 读取公开内容
  v
Supabase Database
  |
  | 公开附件 URL 或 signed URL
  v
Supabase Storage

网站拥有者浏览器
  |
  | 登录 / 管理后台操作
  v
Astro Admin Pages
  |
  | 调用服务端 API
  v
Astro Server Endpoints / Vercel Functions / Netlify Functions
  |
  | 使用服务端环境变量
  v
Supabase Auth + Database + Storage
```

简单理解：  
游客只看公开内容；管理员操作必须先经过服务端接口，服务端确认“你确实是网站拥有者”后，才允许写数据库和上传文件。

## 5. 数据库表设计

### 5.1 content_items

保存科研笔记、读书笔记、代码项目、项目资料等主要内容。

```sql
create table content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null,
  title text not null,
  summary text,
  body text,
  category text,
  visibility text not null default 'draft',
  cover_file_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `id` | 内容唯一 ID |
| `slug` | URL 中使用的短名称，例如 `ml-screening-note` |
| `type` | 内容类型，例如 `research_note`、`book_note`、`code_project`、`resource` |
| `title` | 标题 |
| `summary` | 简介 |
| `body` | 正文，可以保存 Markdown |
| `category` | 分类，例如 `科研笔记`、`读书笔记`、`代码项目`、`项目资料` |
| `visibility` | `public`、`draft`、`private` |
| `cover_file_id` | 封面图片文件 ID，可为空 |
| `created_at` | 创建时间 |
| `updated_at` | 更新时间 |
| `published_at` | 发布时间 |

建议约束：

```sql
alter table content_items
add constraint content_items_type_check
check (type in ('research_note', 'book_note', 'code_project', 'resource'));

alter table content_items
add constraint content_items_visibility_check
check (visibility in ('public', 'draft', 'private'));
```

### 5.2 files

保存上传文件的元数据。真正的文件放在 Supabase Storage 中。

```sql
create table files (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_type text not null,
  mime_type text not null,
  size_bytes bigint not null,
  storage_bucket text not null,
  storage_path text not null,
  public_url text,
  visibility text not null default 'private',
  uploaded_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `id` | 文件唯一 ID |
| `title` | 文件标题 |
| `description` | 文件说明 |
| `file_type` | `pdf`、`word`、`markdown`、`image`、`zip` |
| `mime_type` | 浏览器识别到的 MIME 类型 |
| `size_bytes` | 文件大小 |
| `storage_bucket` | Supabase Storage bucket 名称 |
| `storage_path` | 文件在 bucket 中的路径 |
| `public_url` | 公开文件 URL，可为空 |
| `visibility` | `public` 或 `private` |
| `uploaded_by` | 上传者用户 ID |
| `created_at` | 上传时间 |
| `updated_at` | 更新时间 |

建议约束：

```sql
alter table files
add constraint files_file_type_check
check (file_type in ('pdf', 'word', 'markdown', 'image', 'zip'));

alter table files
add constraint files_visibility_check
check (visibility in ('public', 'private'));
```

### 5.3 tags

保存标签。

```sql
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);
```

### 5.4 content_tags

保存内容和标签的多对多关系。

```sql
create table content_tags (
  content_id uuid not null references content_items(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (content_id, tag_id)
);
```

### 5.5 建议新增 content_files

虽然用户指定了四张表，但实际项目中还建议增加一张关联表，用来表示“某篇内容关联了哪些附件”。

```sql
create table content_files (
  content_id uuid not null references content_items(id) on delete cascade,
  file_id uuid not null references files(id) on delete cascade,
  sort_order int not null default 0,
  primary key (content_id, file_id)
);
```

如果不增加这张表，也可以在 `files` 表中加 `content_id` 字段，但那样一个文件只能属于一个内容。用 `content_files` 更灵活。

## 6. 文件上传安全策略

### 6.1 支持的文件类型

V2 推荐先支持以下类型：

| 类型 | 扩展名 | MIME type 示例 |
| --- | --- | --- |
| PDF | `.pdf` | `application/pdf` |
| Word | `.doc`、`.docx` | `application/msword`、`application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| Markdown | `.md`、`.mdx` | `text/markdown`、`text/plain` |
| 图片 | `.png`、`.jpg`、`.jpeg`、`.webp`、`.gif` | `image/png`、`image/jpeg`、`image/webp`、`image/gif` |
| 压缩包 | `.zip` | `application/zip`、`application/x-zip-compressed` |

### 6.2 文件大小限制

建议初始限制：

| 类型 | 建议大小限制 |
| --- | --- |
| PDF | 30 MB |
| Word | 20 MB |
| Markdown | 2 MB |
| 图片 | 10 MB |
| zip | 100 MB |

说明：

- zip 压缩包风险更高，建议先限制在 100 MB 以内。
- 如果需要上传更大的科研数据，建议放 OneDrive、GitHub Releases、Zenodo 或学校网盘，网站只保存链接。

### 6.3 MIME type 校验

必须同时校验：

1. 文件扩展名。
2. 浏览器提交的 MIME type。
3. 服务端读取到的文件头信息。

不能只相信文件名。  
例如，一个恶意文件可以改名为 `paper.pdf`，但真实内容并不是 PDF。

### 6.4 管理员权限校验

所有上传、删除、编辑接口都必须在服务端做校验：

1. 检查当前请求是否有有效登录 session。
2. 从 Supabase Auth 获取当前用户邮箱。
3. 判断邮箱是否等于 `ADMIN_ALLOWED_EMAIL`。
4. 只有匹配时才允许继续操作。

前端按钮隐藏不能算权限控制。  
真正的权限必须在 API 服务端判断。

### 6.5 public/private 文件访问控制

推荐策略：

1. 公开文件：
   - `files.visibility = 'public'`
   - 可以提供公开 URL。
   - 游客可以直接下载。

2. 私有文件：
   - `files.visibility = 'private'`
   - 不暴露永久公开 URL。
   - 只有管理员可见。
   - 如需下载，通过服务端生成短期 signed URL。

3. 默认值：
   - 新上传文件默认 `private`。
   - 管理员确认无敏感内容后再改成 `public`。

## 7. 管理后台页面设计

### 7.1 `/admin/login`

用途：管理员登录入口。

页面功能：

- 显示登录表单。
- 支持邮箱登录或第三方登录。
- 登录后跳转 `/admin`。
- 如果当前用户不是允许的管理员邮箱，显示无权限提示。

页面不应该包含：

- `SUPABASE_SERVICE_ROLE_KEY`。
- 管理员固定密码。
- 任何云存储密钥。

### 7.2 `/admin`

用途：后台首页。

建议展示：

- 内容总数。
- 公开内容数。
- 草稿内容数。
- 私有内容数。
- 文件总数。
- 最近更新内容。
- 快捷入口：新增内容、上传文件、管理附件。

### 7.3 `/admin/content`

用途：内容管理。

建议功能：

- 内容列表。
- 按类型筛选：科研笔记、读书笔记、代码项目、项目资料。
- 按公开状态筛选：public、draft、private。
- 搜索标题和简介。
- 新增内容。
- 编辑内容。
- 删除内容。
- 设置标签和分类。
- 关联附件。

编辑字段：

- 标题。
- slug。
- 简介。
- 正文 Markdown。
- 类型。
- 分类。
- 标签。
- 公开状态。
- 关联附件。
- 发布时间。

### 7.4 `/admin/files`

用途：文件管理。

建议功能：

- 文件列表。
- 上传文件。
- 删除文件。
- 修改文件标题和描述。
- 修改公开状态。
- 复制公开下载链接。
- 查看文件关联了哪些内容。

文件字段：

- 标题。
- 描述。
- 文件类型。
- 文件大小。
- 上传时间。
- 公开状态。
- 存储路径。

## 8. API 设计

### 8.1 登录/退出

Supabase Auth 可以直接由前端 SDK 发起登录，但管理员权限必须在服务端 API 中再次校验。

建议 API：

```text
GET  /api/auth/me
POST /api/auth/logout
```

`GET /api/auth/me`

- 返回当前登录用户。
- 返回 `isAdmin`。
- 后台页面用它判断是否允许显示管理界面。

`POST /api/auth/logout`

- 退出登录。
- 清理 session。

### 8.2 新增内容

```text
POST /api/admin/content
```

请求体示例：

```json
{
  "type": "research_note",
  "title": "机器学习筛选层状钠离子材料",
  "slug": "ml-screening-layered-sodium-materials",
  "summary": "记录材料描述符、模型训练和筛选流程。",
  "body": "Markdown 正文",
  "category": "科研笔记",
  "tags": ["机器学习", "钠电材料"],
  "visibility": "draft",
  "fileIds": []
}
```

服务端必须做：

- 管理员权限校验。
- slug 唯一性校验。
- 字段长度校验。
- `visibility` 合法性校验。
- 写入 `content_items`、`tags`、`content_tags`、`content_files`。

### 8.3 编辑内容

```text
PATCH /api/admin/content/:id
```

服务端必须做：

- 管理员权限校验。
- 检查内容是否存在。
- 校验字段。
- 更新内容。
- 更新标签关系。
- 更新附件关系。
- 更新 `updated_at`。

### 8.4 删除内容

```text
DELETE /api/admin/content/:id
```

服务端必须做：

- 管理员权限校验。
- 删除内容和标签关联。
- 删除内容和附件关联。
- 默认不直接删除文件本体，因为同一个文件可能被多个内容引用。

建议采用“软删除”：

```sql
alter table content_items add column deleted_at timestamptz;
```

如果先不做软删除，也要在后台删除前弹出确认。

### 8.5 上传文件

```text
POST /api/admin/files/upload
```

请求格式：

- `multipart/form-data`
- 字段包含：文件、标题、描述、公开状态。

服务端必须做：

- 管理员权限校验。
- 文件大小校验。
- 扩展名校验。
- MIME type 校验。
- 生成安全存储路径。
- 上传到 Supabase Storage。
- 写入 `files` 表。

存储路径建议：

```text
public/2026/05/file-id-original-name.pdf
private/2026/05/file-id-original-name.zip
```

不要直接使用用户上传的原始文件名作为唯一文件名。

### 8.6 删除文件

```text
DELETE /api/admin/files/:id
```

服务端必须做：

- 管理员权限校验。
- 检查文件是否存在。
- 检查是否仍被内容引用。
- 删除 Supabase Storage 中的文件。
- 删除 `files` 表记录。

如果文件仍被内容引用，建议默认禁止删除，并提示先解除关联。

## 9. 环境变量设计

### 9.1 `SUPABASE_URL`

用途：Supabase 项目地址。

可用于：

- 前端。
- 服务端。

是否可公开：可以。  
它只是项目地址，不是管理员密钥。

### 9.2 `SUPABASE_ANON_KEY`

用途：Supabase 匿名公钥。

可用于：

- 前端登录。
- 读取允许公开访问的数据。

是否可公开：可以，但必须配合 Supabase Row Level Security。  
这个 key 不是管理员密钥，但如果数据库权限配置错了，也可能导致数据泄露。

### 9.3 `SUPABASE_SERVICE_ROLE_KEY`

用途：服务端最高权限 key。

只能用于：

- Astro Server Endpoints。
- Vercel Functions。
- Netlify Functions。

不能用于：

- 前端组件。
- 浏览器脚本。
- Markdown。
- 公开仓库文件。

这是最敏感的密钥，一旦泄露，别人可能绕过数据库权限直接读写数据。

### 9.4 `ADMIN_ALLOWED_EMAIL`

用途：指定唯一管理员邮箱。

示例：

```text
ADMIN_ALLOWED_EMAIL=your-email@example.com
```

服务端接口根据登录用户邮箱判断是否允许管理操作。

### 9.5 `STORAGE_BUCKET`

用途：指定文件上传 bucket。

示例：

```text
STORAGE_BUCKET=research-assets
```

建议：

- V2 初期使用一个 bucket。
- 通过路径和数据库字段区分 `public` 与 `private`。
- 后期也可以拆成 `public-assets` 和 `private-assets` 两个 bucket。

### 9.6 `.env.example` 建议

V2 实施时可以新增：

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_ALLOWED_EMAIL=
STORAGE_BUCKET=research-assets
```

`.env` 必须加入 `.gitignore`，不能提交到 GitHub。

## 10. 分阶段实施路线

### 10.1 V2.1：接入 Supabase，只读数据

目标：先让公开页面可以从 Supabase Database 读取内容，但不做后台写入。

主要任务：

1. 创建 Supabase 项目。
2. 创建数据库表。
3. 准备少量测试数据。
4. 在 Astro 中增加 Supabase 客户端。
5. 公开页面从数据库读取 `visibility = 'public'` 的内容。
6. 保留现有 Markdown 作为备份或迁移来源。

验收标准：

- 游客可以正常浏览数据库中的公开内容。
- 非公开内容不会出现在公开页面。
- 原有静态页面不被破坏。

### 10.2 V2.2：管理员登录

目标：实现网站拥有者身份识别。

主要任务：

1. 接入 Supabase Auth。
2. 新增 `/admin/login`。
3. 新增 `/admin`。
4. 新增 `GET /api/auth/me`。
5. 服务端校验 `ADMIN_ALLOWED_EMAIL`。
6. 非管理员访问后台时显示无权限。

验收标准：

- 指定管理员邮箱可以进入后台。
- 其他用户不能进入后台。
- 管理员密钥不出现在前端代码中。

### 10.3 V2.3：文件上传

目标：管理员可以在线上传资料文件。

主要任务：

1. 创建 Supabase Storage bucket。
2. 新增 `/admin/files`。
3. 新增 `POST /api/admin/files/upload`。
4. 新增 `DELETE /api/admin/files/:id`。
5. 实现文件类型、大小、MIME type 校验。
6. 上传成功后写入 `files` 表。
7. 公开文件可以在 Resources 页面展示下载。

验收标准：

- 管理员可以上传允许类型的文件。
- 游客只能下载公开文件。
- 私有文件不会暴露公开 URL。
- 超大文件、非法类型文件会被拒绝。

### 10.4 V2.4：内容新增/编辑/删除

目标：管理员可以通过网页管理内容。

主要任务：

1. 新增 `/admin/content`。
2. 新增内容编辑表单。
3. 新增 Markdown 编辑区域。
4. 实现 `POST /api/admin/content`。
5. 实现 `PATCH /api/admin/content/:id`。
6. 实现 `DELETE /api/admin/content/:id`。
7. 支持分类、标签、附件、公开状态。

验收标准：

- 管理员可以新增科研笔记、读书笔记、代码项目、项目资料。
- 管理员可以编辑已有内容。
- 管理员可以删除内容。
- 游客只看到公开内容。

### 10.5 V2.5：权限、安全和部署优化

目标：让动态后台更稳定、更安全、更适合长期使用。

主要任务：

1. 配置 Supabase Row Level Security。
2. 限制 API 请求频率。
3. 增加上传错误日志。
4. 增加删除确认。
5. 增加内容预览。
6. 增加数据库备份策略。
7. 优化 Vercel/Netlify 部署环境变量。
8. 检查所有密钥是否只存在于服务端。

验收标准：

- 非管理员无法调用管理接口。
- 私有内容和私有文件不会泄露。
- 部署环境中密钥配置清晰。
- 出错时有可读提示。

## 11. 不能在纯 GitHub Pages 静态部署中实现的功能

GitHub Pages 只能托管静态文件。它没有自己的后端运行环境。

因此，以下功能不能只靠纯 GitHub Pages 安全实现：

1. 管理员登录。
   - 静态页面不能安全保存 session，也不能安全校验管理员权限。

2. 在线上传文件。
   - 静态页面没有服务器接收和保存文件。
   - 不能把云存储密钥放在前端。

3. 在线新增、编辑、删除内容。
   - 静态页面不能直接安全写数据库或修改 Git 仓库。

4. 删除云存储文件。
   - 删除权限必须在服务端保存，不能给浏览器。

5. 使用 `SUPABASE_SERVICE_ROLE_KEY`。
   - 这个 key 只能放在服务端环境变量中，不能在 GitHub Pages 前端使用。

6. 私有文件安全下载。
   - 私有文件需要服务端生成 signed URL。
   - 纯静态站无法安全判断当前访问者是否有权限。

7. 复杂权限控制。
   - 例如只允许管理员看草稿、只允许管理员下载私有资料，都需要服务端判断。

如果坚持使用 GitHub Pages，V2 只能采用“外部后台服务 + GitHub Pages 公开展示”的混合方案。比如：

- 公开网站继续部署在 GitHub Pages。
- 管理后台单独部署到 Vercel/Netlify。
- 数据库和文件放 Supabase。

但从维护简单性看，更推荐 V2 整站迁移到 Vercel 或 Netlify。

## 12. 推荐部署方案

V2 推荐部署到 Vercel 或 Netlify，不推荐继续只使用 GitHub Pages。

### 12.1 推荐 Vercel 的原因

- 对 Astro SSR 和 Serverless API 支持成熟。
- 环境变量配置直观。
- GitHub 推送后自动部署。
- 适合个人项目快速上线。

### 12.2 推荐 Netlify 的原因

- 也支持 Astro。
- Functions 和表单生态成熟。
- 免费额度对个人站点通常够用。

### 12.3 选择建议

如果目标是尽快实现动态后台，建议优先 Vercel：

```text
Astro + Vercel Adapter + Supabase Auth + Supabase Database + Supabase Storage
```

如果后续更偏向内容站和静态资源管理，Netlify 也可以。

## 13. V2 需要新增或修改的文件清单

以下是 V2 真正实施时可能涉及的文件。本文档只做方案说明，当前不创建这些代码文件。

### 13.1 依赖和配置

```text
package.json
astro.config.mjs
.env.example
```

可能新增依赖：

```text
@supabase/supabase-js
@astrojs/vercel
```

或 Netlify：

```text
@astrojs/netlify
```

### 13.2 Supabase 工具层

```text
src/lib/supabase/browser.ts
src/lib/supabase/server.ts
src/lib/auth.ts
src/lib/permissions.ts
src/lib/file-validation.ts
src/lib/content.ts
```

### 13.3 公开页面改造

```text
src/pages/index.astro
src/pages/blog/index.astro
src/pages/blog/[slug].astro
src/pages/notes.astro
src/pages/notes/[slug].astro
src/pages/projects/index.astro
src/pages/projects/[slug].astro
src/pages/resources.astro
```

### 13.4 管理后台页面

```text
src/pages/admin/login.astro
src/pages/admin/index.astro
src/pages/admin/content.astro
src/pages/admin/files.astro
```

### 13.5 API 接口

```text
src/pages/api/auth/me.ts
src/pages/api/auth/logout.ts
src/pages/api/admin/content/index.ts
src/pages/api/admin/content/[id].ts
src/pages/api/admin/files/upload.ts
src/pages/api/admin/files/[id].ts
```

### 13.6 数据库迁移

```text
supabase/migrations/001_create_content_items.sql
supabase/migrations/002_create_files.sql
supabase/migrations/003_create_tags.sql
supabase/migrations/004_create_content_tags.sql
supabase/migrations/005_create_content_files.sql
supabase/migrations/006_enable_rls.sql
```

## 14. 主要风险点

### 14.1 管理员密钥泄露

最高风险。

`SUPABASE_SERVICE_ROLE_KEY` 不能出现在任何前端代码里。  
它只能放在 Vercel/Netlify 的服务端环境变量中。

### 14.2 文件上传安全

高风险。

必须限制：

- 文件类型。
- 文件大小。
- MIME type。
- 上传频率。
- 文件路径。

zip 文件尤其要谨慎。V2 初期只做存储和下载，不在线解压 zip。

### 14.3 私有文件误公开

高风险。

建议新上传文件默认 `private`。  
管理员确认可以公开后，再手动改成 `public`。

### 14.4 数据库权限配置错误

高风险。

如果 Supabase Row Level Security 配置错误，可能导致游客看到草稿、私有内容或文件元数据。

建议：

- 公开读取只允许 `visibility = 'public'`。
- 写入、更新、删除只能由服务端接口使用 service role 执行。
- 前端 anon key 不允许直接写管理表。

### 14.5 删除操作不可恢复

中高风险。

建议：

- 内容先做软删除。
- 文件删除前检查是否有关联内容。
- 删除前弹出确认。
- 重要资料定期备份。

### 14.6 GitHub Pages 能力边界

中风险。

如果继续只用 GitHub Pages，动态后台无法安全实现。  
V2 需要 Vercel/Netlify Functions、Astro SSR 或其他后端服务。

## 15. 结论

V1.1 已经完成了公开展示、公开附件下载和静态资料库能力，适合当前个人科研主页上线使用。

V2 的本质是增加“安全的后台管理系统”。这需要三类新能力：

1. 认证：确认谁是网站拥有者。
2. 数据库：保存内容、标签、附件关系和公开状态。
3. 云存储：保存上传的 PDF、Word、Markdown、图片和 zip 文件。

推荐的 V2 技术路线是：

```text
Astro + Supabase Auth + Supabase Database + Supabase Storage + Vercel/Netlify Serverless Functions
```

最稳妥的实施顺序是：

1. V2.1 先接入 Supabase 只读数据。
2. V2.2 再做管理员登录。
3. V2.3 再做文件上传。
4. V2.4 再做内容新增、编辑、删除。
5. V2.5 最后集中处理权限、安全和部署优化。

这样可以避免一次性把项目改得太复杂，也能让每一步都有可以验证的成果。
