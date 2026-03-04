'use client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  Spinner,
} from '@/components/ui';
import {
  Checkbox,
  CheckboxIndicator,
} from '@/components/animate-ui/primitives/radix/checkbox';
import { EmptyState } from '@/components/EmptyState';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageOff, Info, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { Upload } from '@/lib/types';
import * as UploadService from '@/services/uploads.service';

export default function Admin() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const { toast } = useToast();

  const fetchUploads = async () => {
    const data = await UploadService.fetchUploads();

    if (!data) {
      toast.error('Failed to load uploads');
    } else {
      setUploads(data);
    }
    setLoading(false);
  };

  const handleDeleteUpload = async (id: string, fileUrl: string) => {
    setDeletingId(id);
    const result = await UploadService.deleteUpload(id, fileUrl);

    if (result.success) {
      toast.success('Upload deleted successfully');
      setUploads(uploads.filter((upload) => upload.id !== id));
    } else {
      toast.error(result.error || 'Something went wrong');
    }
    setDeletingId(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(uploads.map((upload) => upload.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    setBulkDeleting(true);
    const selectedUploads = uploads.filter((upload) => selectedIds.has(upload.id));
    let deletedCount = 0;

    // Sequential deletion
    for (const upload of selectedUploads) {
      setDeletingId(upload.id);
      const result = await UploadService.deleteUpload(upload.id, upload.file_url);

      if (result.success) {
        deletedCount++;
        setUploads((prev) => prev.filter((u) => u.id !== upload.id));
      } else {
        toast.error(`Failed to delete ${upload.file_name}: ${result.error}`);
      }
    }

    setDeletingId(null);
    setBulkDeleting(false);
    setSelectedIds(new Set());

    if (deletedCount > 0) {
      toast.success(
        `Successfully deleted ${deletedCount} image${deletedCount !== 1 ? 's' : ''}`
      );
    }
  };

  useEffect(() => {
    const fetchUploads = async () => {
      const data = await UploadService.fetchUploads();

      if (!data) {
        toast.error('Failed to load uploads');
      } else {
        setUploads(data);
      }
      setLoading(false);
    };

    fetchUploads();
  }, [toast]);

  return (
    <div className='nb-padding max-w-2xl mx-auto px-4 fade-in-from-right'>
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription
            className='flex items-center gap-1 mt-1 text-sm text-muted-foreground'
          >
            <Info className='size-4' />
            <p className='text-xs text-muted-foreground'>
              Tip: Try to keep the files under 16MB for faster uploads and
              betterperformance.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader
            onUploadComplete={() => {
              toast.success('Upload completed successfully!');
              fetchUploads();
            }}
            onUploadError={(error: Error) => {
              console.error('Upload error:', error);
              toast.error(`Upload failed: ${error.message}`);
            }}
          />
        </CardContent>
      </Card>

      {/* Uploads Gallery */}
      <Card className='mt-4'>
        <CardHeader>
          <div className='flex flex-col gap-2'>
            <CardTitle>Your Uploads</CardTitle>
            <CardDescription>
              {loading ? (
                <Skeleton className='h-4 w-32' />
              ) : (
                `${uploads.length} image${uploads.length !== 1 ? 's' : ''} uploaded`
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {uploads.length > 0 && !loading && (
            <div className='flex items-center justify-between w-full gap-2 mb-2'>
              <label className='flex items-center gap-2 text-sm cursor-pointer'>
                <Checkbox
                  checked={selectedIds.size === uploads.length && uploads.length > 0}
                  onCheckedChange={handleSelectAll}
                  disabled={bulkDeleting}
                  className='size-5 flex justify-center items-center border
                    data-[state=checked]:bg-primary
                    data-[state=checked]:text-primary-foreground transition-colors'
                >
                  <CheckboxIndicator className='size-3.5' />
                </Checkbox>
                Select All
              </label>
              {selectedIds.size > 0 && (
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                >
                  {bulkDeleting ? (
                    <>
                      <Spinner /> Deleting {selectedIds.size}...
                    </>
                  ) : (
                    <>
                      <Trash2 /> Delete Selected ({selectedIds.size})
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
          {loading ? (
            <div className='text-center py-8'>
              <Spinner className='size-8 mx-auto' />
            </div>
          ) : uploads.length === 0 ? (
            <EmptyState
              icon={ImageOff}
              title='No uploads yet'
              description='Upload your first image using the upload button above!'
              className='border-dashed border-2'
            />
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className='border rounded-lg overflow-hidden hover:shadow-lg
                    transition-shadow relative'
                >
                  <div className='absolute top-2 left-2 z-10'>
                    <Checkbox
                      checked={selectedIds.has(upload.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(upload.id, checked as boolean)
                      }
                      disabled={bulkDeleting}
                      className='size-5 flex justify-center items-center border
                        data-[state=checked]:bg-primary
                        data-[state=checked]:text-primary-foreground bg-background/80
                        backdrop-blur-sm transition-colors'
                    >
                      <CheckboxIndicator className='size-3.5' />
                    </Checkbox>{' '}
                  </div>
                  <div className='absolute top-2 right-2 z-10'>
                    <Button
                      variant='destructive'
                      size='sm'
                      className='w-full'
                      onClick={() => handleDeleteUpload(upload.id, upload.file_url)}
                      disabled={deletingId === upload.id || bulkDeleting}
                    >
                      {deletingId === upload.id ? (
                        <>
                          <Spinner />
                        </>
                      ) : (
                        <>
                          <Trash2 />
                        </>
                      )}
                    </Button>
                  </div>
                  <div className='relative aspect-video bg-muted'>
                    <Image
                      src={upload.file_url}
                      alt={upload.file_name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='p-3 space-y-2'>
                    <a
                      href={upload.file_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm font-medium truncate hover:underline
                        hover:text-primary transition-colors block'
                    >
                      {upload.file_name}
                    </a>
                    <div
                      className='flex items-center justify-between text-xs
                        text-muted-foreground'
                    >
                      <span>{(upload.file_size / 1024).toFixed(1)} KB</span>
                      <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
