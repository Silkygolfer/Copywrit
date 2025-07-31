'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  thread: Doc<'threads'> | null;
}

export function DeleteDialog({ open, onOpenChange, thread }: DeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const deleteThread = useMutation(api.threads.deleteThread);

  const handleDelete = async () => {
    setIsLoading(true);
    if (!thread) return;
    const result = await deleteThread({
      threadId: thread._id,
    });
    if (result.success) {
      toast.success('Thread deleted successfully');
      setIsLoading(false);
      onOpenChange(false);
    } else {
      toast.error('Failed to delete thread');
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(o: boolean) => { if (!isLoading) onOpenChange(o); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Thread</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-bold">{thread?.title}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline" disabled={isLoading}>Cancel</Button>
          <Button onClick={handleDelete} variant="destructive" className='bg-destructive text-destructive-foreground hover:bg-destructive/90' disabled={isLoading}>
            {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Deleting...</>) : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 