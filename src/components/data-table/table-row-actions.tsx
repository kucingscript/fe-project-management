import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pen, UsersRound } from "lucide-react";
import type { Row } from "@tanstack/react-table";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onDetailClick?: () => void;
  onEditClick?: () => void;
  onAssignClick?: () => void;
}

export function DataTableRowActions<TData>({
  row,
  onDetailClick,
  onEditClick,
  onAssignClick,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {onDetailClick && (
          <DropdownMenuItem onClick={onDetailClick}>
            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Detail
          </DropdownMenuItem>
        )}
        {onEditClick && (
          <DropdownMenuItem onClick={onEditClick}>
            <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>
        )}
        {onAssignClick && (
          <DropdownMenuItem onClick={onAssignClick}>
            <UsersRound className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Assign Users
          </DropdownMenuItem>
        )}
        {/* <DropdownMenuItem>
          <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Delete
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
