import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

const site = process.env.SITE || "https://leone1111.github.io";
const base = process.env.BASE_PATH || "/Leone1111_online_notes";

export default defineConfig({
  site,
  base,
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
