'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Files, Loader2, Upload } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { ViewContextModal } from "./view-context-modal"
import { useState } from "react"
import { useBusiness } from "@/app/providers/business-provider"

export const ContextActionsDropdown = () => {

    const { businessId } = useBusiness();

    const { openFilePicker, isUploading } = useFileUpload({ 
        businessId: businessId,
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
                        {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        <span>{isUploading ? 'Uploading...' : 'Add Context'}</span>
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