import { Files } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ViewContextModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ViewContextModal = ({ isOpen, onOpenChange }: ViewContextModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Context</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Context is a collection of files that are used to generate a response.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}