import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ site }) => {
  const blogPosts = await getCollection("post")

  return rss({
    // `<title>` field in output xml
    title: "Armand Sallé's Blog",
    // `<description>` field in output xml
    description: "Welcome to my blog!",
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: site || "https://armand-salle.fr",
    trailingSlash: false,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: blogPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      url: `https://armand-salle.fr/post/${post.slug}`,
      date: post.data.pubDate,
      author: "Armand Sallé",
      link: `/post/${post.slug}`,
      pubDate: new Date(post.data.pubDate),
    })),
    // (optional) inject custom xml
    customData: "<language>en-us</language>",
  })
}
