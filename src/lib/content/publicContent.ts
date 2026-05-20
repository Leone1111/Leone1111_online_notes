import { getCollection, type CollectionEntry } from "astro:content";
import { getSupabaseReadClient } from "../supabase/client";
import { markdownToHtml } from "./markdown";

export type FileType = "pdf" | "word" | "markdown" | "image" | "zip";

export interface FileAttachment {
  title: string;
  type: FileType;
  url: string;
  description?: string;
  size?: string;
}

export interface PublicContentData {
  title: string;
  description: string;
  pubDate?: Date;
  date?: Date;
  category: string;
  visibility: "public";
  files: FileAttachment[];
  tags: string[];
  draft?: boolean;
  status?: string;
  github?: string;
  download?: string;
  featured?: boolean;
  body?: string;
  bodyHtml?: string;
}

export interface PublicContentEntry {
  id: string;
  dbId?: string;
  source: "markdown" | "supabase";
  collection: "blog" | "notes" | "projects";
  data: PublicContentData;
  markdownEntry?: CollectionEntry<"blog"> | CollectionEntry<"notes"> | CollectionEntry<"projects">;
}

type SupabaseContentKind = "blog" | "notes" | "projects";

interface SupabaseContentRow {
  id?: string;
  slug?: string;
  type?: string;
  title?: string;
  summary?: string;
  description?: string;
  body?: string;
  body_html?: string;
  category?: string;
  visibility?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  pub_date?: string;
  date?: string;
  status?: string;
  github_url?: string;
  github?: string;
  download_url?: string;
  download?: string;
  featured?: boolean;
  tags?: unknown;
  files?: unknown;
}

const typeMap: Record<SupabaseContentKind, string[]> = {
  blog: ["blog", "post", "research_note", "book_note"],
  notes: ["note", "notes"],
  projects: ["project", "projects", "code_project"]
};

const defaultCategory: Record<SupabaseContentKind, string> = {
  blog: "科研笔记",
  notes: "科研笔记",
  projects: "代码项目"
};

const defaultStatus = "Ongoing";

const normalizeTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => {
        if (typeof tag === "string") {
          return tag;
        }
        if (tag && typeof tag === "object" && "name" in tag) {
          return String(tag.name);
        }
        return "";
      })
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeFiles = (files: unknown): FileAttachment[] => {
  if (!Array.isArray(files)) {
    return [];
  }

  const normalizedFiles: FileAttachment[] = [];

  for (const file of files) {
    if (!file || typeof file !== "object") {
      continue;
    }

    const item = file as Record<string, unknown>;
    const type = String(item.type || item.file_type || "");
    const url = String(item.url || item.public_url || "");
    const title = String(item.title || "");

    if (!title || !url || !["pdf", "word", "markdown", "image", "zip"].includes(type)) {
      continue;
    }

    normalizedFiles.push({
      title,
      type: type as FileType,
      url,
      description: item.description ? String(item.description) : undefined,
      size: item.size ? String(item.size) : undefined
    });
  }

  return normalizedFiles;
};

const dateFromRow = (row: SupabaseContentRow) =>
  new Date(row.published_at || row.pub_date || row.date || row.created_at || row.updated_at || Date.now());

const mapSupabaseRow = (row: SupabaseContentRow, kind: SupabaseContentKind): PublicContentEntry | null => {
  const slug = row.slug || row.id;
  const title = row.title;

  if (!slug || !title) {
    return null;
  }

  const date = dateFromRow(row);
  const body = row.body || "";

  return {
    id: slug,
    dbId: row.id,
    source: "supabase",
    collection: kind,
    data: {
      title,
      description: row.summary || row.description || "",
      pubDate: kind === "projects" ? undefined : date,
      date: kind === "projects" ? date : undefined,
      category: row.category || defaultCategory[kind],
      visibility: "public",
      files: normalizeFiles(row.files),
      tags: normalizeTags(row.tags),
      draft: false,
      status: kind === "projects" ? row.status || defaultStatus : undefined,
      github: row.github_url || row.github,
      download: row.download_url || row.download,
      featured: Boolean(row.featured),
      body,
      bodyHtml: row.body_html || markdownToHtml(body)
    }
  };
};

