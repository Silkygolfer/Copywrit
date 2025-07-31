'use client'
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import Link from 'next/link'
import LogOutButton from '../log-out-button'
import { memo, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'
import { ThreadMenu } from './thread-menu'
import { RenameDialog } from './rename-dialog'
import { DeleteDialog } from './delete-dialog'
import { useBusiness } from '@/app/providers/business-provider'

export const ChatSidebar = memo(() => {
    // state
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [currentThread, setCurrentThread] = useState<Doc<'threads'> | null>(null);

    const { businessId } = useBusiness();

    const threadsData = useQuery(api.threads.listThreads, businessId ? { businessId } : "skip");
    
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
});

