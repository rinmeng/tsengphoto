/**
 * Deletes an upload by calling the API endpoint
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
      return { success: false, error: error.error || 'Failed to delete upload' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong' };
  }
}
