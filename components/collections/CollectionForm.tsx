'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '@/components/animate-ui/components/button';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/components/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib';
import { CoverImageUploader } from '@/components/CoverImageUploader';

import { collectionsQueryKeys } from '@/lib/queries/collections';
import type { Collection } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui';

const COLLECTION_TYPES = ['event', 'video', 'series'] as const;

const collectionSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only.'),
  type: z.enum(COLLECTION_TYPES, { message: 'Type is required.' }),
  date: z.date().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  cover_image: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  cover_image_id: z.string().uuid().optional().or(z.literal('')),
  drive_link: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  is_published: z.boolean(),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

interface CollectionFormProps {
  mode: 'add' | 'edit';
  collection?: Collection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updatedSlug?: string) => void;
  defaultType?: 'event' | 'video' | 'series';
}

export function CollectionForm({
  mode,
  collection,
  open,
  onOpenChange,
  onSuccess,
  defaultType = 'event',
}: CollectionFormProps) {
  const queryClient = useQueryClient();
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: collection
      ? {
          title: collection.title,
          slug: collection.slug,
          type: collection.type as (typeof COLLECTION_TYPES)[number],
          date: collection.date ? new Date(collection.date) : undefined,
          location: collection.location || '',
          description: collection.description || '',
          cover_image: collection.cover_image || '',
          cover_image_id: collection.cover_image_id || '',
          drive_link: collection.drive_link || '',
          is_published: collection.is_published,
        }
      : {
          title: '',
          slug: '',
          type: defaultType,
          date: undefined,
          location: '',
          description: '',
          cover_image: '',
          cover_image_id: '',
          drive_link: '',
          is_published: false,
        },
  });

  // Watch cover_image_id at component level
  const coverImageId = useWatch({
    control: form.control,
    name: 'cover_image_id',
  });

  const mutation = useMutation({
    mutationFn: async (values: CollectionFormValues) => {
      const payload = {
        ...values,
        date: values.date ? values.date.toISOString() : null,
        location: values.location || null,
        description: values.description || null,
        cover_image: values.cover_image || null,
        cover_image_id: values.cover_image_id || null,
        drive_link: values.drive_link || null,
      };

      if (mode === 'add') {
        const response = await fetch('/api/v1/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create collection');
        }

        const result = await response.json();
        return { slug: result.data?.slug || values.slug };
      } else {
        const response = await fetch('/api/v1/collections', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: collection!.id, ...payload }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update collection');
        }

        const result = await response.json();
        return { slug: result.data?.slug || values.slug };
      }
    },
    onSuccess: async (data: { slug: string }) => {
      await queryClient.invalidateQueries({ queryKey: collectionsQueryKeys.all });
      await queryClient.refetchQueries({ queryKey: collectionsQueryKeys.all });
      toast.success(mode === 'add' ? 'Collection created' : 'Collection updated', {
        description: `Collection has been ${mode === 'add' ? 'created' : 'updated'} successfully.`,
      });
      onOpenChange(false);
      form.reset();
      mutation.reset();

      // Call onSuccess callback with the slug (for potential redirect)
      onSuccess?.(data.slug);
    },
    onError: (error: Error) => {
      form.setError('root', { message: error.message });
      toast.error(
        mode === 'add' ? 'Failed to create collection' : 'Failed to update collection',
        {
          description: error.message,
        }
      );
    },
  });

  // Reset form when dialog opens or collection changes
  useEffect(() => {
    if (open) {
      const defaultValues = collection
        ? {
            title: collection.title,
            slug: collection.slug,
            type: collection.type as (typeof COLLECTION_TYPES)[number],
            date: collection.date ? new Date(collection.date) : undefined,
            location: collection.location || '',
            description: collection.description || '',
            cover_image: collection.cover_image || '',
            cover_image_id: collection.cover_image_id || '',
            drive_link: collection.drive_link || '',
            is_published: collection.is_published,
          }
        : {
            title: '',
            slug: '',
            type: defaultType,
            date: undefined,
            location: '',
            description: '',
            cover_image: '',
            cover_image_id: '',
            drive_link: '',
            is_published: false,
          };
      form.reset(defaultValues);
    }
  }, [open, collection, defaultType, form]);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    if (mode === 'add') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  };

  const onSubmit = (values: CollectionFormValues) => {
    mutation.mutate(values);
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing dialog while cover image is uploading
    if (!newOpen && isCoverImageUploading) {
      toast.error('Please wait for the cover image to finish uploading');
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[70vh] sm:max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Collection' : 'Edit Collection'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleTitleChange(e.target.value);
                      }}
                      placeholder='A memorable event title'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Slug
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className='size-4 text-muted-foreground' />
                      </TooltipTrigger>
                      <TooltipContent>
                        A URL-friendly version of the collection title. It should be
                        lowercase, with words separated by hyphens.
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='user-friendly-readable-slug' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='event'>Event</SelectItem>
                      <SelectItem value='video'>Video</SelectItem>
                      <SelectItem value='series'>Series</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Date (optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Kelowna, BC' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='A memorable event description...'
                      rows={3}
                      className='max-h-50'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Google Drive Link */}
            <FormField
              control={form.control}
              name='drive_link'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Google Drive Folder (optional)
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className='size-4 text-muted-foreground' />
                      </TooltipTrigger>
                      <TooltipContent>
                        Link to a Google Drive folder to display additional images
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='https://drive.google.com/drive/folders/...'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image */}
            <FormField
              control={form.control}
              name='cover_image'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CoverImageUploader
                      value={field.value}
                      uploadId={coverImageId}
                      onChange={(data) => {
                        form.setValue('cover_image', data.url);
                        if (data.uploadId) {
                          form.setValue('cover_image_id', data.uploadId);
                        }
                      }}
                      onRemove={() => {
                        form.setValue('cover_image', '');
                        form.setValue('cover_image_id', '');
                      }}
                      onUploadingChange={setIsCoverImageUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Published */}
            <FormField
              control={form.control}
              name='is_published'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className='rounded'
                    >
                      <CheckboxIndicator />
                    </Checkbox>
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Published</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Root Error */}
            {form.formState.errors.root && (
              <div className='text-sm text-destructive'>
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Buttons */}
            <div className='flex gap-2 justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
                disabled={mutation.isPending || isCoverImageUploading}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={
                  mutation.isPending || mutation.isSuccess || isCoverImageUploading
                }
              >
                {mutation.isPending || mutation.isSuccess ? (
                  <>
                    <Spinner />
                    {mode === 'add' ? 'Creating...' : 'Updating...'}
                  </>
                ) : isCoverImageUploading ? (
                  <>
                    <Spinner />
                    Uploading cover...
                  </>
                ) : mode === 'add' ? (
                  'Create'
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
