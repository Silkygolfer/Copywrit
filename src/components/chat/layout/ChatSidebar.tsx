import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import Link from 'next/link'
import LogOutButton from '../LogOutButton'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { memo, useMemo } from 'react'
import equal from 'fast-deep-equal'

interface ChatSidebarProps {
    threads?: any[];
}

const PureChatSidebar = memo(({ threads }: ChatSidebarProps) => {
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
                        {threads?.map((thread) => (
                            <SidebarMenuButton
                            asChild
                            key={thread.threadId}
                            className='cursor-pointer hover:bg-copywrit-blue/20 hover:text-copywrit-cream rounded-md p-2 list-none'>
                                <Link href={`/chat/${thread.threadId}`}>{thread.title}</Link>
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
export const ChatSidebar = () => {
    const { user } = useUser();
    
    // Memoize the clerkUserId to prevent unnecessary query re-executions
    const clerkUserId = useMemo(() => user?.id || "skip", [user?.id]);
    
    const threads = useQuery(api.threads.getThreads, { clerkUserId });
    
    return (
        <PureChatSidebar 
            threads={threads}
        />
    );
};

