'use client'
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import Link from 'next/link'
import LogOutButton from '../log-out-button'
import { memo, useState, useEffect } from 'react'
import equal from 'fast-deep-equal'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { ThreadMenu } from './thread-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner'
import { deleteThread } from '../../../../convex/threads'

interface ChatSidebarProps {
    threads: Preloaded<typeof api.threads.listThreads>
}

const PureChatSidebar = memo(({ threads }: ChatSidebarProps) => {
    // state
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [currentThread, setCurrentThread] = useState<Doc<'threads'> | null>(null);

    const threadsData = usePreloadedQuery(threads);
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className='bg-copywrit-blue/20 hover:bg-copywrit-blue/30 border border-copywrit-cream/20 hover:border-copywrit-cream/40 justify-center'>
                            <Link href="/chat">New Chat</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <h1>Chats</h1>
                    </SidebarGroupLabel>
                    <SidebarMenu className="list-none">
                        {threadsData?.map((thread: Doc<"threads">) => (
                            <SidebarMenuButton
                            asChild
                            key={thread._id}
                            className="flex items-center cursor-pointer hover:bg-copywrit-blue/20 hover:text-copywrit-cream rounded-sm list-none w-full"
                            >
                                <div className="flex items-center w-full">
                                    <Link href={`/chat/${thread._id}`} className="flex-1 min-w-0">
                                        <span className="block text-ellipsis overflow-hidden whitespace-nowrap">
                                            {thread.title.length > 30 ? thread.title.slice(0, 30) + "…" : thread.title}
                                        </span>
                                    </Link>
                                    <div className="flex items-center justify-center">
                                        <ThreadMenu
                                          onRename={() => {
                                            setCurrentThread(thread);
                                            setShowRenameDialog(true);
                                          }}
                                          onDelete={() => {
                                            setCurrentThread(thread);
                                            setShowDeleteDialog(true);
                                          }}
                                        />
                                    </div>
                                </div>
                            </SidebarMenuButton>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <LogOutButton />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            {/* Dialogs for rename and delete */}
            <RenameDialog open={showRenameDialog} onOpenChange={setShowRenameDialog} thread={currentThread} />
            <DeleteDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} thread={currentThread} />
        </Sidebar>
    )
}, (prevProps, nextProps) => {
    // Only re-render if threads actually changed (using deep comparison)
    return equal(prevProps.threads, nextProps.threads);
});

PureChatSidebar.displayName = 'PureChatSidebar';

// --- Dialog Components ---

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  thread: Doc<'threads'> | null;
}

export function RenameDialog({ open, onOpenChange, thread }: RenameDialogProps) {
  const [value, setValue] = useState(thread?.title || '');
  const [isLoading, setIsLoading] = useState(false);
  const renameThread = useMutation(api.threads.updateThreadTitle);

  useEffect(() => {
    if (open && thread) setValue(thread.title);
  }, [open, thread]);

  const handleRename = async () => {
    setIsLoading(true);
    if (!thread) return;
    const result = await renameThread({
      threadId: thread._id,
      title: value,
    });
    if (result.success) {
      toast.success('Thread renamed successfully');
      setIsLoading(false);
      onOpenChange(false);
    } else {
      toast.error('Failed to rename thread');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => { if (!isLoading) onOpenChange(o); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Thread</DialogTitle>
        </DialogHeader>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading && value.trim()) {
              handleRename();
            }
          }}
          placeholder="Enter thread name"
          autoFocus
          disabled={isLoading}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
          <Button type="submit" onClick={handleRename} disabled={isLoading || !value.trim()}>
            {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Renaming...</>) : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} variant="destructive" className='bg-destructive text-destructive-foreground hover:bg-destructive/90' disabled={isLoading}>
            {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Deleting...</>) : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Container component that handles the hooks
export const ChatSidebar = ({ threads }: { threads: Preloaded<typeof api.threads.listThreads> }) => {
    
    return (
        <PureChatSidebar 
            threads={threads}
        />
    );
};

