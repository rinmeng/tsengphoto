'use client';

import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { useUploadThing } from '@/utils/uploadthing/uploadthing';
import { Button } from '@/components/animate-ui/components/button';
import { Progress } from '@/components/ui';
import { Text } from '@/components/Text';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface CoverImageUploaderProps {
  value?: string; // Current image URL (backward compatible)
  uploadId?: string; // Current upload ID
  onChange?: (data: { url: string; uploadId?: string }) => void; // Callback with URL and upload ID
  onRemove?: () => void; // Callback when image is removed
  onUploadingChange?: (isUploading: boolean) => void; // Callback when upload state changes
  className?: string;
}

type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

interface FileWithStatus {
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
}

export function CoverImageUploader({
  value,
  uploadId,
  onChange,
  onRemove,
  onUploadingChange,
  className,
}: CoverImageUploaderProps) {
  const [fileState, setFileState] = useState<FileWithStatus | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { startUpload } = useUploadThing('imageUploader', {
    onUploadProgress: (progress) => {
      setFileState((prev) => (prev ? { ...prev, progress } : null));
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileState({
          file,
          status: 'uploading',
          progress: 0,
        });
        setIsUploading(true);
        onUploadingChange?.(true);

        try {
          const result = await startUpload([file]);
          if (result && result[0]?.url) {
            setFileState((prev) =>
              prev ? { ...prev, status: 'success', progress: 100 } : null
            );

            // Extract uploadId from serverData
            const uploadId = result[0].serverData?.uploadId;
            onChange?.({
              url: result[0].url,
              uploadId: uploadId,
            });
            toast.success('Cover image uploaded successfully');

            // Clear file state after successful upload
            setTimeout(() => {
              setFileState(null);
              setIsUploading(false);
              onUploadingChange?.(false);
            }, 500);
          } else {
            throw new Error('Upload failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          setFileState((prev) =>
            prev ? { ...prev, status: 'error', error: errorMessage } : null
          );
          toast.error(errorMessage);
          setIsUploading(false);
          onUploadingChange?.(false);
        }
      }
    },
    [startUpload, onChange, onUploadingChange, toast]
  );

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
    maxFiles: 1,
    maxSize: 16 * 1024 * 1024, // 16MB
    disabled: isUploading || !!value, // Disable if already has image
  });

  const handleRemove = async () => {
    // If there's an upload ID, delete from UploadThing and database
    if (uploadId && value) {
      try {
        const response = await fetch('/api/v1/uploads', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uploadId: uploadId,
            fileUrl: value,
          }),
        });

        if (!response.ok) {
          toast.error('Failed to delete image from storage');
          return;
        }

        toast.success('Cover image deleted successfully');
      } catch {
        toast.error('Something went wrong while deleting the image');
        return;
      }
    }

    setFileState(null);
    onRemove?.();
  };

  // If there's already an uploaded image (value), show it
  if (value && !fileState) {
    return (
      <div className={cn('space-y-2', className)}>
        <Text variant='bd-sm' className='font-medium'>
          Cover Image
        </Text>
        <div
          className='relative w-full aspect-video rounded-lg overflow-hidden border group'
        >
          <Image
            src={value}
            alt='Cover image'
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 600px'
          />
          <div
            className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
              transition-opacity flex items-center justify-center'
          >
            <Button
              variant='destructive'
              size='icon'
              onClick={handleRemove}
              type='button'
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Text variant='bd-sm' className='font-medium'>
        Cover Image (optional)
      </Text>

      {/* Dropzone */}
      {!fileState && (
        <div
          {...getRootProps()}
          className={cn(
            `border-2 border-dashed rounded p-6 text-center cursor-pointer
            transition-colors`,
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center gap-2'>
            <div className='rounded-full bg-primary/10 p-3 text-primary'>
              <Upload className='size-6' />
            </div>
            {isDragActive ? (
              <Text variant='bd-sm' className='font-medium'>
                Drop the image here...
              </Text>
            ) : (
              <>
                <Text variant='bd-sm' className='font-medium'>
                  Drag & drop an image, or click to select
                </Text>
                <Text variant='caption'>PNG, JPG, JPEG, GIF, WEBP up to 16MB</Text>
              </>
            )}
          </div>
        </div>
      )}

      {/* File Preview & Upload */}
      {fileState && (
        <div className='border rounded p-4 space-y-3'>
          <div className='flex items-center gap-3'>
            <div className='rounded bg-primary/10 p-2 text-primary'>
              <ImageIcon />
            </div>
            <div className='flex-1 min-w-0'>
              <Text variant='bd-sm' className='font-medium truncate'>
                {fileState.file.name}
              </Text>
              <Text variant='caption'>
                {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
                {fileState.error && (
                  <Text variant='caption' className='text-destructive ml-2'>
                    Error: {fileState.error}
                  </Text>
                )}
              </Text>
            </div>
          </div>

          {/* Progress Bar */}
          {fileState.status === 'uploading' && (
            <div className='space-y-1'>
              <div className='flex items-center justify-between'>
                <Text variant='caption'>Uploading...</Text>
                <Text variant='caption'>{fileState.progress}%</Text>
              </div>
              <Progress value={fileState.progress} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
