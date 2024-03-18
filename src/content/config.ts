import { defineCollection, z } from "astro:content"

const post = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
  }),
})

export const collections = { post }
