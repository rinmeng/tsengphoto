/**
 * Service for video collection business logic
 * Handles client-side operations for video collections
 */

import type { Video, VideoCollection } from '@/lib/types';

/**
 * Deletes a video collection by calling the API endpoint
 * @param collectionId - The ID of the video collection to delete
 * @returns Promise with success status and optional error message
 */
export async function deleteVideoCollection(
  collectionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/v1/video-collections/${collectionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Failed to delete video collection',
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong' };
  }
}

/**
 * Creates a new video collection by calling the API endpoint
 * @param data - Video collection data
 * @returns Promise with success status, data, and optional error message
 */
export async function createVideoCollection(
  data: Partial<VideoCollection>
): Promise<{ success: boolean; data?: VideoCollection; error?: string }> {
  try {
    const response = await fetch('/api/v1/video-collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Failed to create video collection',
      };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Something went wrong' };
  }
}

/**
 * Updates an existing video collection by calling the API endpoint
 * @param id - Video collection ID
 * @param data - Updated video collection data
 * @returns Promise with success status, data, and optional error message
 */
export async function updateVideoCollection(
  id: string,
  data: Partial<VideoCollection>
): Promise<{ success: boolean; data?: VideoCollection; error?: string }> {
  try {
    const response = await fetch('/api/v1/video-collections', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Failed to update video collection',
      };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Something went wrong' };
  }
}

/**
 * Deletes a video from a collection by calling the API endpoint
 * @param videoId - The ID of the video to delete
 * @returns Promise with success status and optional error message
 */
export async function deleteVideo(
  videoId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/v1/video/${videoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to delete video' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong' };
  }
}

/**
 * Adds a video to a collection by calling the API endpoint
 * @param videoCollectionId - The ID of the video collection
 * @param youtubeUrl - The YouTube URL to add
 * @param title - Optional user-provided title
 * @param description - Optional user-provided description
 * @returns Promise with success status, data, and optional error message
 */
export async function addVideoToCollection(
  videoCollectionId: string,
  youtubeUrl: string,
  title?: string,
  description?: string
): Promise<{ success: boolean; data?: Video; error?: string }> {
  try {
    const response = await fetch('/api/v1/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_collection_id: videoCollectionId,
        youtube_url: youtubeUrl,
        title,
        description,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to add video' };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Something went wrong' };
  }
}
