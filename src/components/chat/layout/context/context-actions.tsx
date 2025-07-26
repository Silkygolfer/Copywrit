'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Files } from "lucide-react"
import ContextUploadButton from "./context-upload-button"
import { useFileUpload } from "@/hooks/use-file-upload"
import { ViewContextModal } from "./view-context-modal"
import { useState } from "react"
import { useBusiness } from "@/hooks/use-business"

export const ContextActionsDropdown = () => {

    const { business } = useBusiness();

    const { openFilePicker, isUploading } = useFileUpload({ 
        businessId: business?._id || "", 
        businessName: business?.businessName || "" 
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