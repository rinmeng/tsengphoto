'use client';

import { useState } from 'react';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { CollectionForm } from '@/components/collections/CollectionForm';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionsQueryKeys } from '@/lib/queries/collections';
import { Button } from '@/components/animate-ui/components/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/animate-ui/components/alert-dialog';
import { toast } from 'sonner';
import type { CollectionWithImages } from '@/lib/types';
import CollectionsLoading from '@/app/collections/loading';
import { Separator } from '@/components/ui';

export default function EventsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionWithImages | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);

  const { data: collections = [], isLoading } = useQuery({
    queryKey: [...collectionsQueryKeys.byType('event'), { includeUnpublished: !!user }],
    queryFn: async () => {
      const response = await fetch('/api/v1/collections');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const result = await response.json();
      const allCollections = result.data || [];
      return allCollections.filter((c: CollectionWithImages) => c.type === 'event');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      const response = await fetch('/api/v1/collections', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: collectionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete collection');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionsQueryKeys.all });
      toast.success('Event deleted', {
        description: 'Event has been deleted successfully.',
      });
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
    },
    onError: (error: Error) => {
      toast.error('Failed to delete event', {
        description: error.message,
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      const collection = collections.find(
        (c: CollectionWithImages) => c.id === collectionId
      );
      if (!collection) {
        throw new Error('Event not found');
      }

      const response = await fetch('/api/v1/collections', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: collectionId,
          is_published: !collection.is_published,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update event');
      }

      return !collection.is_published;
    },
    onSuccess: (newPublishedState) => {
      queryClient.invalidateQueries({ queryKey: collectionsQueryKeys.all });
      toast.success(newPublishedState ? 'Event published' : 'Event unpublished', {
        description: newPublishedState
          ? 'Event is now visible to everyone.'
          : 'Event is now hidden from public view.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to update event', {
        description: error.message,
      });
    },
  });

  const handleEdit = (collection: CollectionWithImages) => {
    setSelectedCollection(collection);
    setEditDialogOpen(true);
  };

  const handleDelete = (collectionId: string) => {
    setCollectionToDelete(collectionId);
    setDeleteDialogOpen(true);
  };

  const handlePublish = (collectionId: string) => {
    publishMutation.mutate(collectionId);
  };

  const confirmDelete = () => {
    if (collectionToDelete) {
      deleteMutation.mutate(collectionToDelete);
    }
  };

  if (isLoading) {
    return <CollectionsLoading />;
  }

  return (
    <div className='pt-18'>
      <div
        className='container mx-auto border-x-2 border-dashed text-center space-y-4 py-8'
      >
        <Text variant='hd-xxl' className={`fade-in-from-bottom ${getDelayClass(0)}`}>
          Events
        </Text>
        <Text
          variant='bd-lg'
          className={`text-muted-foreground max-w-2xl mx-auto fade-in-from-bottom
            ${getDelayClass(1)}`}
        >
          Capturing life&apos;s special moments - from weddings and corporate gatherings
          to family portraits and workshops. Browse our event photography portfolio.
        </Text>
      </div>
      <Separator className='border' />
      <div className='container mx-auto px-4 py-4 border-dashed border-x-2'>
        {/* Add Button - Only for authenticated users */}
        {user && (
          <div
            className={`mb-6 flex justify-center fade-in-from-top ${getDelayClass(2)}`}
          >
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus />
              Add New Event
            </Button>
          </div>
        )}

        <CollectionGrid
          collections={collections}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
        />

        <CollectionForm
          mode='add'
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          defaultType='event'
        />

        {selectedCollection && (
          <CollectionForm
            mode='edit'
            collection={selectedCollection}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event and
                all associated images.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className='bg-destructive hover:bg-destructive/90'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