async function enrichSupabaseRelationships(
  supabase: NonNullable<ReturnType<typeof getSupabaseReadClient>>,
  entries: PublicContentEntry[]
) {
  const entriesByDbId = new Map(entries.filter((entry) => entry.dbId).map((entry) => [entry.dbId, entry]));
  const dbIds = Array.from(entriesByDbId.keys());

  if (dbIds.length === 0) {
    return entries;
  }

  const { data: tagLinks } = await supabase.from("content_tags").select("content_id,tags(name)").in("content_id", dbIds);

  if (Array.isArray(tagLinks)) {
    for (const link of tagLinks as Array<{ content_id?: string; tags?: { name?: string } | { name?: string }[] }>) {
      const entry = link.content_id ? entriesByDbId.get(link.content_id) : undefined;
      const tagRows = Array.isArray(link.tags) ? link.tags : link.tags ? [link.tags] : [];
      const names = tagRows.map((tag) => tag.name).filter((name): name is string => Boolean(name));

      if (entry && names.length > 0) {
        entry.data.tags = Array.from(new Set([...entry.data.tags, ...names]));
      }
    }
  }

  const { data: fileLinks } = await supabase
    .from("content_files")
    .select("content_id,files(title,description,file_type,type,size,public_url,url,visibility)")
    .in("content_id", dbIds);

  if (Array.isArray(fileLinks)) {
    for (const link of fileLinks as Array<{ content_id?: string; files?: Record<string, unknown> | Record<string, unknown>[] }>) {
      const entry = link.content_id ? entriesByDbId.get(link.content_id) : undefined;
      const fileRows = Array.isArray(link.files) ? link.files : link.files ? [link.files] : [];
      const publicFiles = fileRows.filter((file) => !file.visibility || file.visibility === "public");
      const files = normalizeFiles(publicFiles);

      if (entry && files.length > 0) {
        entry.data.files = [...entry.data.files, ...files];
      }
    }
  }

  return entries;
}

async function getSupabasePublicContent(kind: SupabaseContentKind): Promise<PublicContentEntry[]> {
  const supabase = getSupabaseReadClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("visibility", "public")
    .in("type", typeMap[kind])
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) {
    console.warn(`[supabase] Failed to read ${kind}: ${error?.message || "No data returned"}`);
    return [];
  }

  const entries = data
    .map((row) => mapSupabaseRow(row as SupabaseContentRow, kind))
    .filter((entry): entry is PublicContentEntry => Boolean(entry));

  return enrichSupabaseRelationships(supabase, entries);
}

async function getMarkdownBlogPosts(): Promise<PublicContentEntry[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft && data.visibility === "public");
  return posts.map((post) => ({
    id: post.id,
    source: "markdown",
    collection: "blog",
    data: {
      ...post.data,
      visibility: "public" as const
    },
    markdownEntry: post
  }));
}

async function getMarkdownNotes(): Promise<PublicContentEntry[]> {
  const notes = await getCollection("notes", ({ data }) => data.visibility === "public");
  return notes.map((note) => ({
    id: note.id,
    source: "markdown",
    collection: "notes",
    data: {
      ...note.data,
      visibility: "public" as const
    },
    markdownEntry: note
  }));
}

async function getMarkdownProjects(): Promise<PublicContentEntry[]> {
  const projects = await getCollection("projects", ({ data }) => data.visibility === "public");
  return projects.map((project) => ({
    id: project.id,
    source: "markdown",
    collection: "projects",
    data: {
      ...project.data,
      visibility: "public" as const
    },
    markdownEntry: project
  }));
}

export async function getPublicBlogPosts() {
  const supabasePosts = await getSupabasePublicContent("blog");
  const posts = supabasePosts.length > 0 ? supabasePosts : await getMarkdownBlogPosts();
  return posts.sort((a, b) => (b.data.pubDate || b.data.date || new Date(0)).valueOf() - (a.data.pubDate || a.data.date || new Date(0)).valueOf());
}

export async function getPublicNotes() {
  const supabaseNotes = await getSupabasePublicContent("notes");
  const notes = supabaseNotes.length > 0 ? supabaseNotes : await getMarkdownNotes();
  return notes.sort((a, b) => (b.data.pubDate || b.data.date || new Date(0)).valueOf() - (a.data.pubDate || a.data.date || new Date(0)).valueOf());
}

export async function getPublicProjects() {
  const supabaseProjects = await getSupabasePublicContent("projects");
  const projects = supabaseProjects.length > 0 ? supabaseProjects : await getMarkdownProjects();
  return projects.sort((a, b) => (b.data.date || b.data.pubDate || new Date(0)).valueOf() - (a.data.date || a.data.pubDate || new Date(0)).valueOf());
}

export async function getPublicResources() {
  const [blogPosts, notes, projects] = await Promise.all([getPublicBlogPosts(), getPublicNotes(), getPublicProjects()]);

  return [
    ...blogPosts.flatMap((post) =>
      post.data.files.map((file) => ({
        ...file,
        sourceTitle: post.data.title,
        sourceCategory: post.data.category,
        sourceType: "科研/读书笔记",
        sourceHref: `/blog/${post.id}`
      }))
    ),
    ...notes.flatMap((note) =>
      note.data.files.map((file) => ({
        ...file,
        sourceTitle: note.data.title,
        sourceCategory: note.data.category,
        sourceType: "轻量笔记",
        sourceHref: `/notes/${note.id}`
      }))
    ),
    ...projects.flatMap((project) =>
      project.data.files.map((file) => ({
        ...file,
        sourceTitle: project.data.title,
        sourceCategory: project.data.category,
        sourceType: "代码项目 / 项目资料",
        sourceHref: `/projects/${project.id}`
      }))
    )
  ];
}
