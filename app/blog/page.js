// app/blog/page.js  (Server Component)
import BlogClient from './BlogClient';
import { createClientServer } from '@/lib/supabase/server';

export default async function BlogPage() {
  const supabase = await createClientServer();

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, created_at, image_url, category')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return <BlogClient initialPosts={posts || []} />;
}