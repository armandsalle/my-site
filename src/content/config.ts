import { defineCollection, z } from "astro:content"
import { rssSchema } from "@astrojs/rss"

const post = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: rssSchema.merge(
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.string(),
    }),
  ),
})

export const collections = { post }
