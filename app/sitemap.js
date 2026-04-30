import { createClientServer } from "@/lib/supabase/server";

export default async function sitemap() {
  const supabase = await createClientServer();

  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at");

  const baseUrl = "https://ton-site.com"; // change ici

  const postUrls =
    posts?.map((post) => ({
      url: `${baseUrl}/article/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: "weekly",
      priority: 0.8
    })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    ...postUrls
  ];
}