'use client'
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import Link from 'next/link'
import LogOutButton from '../log-out-button'
import { memo } from 'react'
import equal from 'fast-deep-equal'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'
import { Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatSidebarProps {
    threads: Preloaded<typeof api.threads.listThreads>
}

const PureChatSidebar = memo(({ threads }: ChatSidebarProps) => {
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
                            className="flex items-center cursor-pointer hover:bg-copywrit-blue/20 hover:text-copywrit-cream rounded-sm py-2 pl-2 list-none w-full"
                            >
                                <div className="flex items-center w-full">
                                    <Link href={`/chat/${thread._id}`} className="flex-1 min-w-0">
                                        <span className="block text-ellipsis overflow-hidden whitespace-nowrap">
                                            {thread.title.length > 30 ? thread.title.slice(0, 30) + "…" : thread.title}
                                        </span>
                                    </Link>
                                    <div className="flex items-center justify-center">
                                        <Button variant="ghost" size="icon" className='size-8!'>
                                            <Ellipsis />
                                        </Button>
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
        </Sidebar>
    )
}, (prevProps, nextProps) => {
    // Only re-render if threads actually changed (using deep comparison)
    return equal(prevProps.threads, nextProps.threads);
});

PureChatSidebar.displayName = 'PureChatSidebar';

// Container component that handles the hooks
export const ChatSidebar = ({ threads }: { threads: Preloaded<typeof api.threads.listThreads> }) => {
    
    return (
        <PureChatSidebar 
            threads={threads}
        />
    );
};

