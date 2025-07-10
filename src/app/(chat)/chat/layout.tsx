'use client'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/layout/ChatSidebar";
import { ChatHeader } from "@/components/chat/layout/ChatHeader";
import { ReactNode, useMemo } from 'react';





export default function ChatLayout({ children }: { children: ReactNode }) {

    const clientInfo = useMemo(() => ({
        clientId: '2e225520-6119-4a06-a67a-92e73d34fbff',
        clientName: 'Acme Corp'
    }), []);

    return (
            <SidebarProvider>
                <div className="flex h-screen w-full">
                    <ChatSidebar />
                    <SidebarInset>
                        <ChatHeader 
                            clientId={clientInfo.clientId}
                            clientName={clientInfo.clientName}
                        />
                        <div className="flex-1 overflow-hidden">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
    )
}