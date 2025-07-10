import { SidebarTrigger } from "@/components/ui/sidebar"
import { ClientActionsDropdown } from "@/components/chat/layout/ClientActionsDropdown";
import { ContextActionsDropdown } from "@/components/chat/layout/ContextActionsDropdown";

interface ChatHeaderProps {
    clientId?: string;
    clientName?: string;
}

export const ChatHeader = ({ clientId = "default-client", clientName = "Default Client" }: ChatHeaderProps) => {
    

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-copywrit-navy border-b border-copywrit-cream/20">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex items-center p-2">
                <ClientActionsDropdown />
            </div>
            <div className="flex items-center p-2">
                <div className="flex items-center gap-2">
                    <ContextActionsDropdown clientId={clientId} clientName={clientName} />
                </div>
            </div>
        </header>
        
    )
}