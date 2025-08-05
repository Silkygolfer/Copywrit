import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useBusiness } from "@/app/providers/business-provider";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";

interface ViewContextModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type File = {
  _id: Id<"files">;
  fileName: string;
  fileType: string;
  uploadedAt: number;
  fileSize: number;
  businessId: Id<"businesses">;
  clerkUserId: string;
  supermemoryId: string;
};

export const ViewContextModal = ({
  isOpen,
  onOpenChange,
}: ViewContextModalProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { businessId } = useBusiness();
  const deleteFile = useMutation(api.files.deleteFile);

  const files = useQuery(api.files.listFiles, {
    businessId: businessId,
  });

  // Stable fallback data to prevent infinite re-renders
  const fallbackData: File[] = [];

  // Memoize the data array to prevent infinite re-renders
  const stableData = useMemo(() => files ?? [], [files]);

  const columns = useMemo<ColumnDef<File>[]>(() => [
    {
      accessorKey: "fileName",
      header: "File Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("fileName")}</div>
      ),
    },
    {
      accessorKey: "fileType",
      header: "File Type",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("fileType")}
        </div>
      ),
    },
    {
      accessorKey: "uploadedAt",
      header: "Uploaded At",
      cell: ({ row }) => {
        const timestamp = row.getValue("uploadedAt") as number;
        const date = new Date(timestamp);
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const file = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              deleteFile({ fileId: file._id });
              console.log("delete file", file._id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ], [deleteFile]);

  const table = useReactTable({
    data: stableData ?? fallbackData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl">
        <DialogHeader>
          <DialogTitle>Context</DialogTitle>
        </DialogHeader>
        <VisuallyHidden asChild>
          <DialogDescription>
            Context is a collection of files that are used to generate a
            response.
          </DialogDescription>
        </VisuallyHidden>
        <div className="rounded-md border">
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No files found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
