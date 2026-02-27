import type { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./table-row-actions";
import { formatDate, formatToIDR } from "@/lib/utils";
import Badge, { type BadgeProps } from "../ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { Project } from "@/types/project";
import { PROJECT_STATUS_UI, PROJECT_TYPE_UI } from "@/constants/ui/project-ui";

export const createNoColumn = <T,>(): ColumnDef<T> => ({
  header: "No",
  id: "row_number",
  cell: ({ row, table }) => {
    const { pageIndex, pageSize } = table.getState().pagination;
    return pageIndex * pageSize + row.index + 1;
  },
});

export const createActionsColumn = <T,>(): ColumnDef<T> => ({
  header: "Actions",
  id: "actions",
  cell: ({ row }) => <DataTableRowActions row={row} />,
});

const statusVariantMap: Record<
  string,
  "primary" | "secondary" | "destructive" | "default"
> = {
  ACTIVE: "primary",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
};

export const createStatusColumn = <T extends Record<string, any>>(
  accessorKey: keyof T,
  header: string = "Status",
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header,
  cell: ({ row }) => {
    const status = row.original[accessorKey];

    if (typeof status !== "string") return null;
    const variant = statusVariantMap[status.toUpperCase()] || "default";

    return <Badge variant={variant}>{status}</Badge>;
  },
});

export const createCurrencyColumn = <T extends { [key: string]: any }>(
  accessorKey: keyof T,
  header: string,
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header,
  cell: ({ row }) => formatToIDR(row.original[accessorKey] as number),
});

export const createDateColumn = <T extends { [key: string]: any }>(
  accessorKey: keyof T,
  header: string,
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header,
  cell: ({ row }) =>
    row.original[accessorKey]
      ? formatDate(new Date(row.original[accessorKey]))
      : "-",
});

export const HeaderWithTooltip = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-1.5 group select-none">
      <span className="text-sm font-medium transition-colors duration-300 group-hover:text-primary">
        {title}
      </span>
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div className="p-0.5 rounded-md transition-colors duration-300 hover:bg-primary/5 cursor-help">
              <Info className="w-3.5 h-3.5 transition-colors duration-300 group-hover:text-primary/70" />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="z-50 w-fit max-w-50 px-3 py-2 text-[0.75rem] font-medium leading-relaxed bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-lg text-zinc-700 dark:text-zinc-300 animate-in fade-in-0 zoom-in-95"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-white dark:fill-zinc-900 border-none" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

// BADGE COLOR

export const getProjectTypeVariant = (
  p: Project["project_type"],
): BadgeProps["variant"] => {
  return PROJECT_TYPE_UI[p]?.variant || "default";
};

export const getProjectStatus = (
  p: Project["status"],
): BadgeProps["variant"] => {
  return PROJECT_STATUS_UI[p]?.variant || "default";
};
