import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Edit3, Trash2 } from "lucide-react";

interface ThreadMenuProps {
  onRename: () => void;
  onDelete: () => void;
}

export const ThreadMenu = ({ onRename, onDelete }: ThreadMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onRename}>
          <Edit3 className="h-4 w-4" />
          Rename
        </DropdownMenuItem>
        {/* Add more menu items as needed */}
        <DropdownMenuItem onClick={onDelete} variant="destructive">
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};