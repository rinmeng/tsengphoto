/**
 * Service for video-related business logic
 * Handles YouTube URL parsing, validation, and thumbnail generation
 */

/**
 * Validates and extracts video ID from YouTube URL
 * Supports formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * @param url - YouTube URL to parse
 * @returns Extracted video ID or null if invalid
 */
export function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '').replace('m.', '');

    // youtu.be format
    if (hostname === 'youtu.be' || hostname === 'youtube.com') {
      if (hostname === 'youtu.be') {
        // Extract from pathname: /VIDEO_ID
        const videoId = urlObj.pathname.split('/')[1]?.split('?')[0];
        return videoId || null;
      }

      // youtube.com format
      if (urlObj.pathname === '/watch') {
        const videoId = urlObj.searchParams.get('v');
        return videoId || null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validates if a URL is a valid YouTube URL
 * @param url - URL to validate
 * @returns true if valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  const videoId = extractYouTubeVideoId(url);
  return videoId !== null && videoId.length > 0;
}

/**
 * Generates YouTube thumbnail URL from video ID
 * Uses maxresdefault for highest quality, falls back to hqdefault
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality ('maxres' | 'hq' | 'mq' | 'sd')
 * @returns Thumbnail URL
 */
export function generateYouTubeThumbnail(
  videoId: string,
  quality: 'maxres' | 'hq' | 'mq' | 'sd' = 'maxres'
): string {
  const qualityMap = {
    maxres: 'maxresdefault', // 1920x1080
    hq: 'hqdefault', // 480x360
    mq: 'mqdefault', // 320x180
    sd: 'sddefault', // 640x480
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Generates YouTube embed URL from video ID
 * @param videoId - YouTube video ID
 * @param autoplay - Enable autoplay
 * @returns Embed URL
 */
export function generateYouTubeEmbedUrl(
  videoId: string,
  autoplay: boolean = true
): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}&controls=1&fs=1`;
}

/**
 * Processes a YouTube URL to extract video ID and generate thumbnail
 * @param url - YouTube URL
 * @returns Processed video data with ID and thumbnail URL, or error
 */
export function processYouTubeUrl(url: string): {
  success: boolean;
  data?: {
    videoId: string;
    thumbnailUrl: string;
    embedUrl: string;
  };
  error?: string;
} {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    return {
      success: false,
      error: 'Invalid YouTube URL.',
    };
  }

  return {
    success: true,
    data: {
      videoId,
      thumbnailUrl: generateYouTubeThumbnail(videoId),
      embedUrl: generateYouTubeEmbedUrl(videoId),
    },
  };
}
