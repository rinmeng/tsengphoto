export interface Upload {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string | null;
  entity_type: string | null; // e.g., 'collection'
  entity_id: string | null; // links to collections.id
  created_at: string;
}

export interface CollectionGroup {
  id: string;
  name: string;
  created_at: string;
}

export interface Collection {
  id: string;
  slug: string; // URL-friendly identifier
  type: string; // 'event', 'video', 'series', etc.
  title: string;
  date: string | null;
  location: string | null;
  description: string | null;
  cover_image_url: string | null;
  cover_image_id: string | null; // FK to uploads.id
  drive_link: string | null; // Optional Google Drive folder URL
  collection_group_id: string | null; // FK to collection_groups.id
  collection_group_name: string | null; // Joined from collection_groups.name
  is_published: boolean;
  created_at: string;
  modified_at: string | null;
}

export interface CollectionImage {
  id: string;
  collection_id: string;
  image_url: string | null;
  order: number | null;
  created_at: string;
}

// Extended type for collections with their images
export interface CollectionWithImages extends Collection {
  images: CollectionImage[];
}

export interface VideoCollection {
  id: string;
  slug: string; // URL-friendly identifier
  title: string;
  date: string | null;
  location: string | null;
  description: string | null;
  cover_image_url: string | null;
  cover_image_id: string | null; // FK to uploads.id
  is_published: boolean;
  created_at: string;
  modified_at: string | null;
}

export interface Video {
  id: string;
  video_collection_id: string;
  youtube_video_id: string; // Extracted video ID (e.g., 'W_HfxcvlDZE')
  youtube_url: string; // Original full URL
  thumbnail_url: string | null; // YouTube thumbnail URL
  title: string | null; // Optional user-provided title
  description: string | null; // Optional user-provided description
  order: number | null;
  created_at: string;
}

// Extended type for video collections with their videos
export interface VideoCollectionWithVideos extends VideoCollection {
  videos: Video[];
}
