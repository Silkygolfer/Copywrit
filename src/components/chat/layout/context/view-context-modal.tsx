import { Files, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useBusinessContext } from "@/app/providers/business-provider";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ViewContextModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewContextModal = ({
  isOpen,
  onOpenChange,
}: ViewContextModalProps) => {

  const { businessId } = useBusinessContext();
  const deleteFile = useMutation(api.files.deleteFile);

  const files = useQuery(api.files.listFiles, {
    businessId: businessId,
  })

  const columns = [
    {
      header: "File Name",
      accessorKey: "fileName",
    },
    {
      header: "File Type",
      accessorKey: "fileType",
    },
    {
      header: "Uploaded At",
      accessorKey: "uploadedAt",
    },
    {
      header: "Actions",
      cell: ({ row }: { row: Row<Doc<"files">> }) => {
        return (
          <Button variant="outline" onClick={() => {
            deleteFile({ fileId: row.original._id })
          }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: files ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
