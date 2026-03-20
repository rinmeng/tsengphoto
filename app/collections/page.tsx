'use client';

import { useState } from 'react';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { CollectionForm } from '@/components/collections/CollectionForm';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionsQueryKeys } from '@/lib/queries/collections';
import { Skeleton } from '@/components/ui';
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
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { CollectionWithImages } from '@/lib/types';

export default function CollectionsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionWithImages | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);

  const { data: collections = [], isLoading } = useQuery({
    queryKey: [...collectionsQueryKeys.list(), { includeUnpublished: !!user }],
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

  const handleEdit = (collection: CollectionWithImages) => {
    setSelectedCollection(collection);
    setEditDialogOpen(true);
  };

  const handleDelete = (collectionId: string) => {
    setCollectionToDelete(collectionId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (collectionToDelete) {
      deleteMutation.mutate(collectionToDelete);
    }
  };

  return (
    <div className='container mx-auto px-4 pb-4 nb-padding min-h-screen'>
      {/* Page Header */}
      <div className='mb-12 text-center space-y-4'>
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

      {/* Add Button - Only for authenticated users */}
      {user && (
        <div className={`mb-6 flex justify-end fade-in-from-top ${getDelayClass(2)}`}>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus />
            Add New Collection
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`fade-in-from-bottom ${getDelayClass(i)}`}>
              <Skeleton className='h-80 w-full rounded-xl' />
            </div>
          ))}
        </div>
      ) : (
        <CollectionGrid
          collections={collections}
          isAuthenticated={!!user}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add Dialog */}
      <CollectionForm mode='add' open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      {/* Edit Dialog */}
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
  );
}
