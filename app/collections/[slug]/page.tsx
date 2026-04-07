import type { CollectionWithImages } from '@/lib/types';
import CollectionPageClient from './CollectionPageClient';

export const revalidate = 86400;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/v1/collections/${slug}`);

  const initialCollection: CollectionWithImages | undefined = res.ok
    ? (await res.json()).data
    : undefined;

  return <CollectionPageClient slug={slug} initialCollection={initialCollection} />;
}
