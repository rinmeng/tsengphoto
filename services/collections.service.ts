import { createClient } from '@/utils/supabase/server';
import type { Collection, CollectionWithImages, CollectionImage } from '@/lib/types';
import { Logger } from '@/lib/logger';

/**
 * Fetches all collections with their images
 * @param includeUnpublished - Whether to include unpublished collections (defaults to false)
 * @returns Promise with collections array or null if error
 */
export async function fetchAllCollections(
  includeUnpublished = false
): Promise<CollectionWithImages[] | null> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('collections')
      .select(
        `
        *,
        images:collection_image(*)
      `
      )
      .order('created_at', { ascending: false });

    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      Logger.error('Error fetching collections:', error);
      return null;
    }

    return data as CollectionWithImages[];
  } catch (error) {
    Logger.error('Unexpected error fetching collections:', error);
    return null;
  }
}

/**
 * Fetches a single collection by slug with its images
 * @param slug - The slug of the collection
 * @param includeUnpublished - Whether to allow unpublished collections (defaults to false)
 * @returns Promise with collection or null if error/not found
 */
export async function fetchCollectionBySlug(
  slug: string,
  includeUnpublished = false
): Promise<CollectionWithImages | null> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('collections')
      .select(
        `
        *,
        images:collection_image(*)
      `
      )
      .eq('slug', slug);

    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query.single();

    if (error) {
      Logger.error('Error fetching collection by slug:', error);
      return null;
    }

    return data as CollectionWithImages;
  } catch (error) {
    Logger.error('Unexpected error fetching collection:', error);
    return null;
  }
}

/**
 * Creates a new collection
 * @param collection - Collection data without id and timestamps
 * @returns Promise with success status and optional error message
 */
export async function createCollection(
  collection: Omit<Collection, 'id' | 'created_at' | 'modified_at'>
): Promise<{ success: boolean; data?: Collection; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collections')
      .insert(collection)
      .select()
      .single();

    if (error) {
      Logger.error('Error creating collection:', error);
      return { success: false, error: 'Something went wrong.' };
    }

    return { success: true, data };
  } catch (error) {
    Logger.error('Unexpected error creating collection:', error);
    return { success: false, error: 'Something went wrong.' };
  }
}

/**
 * Updates an existing collection
 * @param id - Collection ID
 * @param updates - Partial collection data to update
 * @returns Promise with success status and optional error message
 */
export async function updateCollection(
  id: string,
  updates: Partial<Omit<Collection, 'id' | 'created_at'>>
): Promise<{ success: boolean; data?: Collection; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collections')
      .update({
        ...updates,
        modified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      Logger.error('Error updating collection:', error);
      return { success: false, error: 'Something went wrong.' };
    }

    return { success: true, data };
  } catch (error) {
    Logger.error('Unexpected error updating collection:', error);
    return { success: false, error: 'Something went wrong.' };
  }
}

/**
 * Deletes a collection and its associated images
 * @param id - Collection ID
 * @returns Promise with success status and optional error message
 */
export async function deleteCollection(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('collections').delete().eq('id', id);

    if (error) {
      Logger.error('Error deleting collection:', error);
      return { success: false, error: 'Something went wrong.' };
    }

    return { success: true };
  } catch (error) {
    Logger.error('Unexpected error deleting collection:', error);
    return { success: false, error: 'Something went wrong.' };
  }
}

/**
 * Adds an image to a collection
 * @param collectionId - Collection ID
 * @param imageUrl - Image URL
 * @param order - Optional display order
 * @returns Promise with success status and optional error message
 */
export async function addImageToCollection(
  collectionId: string,
  imageUrl: string,
  order?: number
): Promise<{ success: boolean; data?: CollectionImage; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collection_image')
      .insert({
        collection_id: collectionId,
        image_url: imageUrl,
        order,
      })
      .select()
      .single();

    if (error) {
      Logger.error('Error adding image to collection:', error);
      return { success: false, error: 'Something went wrong.' };
    }

    return { success: true, data };
  } catch (error) {
    Logger.error('Unexpected error adding image:', error);
    return { success: false, error: 'Something went wrong.' };
  }
}

/**
 * Removes an image from a collection
 * @param imageId - Collection image ID
 * @returns Promise with success status and optional error message
 */
export async function removeImageFromCollection(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('collection_image').delete().eq('id', imageId);

    if (error) {
      Logger.error('Error removing image from collection:', error);
      return { success: false, error: 'Something went wrong.' };
    }

    return { success: true };
  } catch (error) {
    Logger.error('Unexpected error removing image:', error);
    return { success: false, error: 'Something went wrong.' };
  }
}
