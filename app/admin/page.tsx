'use client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Spinner,
} from '@/components/ui';
import { UploadButton } from '@/utils/uploadthing/uploadthing';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { Upload } from '@/lib/types';
import * as UploadService from '@/services/uploads.service';

export default function Admin() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
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
    const result = await UploadService.deleteUpload(id, fileUrl);

    if (result.success) {
      toast.success('Upload deleted successfully');
      setUploads(uploads.filter((upload) => upload.id !== id));
    } else {
      toast.error(result.error || 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <div className='nb-padding max-w-2xl mx-auto px-4 fade-in-from-right'>
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Upload images to UploadThing and store metadata in Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadButton
            endpoint='imageUploader'
            onClientUploadComplete={() => {
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
          <CardTitle>Your Uploads</CardTitle>
          <CardDescription>
            {loading ? (
              <Spinner />
            ) : (
              `${uploads.length} image${uploads.length !== 1 ? 's' : ''} uploaded`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-center py-8'>
              <Spinner className='size-8 mx-auto' />
            </div>
          ) : uploads.length === 0 ? (
            <div className='text-center text-muted-foreground py-8'>
              No uploads yet. Upload your first image above!
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className='border rounded-lg overflow-hidden hover:shadow-lg
                    transition-shadow'
                >
                  <div className='relative aspect-video bg-muted'>
                    <Image
                      src={upload.file_url}
                      alt={upload.file_name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='p-3 space-y-2'>
                    <p className='text-sm font-medium truncate'>{upload.file_name}</p>
                    <div
                      className='flex items-center justify-between text-xs
                        text-muted-foreground'
                    >
                      <span>{(upload.file_size / 1024).toFixed(1)} KB</span>
                      <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                    </div>
                    <Button
                      variant='destructive'
                      size='sm'
                      className='w-full'
                      onClick={() => handleDeleteUpload(upload.id, upload.file_url)}
                    >
                      <Trash2 />
                      Delete
                    </Button>
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
