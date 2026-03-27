'use client';

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
import { Button } from '@/components/animate-ui/components/button';
import { CollectionForm } from '@/components/collections/CollectionForm';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { SearchAndFilterBar } from '@/components/SearchAndFilterBar';
import { Text } from '@/components/Text';
import { Separator } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { collectionsQueryKeys } from '@/lib/queries/collections';
import type { CollectionWithImages } from '@/lib/types';
import { getDelayClass } from '@/utils/animations';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CollectionsLoading from './loading';

export default function CollectionsPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionWithImages | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
  const [filteredCollections, setFilteredCollections] = useState<CollectionWithImages[]>(
    []
  );

  const { data: collections = [], isLoading } = useQuery<CollectionWithImages[]>({
    queryKey: [...collectionsQueryKeys.list(), { includeUnpublished: isAuthenticated }],
    queryFn: async () => {
      const response = await fetch('/api/v1/collections');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const result = await response.json();
      return result.data || [];
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
      toast.success('Collection deleted', {
        description: 'Collection has been deleted successfully.',
      });
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
    },
    onError: (error: Error) => {
      toast.error('Failed to delete collection', {
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
        throw new Error('Collection not found');
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
        throw new Error(error.error || 'Failed to update collection');
      }

      return !collection.is_published;
    },
    onSuccess: (newPublishedState) => {
      queryClient.invalidateQueries({ queryKey: collectionsQueryKeys.all });
      toast.success(
        newPublishedState ? 'Collection published' : 'Collection unpublished',
        {
          description: newPublishedState
            ? 'Collection is now visible to everyone.'
            : 'Collection is now hidden from public view.',
        }
      );
    },
    onError: (error: Error) => {
      toast.error('Failed to update collection', {
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
          Collections
        </Text>
        <Text
          variant='bd-lg'
          className={`text-muted-foreground max-w-2xl mx-auto fade-in-from-bottom
            ${getDelayClass(1)}`}
        >
          Explore our portfolio of events, series, and video projects. Each collection
          tells a unique story through professional photography.
        </Text>
      </div>
      <Separator className='border' />
      <div className='container mx-auto px-4 py-4 border-dashed border-x-2'>
        {/* Page Header */}

        {/* Add Button - Only for authenticated users */}
        {isAuthenticated && (
          <div
            className={`mb-6 flex justify-center fade-in-from-bottom ${getDelayClass(2)}`}
          >
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus />
              Add New Collection
            </Button>
          </div>
        )}

        {/* Search Bar */}
        <div className={`mb-6 fade-in-from-bottom ${getDelayClass(3)}`}>
          <SearchAndFilterBar
            items={collections}
            searchKeys={['title', 'description', 'slug']}
            onFilteredResults={setFilteredCollections}
            placeholder='Search collections...'
            countLabel='collections'
          />
        </div>

        <CollectionGrid
          collections={filteredCollections}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
        />

        <CollectionForm mode='add' open={addDialogOpen} onOpenChange={setAddDialogOpen} />

        {selectedCollection && (
          <CollectionForm
            mode='edit'
            collection={selectedCollection}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the collection
                and all associated images.
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
