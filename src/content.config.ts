import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const visibility = z.enum(["public", "draft", "private"]).default("public");

const fileAttachment = z.object({
  title: z.string(),
  type: z.enum(["pdf", "word", "markdown", "image", "zip"]),
  url: z.string().url(),
  description: z.string().optional(),
  size: z.string().optional()
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().default("科研笔记"),
    visibility,
    files: z.array(fileAttachment).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    status: z.string(),
    category: z.string().default("代码项目"),
    visibility,
    files: z.array(fileAttachment).default([]),
    tags: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    download: z.string().url().optional(),
    featured: z.boolean().default(false)
  })
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().default("科研笔记"),
    visibility,
    files: z.array(fileAttachment).default([]),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { blog, projects, notes };
