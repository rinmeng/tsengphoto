import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';
export const alt = 'Collection Cover Image';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch collection from database
  const supabase = await createClient();
  const { data: collection } = await supabase
    .from('collections')
    .select('cover_image')
    .eq('slug', slug)
    .single();

  const coverImageUrl =
    collection?.cover_image ||
    'https://tsengphoto.vercel.app/landing/carousel/carousel_1.jpg';

  // Fetch and serve the image at its native dimensions
  // Social media platforms will use the image's actual width/height
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
