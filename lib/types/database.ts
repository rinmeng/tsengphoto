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

export interface Collection {
  id: string;
  name: string;
  type: string; // 'event', 'video', 'series', etc.
  title: string | null;
  date: string | null;
  location: string | null;
  description: string | null;
  cover_image: string | null;
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
