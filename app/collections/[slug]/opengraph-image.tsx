import { createClient } from '@/utils/supabase/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Collection Cover Image';
export const contentType = 'image/png';

// Helper to get image dimensions
async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Simple PNG dimension reading (first 24 bytes contain dimensions)
  if (buffer[0] === 0x89 && buffer[1] === 0x50) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  // Simple JPEG dimension reading
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }

  // Default fallback for standard Open Graph
  return { width: 1200, height: 630 };
}

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

  try {
    // Get image dimensions to determine orientation
    const { width, height } = await getImageDimensions(coverImageUrl);
    const isPortrait = height > width;

    // For portrait images, use natural aspect ratio with max width of 1200
    // For landscape/square, use standard Open Graph dimensions (1200x630)
    let ogWidth = 1200;
    let ogHeight = 630;

    if (isPortrait) {
      // Maintain aspect ratio for portrait images
      const aspectRatio = width / height;
      ogWidth = 1200;
      ogHeight = Math.round(ogWidth / aspectRatio);
    }

    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <img
          src={coverImageUrl}
          alt='Collection cover'
          style={{
            width: isPortrait ? '100%' : '100%',
            height: isPortrait ? '100%' : '100%',
            objectFit: isPortrait ? 'contain' : 'cover',
          }}
        />
      </div>,
      {
        width: ogWidth,
        height: ogHeight,
      }
    );
  } catch (error) {
    // Fallback: serve image at standard Open Graph dimensions if dimension detection fails
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <img
          src={coverImageUrl}
          alt='Collection cover'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
