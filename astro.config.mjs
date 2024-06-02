import { defineConfig } from 'astro/config';

import solidJs from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";
import markdoc from "@astrojs/markdoc";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), markdoc(), tailwind(), sitemap()],
  output: "server",
  adapter: vercel()
});