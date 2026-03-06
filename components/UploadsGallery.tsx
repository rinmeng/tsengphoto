'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollArea,
  Skeleton,
  Spinner,
} from '@/components/ui';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import { EmptyState } from '@/components/EmptyState';
import { Text } from '@/components/Text';
import { Download, ImageOff, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/hooks/use-loading';
import type { Upload } from '@/lib/types';
import * as UploadService from '@/services/uploads.service';
import Link from 'next/link';

interface UploadsGalleryProps {
  title?: string;
  description?: string;
  onUploadDeleted?: () => void;
}

export function UploadsGallery({
  title = 'Your Uploads',
  description,
  onUploadDeleted,
}: UploadsGalleryProps) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletionProgress, setDeletionProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();
  const { setLoading, isLoading } = useLoading();

  const handleDownload = async (fileUrl: string, fileName: string) => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchUploads = async () => {
    setLoading('uploads:fetch', true);
    try {
      const data = await UploadService.fetchUploads();

      if (!data) {
        toast.error('Failed to load uploads');
      } else {
        setUploads(data);
      }
    } finally {
      setLoading('uploads:fetch', false);
    }
  };

  const handleDeleteUpload = async (id: string, fileUrl: string) => {
    setLoading(`uploads:delete:${id}`, true);
    try {
      const result = await UploadService.deleteUpload(id, fileUrl);

      if (result.success) {
        toast.success('Upload deleted successfully');
        setUploads(uploads.filter((upload) => upload.id !== id));
        onUploadDeleted?.();
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } finally {
      setLoading(`uploads:delete:${id}`, false);
    }
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

    setLoading('uploads:bulkDelete', true);
    const selectedUploads = uploads.filter((upload) => selectedIds.has(upload.id));
    const totalCount = selectedUploads.length;
    let deletedCount = 0;

    setDeletionProgress({ current: 0, total: totalCount });

    try {
      for (let i = 0; i < selectedUploads.length; i++) {
        const upload = selectedUploads[i];
        setDeletionProgress({ current: i + 1, total: totalCount });

        const result = await UploadService.deleteUpload(upload.id, upload.file_url);

        if (result.success) {
          deletedCount++;
          setUploads((prev) => prev.filter((u) => u.id !== upload.id));
        } else {
          toast.error(`Failed to delete ${upload.file_name}: ${result.error}`);
        }
      }

      if (deletedCount > 0) {
        toast.success(
          `Successfully deleted ${deletedCount} image${deletedCount !== 1 ? 's' : ''}`
        );
        onUploadDeleted?.();
      }
    } finally {
      setLoading('uploads:bulkDelete', false);
      setSelectedIds(new Set());
      setDeletionProgress({ current: 0, total: 0 });
    }
  };

  useEffect(() => {
    fetchUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-2'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {isLoading('uploads:fetch') ? (
              <Skeleton className='h-4 w-32' />
            ) : (
              description ||
              `${uploads.length} image${uploads.length !== 1 ? 's' : ''} uploaded`
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {uploads.length > 0 && !isLoading('uploads:fetch') && (
          <div className='flex items-center justify-between w-full gap-2 mb-2'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <Checkbox
                checked={selectedIds.size === uploads.length && uploads.length > 0}
                onCheckedChange={handleSelectAll}
                disabled={isLoading('uploads:bulkDelete')}
              >
                <CheckboxIndicator />
              </Checkbox>
              <Text variant='bd-sm'>Select All</Text>
            </label>
            {selectedIds.size > 0 && (
              <Button
                variant='destructive'
                size='sm'
                onClick={handleBulkDelete}
                disabled={isLoading('uploads:bulkDelete')}
              >
                {isLoading('uploads:bulkDelete') ? (
                  <>
                    <Spinner /> Deleting {deletionProgress.current} of{' '}
                    {deletionProgress.total}...
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
        {isLoading('uploads:fetch') ? (
          <div className='text-center py-8'>
            <Spinner className='size-8 mx-auto' />
          </div>
        ) : uploads.length === 0 ? (
          <EmptyState
            bordered={true}
            icon={ImageOff}
            title='No uploads yet'
            description='Upload your first image to get started!'
          />
        ) : (
          <ScrollArea className='h-150 pr-4'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
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
                      disabled={isLoading('uploads:bulkDelete')}
                      variant='overlay'
                    >
                      <CheckboxIndicator />
                    </Checkbox>
                  </div>
                  <div className='absolute top-2 right-2 z-10'>
                    <Button
                      variant='destructive'
                      size='icon'
                      onClick={() => handleDeleteUpload(upload.id, upload.file_url)}
                      disabled={
                        isLoading(`uploads:delete:${upload.id}`) ||
                        isLoading('uploads:bulkDelete')
                      }
                    >
                      {isLoading(`uploads:delete:${upload.id}`) ? (
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
                    <Link
                      href={upload.file_url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Image
                        src={upload.file_url}
                        alt={upload.file_name}
                        fill
                        className='object-cover'
                      />
                    </Link>
                  </div>
                  <div className='p-3 space-y-2'>
                    <Link
                      href={upload.file_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:underline hover:text-primary transition-colors
                        block'
                    >
                      <Text variant='bd-sm' className='font-medium truncate'>
                        {upload.file_name}
                      </Text>
                      <Text variant='caption'>
                        {(upload.file_size / 1024 / 1024).toFixed(1)} MB
                      </Text>
                    </Link>
                    <div className='flex items-center justify-between'>
                      <Text variant='caption'>
                        {format(new Date(upload.created_at), 'MMM d, yyyy')}
                      </Text>
                      <Button
                        variant='secondary'
                        size='icon'
                        onClick={() => handleDownload(upload.file_url, upload.file_name)}
                      >
                        <Download />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
