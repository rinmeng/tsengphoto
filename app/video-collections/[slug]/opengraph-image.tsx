import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';
export const alt = 'Video Collection Cover Image';
export const contentType = 'image/jpeg';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch video collection from database
  const supabase = await createClient();
  const { data: videoCollection } = await supabase
    .from('video_collections')
    .select('cover_image')
    .eq('slug', slug)
    .single();

  const coverImageUrl =
    videoCollection?.cover_image ||
    'https://tsengphoto.vercel.app/landing/carousel/carousel_1.jpg';

  // Fetch the original image and serve it directly at its native resolution
  const imageResponse = await fetch(coverImageUrl);

  if (!imageResponse.ok) {
    throw new Error('Failed to fetch cover image');
  }

  return new Response(imageResponse.body, {
    headers: {
      'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
