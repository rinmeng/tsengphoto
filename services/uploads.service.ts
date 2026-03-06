import { createClient } from '@/utils/supabase/client';
import type { Upload } from '@/lib/types';
import { Logger } from '@/lib/logger';

/**
 * Fetches all uploads for the current authenticated user
 * @returns Promise with uploads array or null if error
 */
export async function fetchUploads(): Promise<Upload[] | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Logger.error('Error fetching uploads:', error);
      return null;
    }

    return data;
  } catch (error) {
    Logger.error('Unexpected error fetching uploads:', error);
    return null;
  }
}

/**
 * Deletes an upload from both UploadThing and the database
 * @param uploadId - The ID of the upload to delete
 * @param fileUrl - The UploadThing URL of the file
 * @returns Promise with success status and optional error message
 */
export async function deleteUpload(
  uploadId: string,
  fileUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/v1/uploads', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uploadId, fileUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      Logger.error('Delete failed:', error);
      return { success: false, error: 'Failed to delete upload' };
    }

    return { success: true };
  } catch (error) {
    Logger.error('Unexpected error deleting upload:', error);
    return { success: false, error: 'Something went wrong' };
  }
}
