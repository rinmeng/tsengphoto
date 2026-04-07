import { zipSync } from 'fflate';

export interface ZipWorkerMessage {
  files: Record<string, Uint8Array>;
  collectionTitle: string;
}

export interface ZipWorkerResponse {
  success: boolean;
  zipBlob?: Blob;
  error?: string;
}

self.onmessage = (e: MessageEvent<ZipWorkerMessage>) => {
  try {
    const { files } = e.data;

    // Compress files using fflate
    const zipped = zipSync(files, { level: 6 });
    // Create blob from the compressed data
    const zipBlob = new Blob([zipped.slice(0).buffer], { type: 'application/zip' });

    const response: ZipWorkerResponse = {
      success: true,
      zipBlob,
    };

    self.postMessage(response);
  } catch (error) {
    const response: ZipWorkerResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    self.postMessage(response);
  }
};
