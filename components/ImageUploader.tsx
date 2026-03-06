'use client';

import { useCallback, useRef, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { useUploadThing } from '@/utils/uploadthing/uploadthing';
import { Button, Progress, ScrollArea } from '@/components/ui';
import { Text } from '@/components/Text';
import { Upload, Image as ImageIcon, X, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Footer } from './Footer';

interface ImageUploaderProps {
  onUploadComplete?: () => void;
  onUploadError?: (error: Error) => void;
}

type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

interface FileWithStatus {
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
}

export function ImageUploader({ onUploadComplete, onUploadError }: ImageUploaderProps) {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const currentFileIndexRef = useRef<number>(-1);
  const { toast } = useToast();

  const { startUpload } = useUploadThing('imageUploader', {
    onUploadProgress: (progress) => {
      const currentIdx = currentFileIndexRef.current;
      if (currentIdx >= 0) {
        setFiles((prev) =>
          prev.map((f, idx) => (idx === currentIdx ? { ...f, progress } : f))
        );
      }
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => {
      const newFiles: FileWithStatus[] = [...prev];
      const existingNames = new Set(prev.map((f) => f.file.name));

      acceptedFiles.forEach((file) => {
        let fileName = file.name;
        let counter = 1;

        // Rename if duplicate
        while (existingNames.has(fileName)) {
          const nameParts = file.name.split('.');
          const ext = nameParts.pop();
          const baseName = nameParts.join('.');
          fileName = `${baseName} (${counter}).${ext}`;
          counter++;
        }

        // Create new file with potentially renamed name
        const finalFile =
          fileName !== file.name ? new File([file], fileName, { type: file.type }) : file;

        newFiles.push({
          file: finalFile,
          status: 'pending',
          progress: 0,
        });
        existingNames.add(fileName);
      });

      return newFiles;
    });
  }, []);

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      fileRejections.forEach((rejection) => {
        const { file, errors } = rejection;

        errors.forEach((error) => {
          if (error.code === 'file-invalid-type') {
            toast.error(
              `"${file.name}" is not a supported image format. Please use PNG, JPG, JPEG, GIF, or WEBP.`
            );
          } else if (error.code === 'file-too-large') {
            toast.error(`"${file.name}" is too large. Maximum file size is 16MB.`);
          } else if (error.code === 'too-many-files') {
            toast.error('Too many files selected. Maximum is 10 files at a time.');
          } else {
            toast.error(`Error with "${file.name}": ${error.message}`);
          }
        });
      });
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 10,
    maxSize: 16 * 1024 * 1024, // 16MB per file
  });

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    let hasErrors = false;

    // Upload files sequentially
    for (let i = 0; i < files.length; i++) {
      currentFileIndexRef.current = i;
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: 'uploading' as FileStatus, progress: 0 } : f
        )
      );

      try {
        await startUpload([files[i].file]);
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'success' as FileStatus, progress: 100 } : f
          )
        );
      } catch (error) {
        hasErrors = true;
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'error' as FileStatus, error: errorMessage } : f
          )
        );
        onUploadError?.(error instanceof Error ? error : new Error('Upload failed'));
      }
    }

    currentFileIndexRef.current = -1;

    // Only clear and call success if no errors
    if (!hasErrors) {
      onUploadComplete?.();
      // Brief delay to show success state, then clear
      setTimeout(() => {
        setFiles([]);
        setIsUploading(false);
      }, 500);
    } else {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeAllFiles = () => {
    setFiles([]);
  };

  return (
    <div className='space-y-4'>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          `border-2 border-dashed rounded p-8 text-center cursor-pointer
          transition-colors`,
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center gap-2'>
          <div className='rounded-full bg-primary/10 p-4 text-primary'>
            <Upload className='size-8' />
          </div>
          {isDragActive ? (
            <Text variant='bd-sm' className='font-medium'>
              Drop the images here...
            </Text>
          ) : (
            <>
              <Text variant='bd-sm' className='font-medium'>
                Drag & drop images here, or click to select
              </Text>
              <Text variant='caption'>PNG, JPG, JPEG, GIF, WEBP up to 16MB per file</Text>
            </>
          )}
        </div>
      </div>

      {/* Selected Files Preview */}
      {files.length > 0 && (
        <div className='border rounded p-4 space-y-3'>
          <div className='flex items-center justify-between'>
            <Text variant='bd-sm' className='font-medium'>
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </Text>
            {!isUploading && (
              <Button variant='ghost' size='sm' onClick={removeAllFiles}>
                Clear all
              </Button>
            )}
          </div>

          {/* File List */}
          <ScrollArea className='h-80'>
            <div className='space-y-3 pr-4'>
              {files.map((fileWithStatus, index) => (
                <div key={`${fileWithStatus.file.name}-${index}`} className='space-y-2'>
                  <div className='flex flex-col bg-muted/50 border rounded'>
                    {/* File Info */}
                    <div className='flex items-center gap-3 p-2 rounded'>
                      <div className='rounded bg-primary/10 p-2 text-primary'>
                        <ImageIcon />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <Text variant='bd-sm' className='font-medium truncate'>
                          {fileWithStatus.file.name}
                        </Text>
                        <Text variant='caption'>
                          {(fileWithStatus.file.size / 1024 / 1024).toFixed(2)} MB
                          {fileWithStatus.error && (
                            <Text variant='caption' className='text-destructive ml-2'>
                              Error: {fileWithStatus.error}
                            </Text>
                          )}
                        </Text>
                      </div>

                      {/* Status Icon */}
                      {fileWithStatus.status === 'success' && (
                        <CheckCircle2 className='size-5 text-green-500 shrink-0' />
                      )}
                      {fileWithStatus.status === 'error' && (
                        <XCircle className='size-5 text-destructive shrink-0' />
                      )}
                      {!isUploading && fileWithStatus.status === 'pending' && (
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => removeFile(index)}
                          className='shrink-0 size-8'
                        >
                          <X className='size-4' />
                        </Button>
                      )}
                    </div>
                    {/* Per-file Progress Bar */}
                    {fileWithStatus.status === 'uploading' && (
                      <div className='space-y-1 px-2 pb-2'>
                        <div className='flex items-center justify-between'>
                          <Text variant='caption'>Uploading...</Text>
                          <Text variant='caption'>{fileWithStatus.progress}%</Text>
                        </div>
                        <Progress value={fileWithStatus.progress} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Upload Button or Summary */}
          {!isUploading ? (
            <Button
              onClick={handleUpload}
              className='w-full'
              disabled={files.length === 0}
            >
              <Upload />
              Upload {files.length} Image{files.length !== 1 ? 's' : ''}
            </Button>
          ) : (
            <Text variant='bd-sm' className='text-center text-muted-foreground'>
              Uploading {files.filter((f) => f.status === 'success').length} of{' '}
              {files.length} files...
            </Text>
          )}
        </div>
      )}
    </div>
  );
}
