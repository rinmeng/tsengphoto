export interface Upload {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string | null;
  entity_type: string | null; // e.g., 'event', 'series', 'collection'
  entity_id: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  title: string | null;
  date: string | null;
  location: string | null;
  description: string | null;
  cover_image: string | null;
  is_published: boolean | null;
  created_at: string;
  modified_at: string | null;
}

export interface EventImage {
  id: string;
  event_id: string;
  created_at: string;
  image_url: string | null;
  order: number | null;
}
