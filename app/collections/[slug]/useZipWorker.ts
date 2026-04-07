import { useCallback, useEffect, useRef } from 'react';
import type { ZipWorkerMessage, ZipWorkerResponse } from './zip.worker';

export function useZipWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker on mount
    workerRef.current = new Worker(new URL('./zip.worker.ts', import.meta.url), {
      type: 'module',
    });

    // Cleanup on unmount
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const createZip = useCallback(
    (files: Record<string, Uint8Array>, collectionTitle: string): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error('Worker not initialized'));
          return;
        }

        const worker = workerRef.current;

        const handleMessage = (e: MessageEvent<ZipWorkerResponse>) => {
          worker.removeEventListener('message', handleMessage);

          if (e.data.success && e.data.zipBlob) {
            resolve(e.data.zipBlob);
          } else {
            reject(new Error(e.data.error || 'Failed to create zip'));
          }
        };

        worker.addEventListener('message', handleMessage);

        const message: ZipWorkerMessage = { files, collectionTitle };
        worker.postMessage(message);
      });
    },
    []
  );

  return { createZip };
}
