import type { APIRoute } from "astro";
import { getPublicBlogPosts, getPublicNotes, getPublicProjects } from "../lib/content/publicContent";

const staticPages = ["/", "/about", "/research", "/projects", "/blog", "/notes", "/resources", "/contact"];
const basePath = import.meta.env.BASE_URL || "/";

function absoluteUrl(path: string, site: URL) {
  const cleanBase = basePath.replace(/\/$/, "");
  const cleanPath = path === "/" ? "" : path.replace(/^\/+/, "");
  return new URL(`${cleanBase}/${cleanPath}`.replace(/\/$/, "/"), site).toString();
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ?? new URL("https://leone1111.github.io/Leone1111_online_notes/");
  const [blogPosts, projects, notes] = await Promise.all([
    getPublicBlogPosts(),
    getPublicProjects(),
    getPublicNotes()
  ]);

  const urls = [
    ...staticPages,
    ...blogPosts.map((post) => `/blog/${post.id}`),
    ...projects.map((project) => `/projects/${project.id}`),
    ...notes.map((note) => `/notes/${note.id}`)
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${absoluteUrl(url, siteUrl)}</loc></url>`).join("\n")}
</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml"
      }
    }
  );
};
