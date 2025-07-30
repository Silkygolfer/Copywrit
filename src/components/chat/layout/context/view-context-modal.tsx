import { Files, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useBusiness } from "@/app/providers/business-provider";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ViewContextModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewContextModal = ({
  isOpen,
  onOpenChange,
}: ViewContextModalProps) => {

  const { businessId } = useBusiness();
  const deleteFile = useMutation(api.files.deleteFile);

  const files = useQuery(api.files.listFiles, {
    businessId: businessId,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Context</DialogTitle>
        </DialogHeader>
        <VisuallyHidden asChild>
        <DialogDescription>
          Context is a collection of files that are used to generate a response.
        </DialogDescription>
        </VisuallyHidden>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>File Type</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files?.map((file) => (
              <TableRow key={file._id}>
                <TableCell>{file.fileName}</TableCell>
                <TableCell>{file.fileType}</TableCell>
                <TableCell>{file.uploadedAt}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => {
                    deleteFile({ fileId: file._id })
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
