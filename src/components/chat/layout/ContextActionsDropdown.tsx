import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, MoreVertical, Upload, Files } from "lucide-react"
import ContextUploadButton from "./ContextUploadButton"
import { useFileUpload } from "@/hooks/useFileUpload"
import { ViewContextModal } from "./ViewContextModal"
import { useState } from "react"

interface ContextActionsDropdownProps {
    clientId: string;
    clientName: string;
}

export const ContextActionsDropdown = ({ clientId, clientName }: ContextActionsDropdownProps) => {

    const { openFilePicker, isUploading } = useFileUpload({ 
        clientId, 
        clientName 
    });

    const [isOpenContextModal, setOpenContextModal] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                    className="bg-none! bg-copywrit-blue/20 hover:bg-copywrit-blue/30 border border-copywrit-cream/20 hover:border-copywrit-cream/40 text-copywrit-cream w-[200px]"
                    >   <span className="text-copywrit-cream">Context</span>
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                    <DropdownMenuItem onClick={openFilePicker} disabled={isUploading}>
                        <ContextUploadButton openFilePicker={openFilePicker} isUploading={isUploading} />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenContextModal(true)}>
                        <Files className="w-4 h-4 mr-2" />
                        <span>View Context</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <ViewContextModal 
                isOpen={isOpenContextModal} 
                onOpenChange={setOpenContextModal}
            />
        </>
    )
}