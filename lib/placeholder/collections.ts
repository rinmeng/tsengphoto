import { CollectionWithImages } from '@/lib/types/database';

export const placeholderCollections: CollectionWithImages[] = [
  {
    id: '1',
    name: 'Summer Wedding 2025',
    slug: 'summer-wedding-2025',
    type: 'event',
    title: 'Emily & James - Summer Wedding',
    date: '2025-06-15T00:00:00Z',
    location: 'Vancouver, BC',
    description:
      'A beautiful summer wedding at the waterfront. Capturing the joy and love of Emily and James on their special day.',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    is_published: true,
    created_at: '2025-06-16T00:00:00Z',
    modified_at: '2025-06-16T00:00:00Z',
    images: [
      {
        id: '1-1',
        collection_id: '1',
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552',
        order: 1,
        created_at: '2025-06-16T00:00:00Z',
      },
      {
        id: '1-2',
        collection_id: '1',
        image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866',
        order: 2,
        created_at: '2025-06-16T00:00:00Z',
      },
      {
        id: '1-3',
        collection_id: '1',
        image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
        order: 3,
        created_at: '2025-06-16T00:00:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Corporate Gala 2025',
    slug: 'corporate-gala-2025',
    type: 'event',
    title: 'Tech Innovation Gala',
    date: '2025-09-20T00:00:00Z',
    location: 'Kelowna, BC',
    description:
      'An elegant corporate event celebrating innovation and achievement. Professional photography capturing the atmosphere and key moments.',
    cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    is_published: true,
    created_at: '2025-09-21T00:00:00Z',
    modified_at: '2025-09-21T00:00:00Z',
    images: [
      {
        id: '2-1',
        collection_id: '2',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        order: 1,
        created_at: '2025-09-21T00:00:00Z',
      },
      {
        id: '2-2',
        collection_id: '2',
        image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
        order: 2,
        created_at: '2025-09-21T00:00:00Z',
      },
    ],
  },
  {
    id: '3',
    name: 'Mountain Adventure Series',
    slug: 'mountain-adventure-series',
    type: 'series',
    title: 'Exploring BC Mountains',
    date: '2025-07-01T00:00:00Z',
    location: 'British Columbia',
    description:
      'A collection of breathtaking mountain landscapes and outdoor adventures across British Columbia.',
    cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    is_published: true,
    created_at: '2025-07-02T00:00:00Z',
    modified_at: '2025-07-02T00:00:00Z',
    images: [
      {
        id: '3-1',
        collection_id: '3',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        order: 1,
        created_at: '2025-07-02T00:00:00Z',
      },
      {
        id: '3-2',
        collection_id: '3',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
        order: 2,
        created_at: '2025-07-02T00:00:00Z',
      },
      {
        id: '3-3',
        collection_id: '3',
        image_url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
        order: 3,
        created_at: '2025-07-02T00:00:00Z',
      },
      {
        id: '3-4',
        collection_id: '3',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        order: 4,
        created_at: '2025-07-02T00:00:00Z',
      },
    ],
  },
  {
    id: '4',
    name: 'Urban Nights',
    slug: 'urban-nights',
    type: 'series',
    title: 'City Life After Dark',
    date: '2025-08-10T00:00:00Z',
    location: 'Vancouver, BC',
    description:
      "Capturing the energy and beauty of Vancouver's urban landscape after sunset.",
    cover_image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785',
    is_published: true,
    created_at: '2025-08-11T00:00:00Z',
    modified_at: '2025-08-11T00:00:00Z',
    images: [
      {
        id: '4-1',
        collection_id: '4',
        image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785',
        order: 1,
        created_at: '2025-08-11T00:00:00Z',
      },
      {
        id: '4-2',
        collection_id: '4',
        image_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
        order: 2,
        created_at: '2025-08-11T00:00:00Z',
      },
    ],
  },
  {
    id: '5',
    name: 'Fall Family Portraits',
    slug: 'fall-family-portraits',
    type: 'event',
    title: 'The Anderson Family',
    date: '2025-10-05T00:00:00Z',
    location: 'Kelowna, BC',
    description: 'Warm autumn family portraits in the beautiful fall foliage.',
    cover_image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
    is_published: true,
    created_at: '2025-10-06T00:00:00Z',
    modified_at: '2025-10-06T00:00:00Z',
    images: [
      {
        id: '5-1',
        collection_id: '5',
        image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
        order: 1,
        created_at: '2025-10-06T00:00:00Z',
      },
      {
        id: '5-2',
        collection_id: '5',
        image_url: 'https://images.unsplash.com/photo-1609220136736-443140cffec6',
        order: 2,
        created_at: '2025-10-06T00:00:00Z',
      },
      {
        id: '5-3',
        collection_id: '5',
        image_url: 'https://images.unsplash.com/photo-1542190891-2093d38760f2',
        order: 3,
        created_at: '2025-10-06T00:00:00Z',
      },
    ],
  },
  {
    id: '6',
    name: 'Product Photography Workshop',
    slug: 'product-photography-workshop',
    type: 'event',
    title: 'Commercial Photography Masterclass',
    date: '2025-11-12T00:00:00Z',
    location: 'Vancouver, BC',
    description:
      'Behind the scenes and results from our commercial photography workshop.',
    cover_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    is_published: true,
    created_at: '2025-11-13T00:00:00Z',
    modified_at: '2025-11-13T00:00:00Z',
    images: [
      {
        id: '6-1',
        collection_id: '6',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        order: 1,
        created_at: '2025-11-13T00:00:00Z',
      },
      {
        id: '6-2',
        collection_id: '6',
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
        order: 2,
        created_at: '2025-11-13T00:00:00Z',
      },
    ],
  },
];

// Helper functions for fetching placeholder data
export function getAllCollections(): CollectionWithImages[] {
  return placeholderCollections.filter((c) => c.is_published);
}

export function getCollectionBySlug(slug: string): CollectionWithImages | undefined {
  return placeholderCollections.find((c) => c.slug === slug && c.is_published);
}

export function getCollectionsByType(type: string): CollectionWithImages[] {
  return placeholderCollections.filter((c) => c.type === type && c.is_published);
}
