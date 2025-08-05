import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MemoizedChatSidebar from "@/components/chat/layout/chat-sidebar";
import { ChatHeader } from "@/components/chat/layout/chat-header";
import { ReactNode, Suspense } from 'react';
import { BusinessProvider } from "@/app/providers/business-provider";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { auth } from "@clerk/nextjs/server";




export default async function ChatLayout({ children }: { children: ReactNode }) {

    const { userId } =await auth()
    if (!userId) {
        return <div>User not found</div>
    }

    const businesses = await fetchQuery(api.businesses.getBusinessByClerkUserId, { clerkUserId: userId })

    return (
    <Suspense fallback={<div>Loading...</div>}>
        <BusinessProvider initialBusinesses={businesses}>
            <SidebarProvider>
                <div className="flex h-screen w-full">
                    <MemoizedChatSidebar />
                    <SidebarInset>
                        <ChatHeader />
                        <div className="flex-1 overflow-hidden">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </BusinessProvider>
    </Suspense>
    )
}