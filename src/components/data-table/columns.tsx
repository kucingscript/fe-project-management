import type { Corporate } from "@/types/corporate";
import type { ColumnDef } from "@tanstack/react-table";
import {
  createActionsColumn,
  createNoColumn,
  createStatusColumn,
  getProjectStatus,
  getProjectTypeVariant,
} from "./column-helpers";
import type { User } from "@/types/user";
import type { Project } from "@/types/project";
import Badge from "../ui/badge";
import { formatDate } from "@/lib/utils";

export const corporateColumns: ColumnDef<Corporate>[] = [
  createNoColumn<Corporate>(),
  { accessorKey: "corporate_code", header: "Code" },
  { accessorKey: "corporate_name", header: "Name" },
  createStatusColumn<Corporate>("corporate_status"),
  createActionsColumn<Corporate>(),
];

export const userColumns: ColumnDef<User>[] = [
  createNoColumn<User>(),
  {
    accessorKey: "user_name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span
          className="font-medium truncate max-w-50"
          title={row.original.user_name}
        >
          {row.original.user_name}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {row.original.user_email}
        </span>
      </div>
    ),
  },
  { accessorKey: "user_phone", header: "Name" },
  {
    accessorKey: "role_name",
    header: "Role",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span
          className="font-medium truncate max-w-50"
          title={row.original.role_name}
        >
          {row.original.role_name}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {row.original.role_scope}
        </span>
      </div>
    ),
  },
  createStatusColumn<User>("user_status"),
];

export const projectColumns: ColumnDef<Project>[] = [
  createNoColumn<Project>(),
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span
          className="font-medium truncate max-w-50"
          title={row.original.name}
        >
          {row.original.name}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {row.original.project_code}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "project_type",
    header: "Type",
    cell: ({ row }) => {
      const pt = row.original.project_type;
      return <Badge variant={getProjectTypeVariant(pt)}>{pt}</Badge>;
    },
  },
  {
    id: "timeline",
    header: "Timeline",
    cell: ({ row }) => {
      const start = row.original.start_date;
      const end = row.original.end_date;

      return (
        <div className="flex flex-col whitespace-nowrap">
          <span className="text-sm font-medium">
            {start ? formatDate(start) : "-"}
          </span>
          <span className="text-xs text-muted-foreground">
            {end ? formatDate(end) : "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "progress_percentage",
    header: "Progress",
    cell: ({ row }) => {
      const progress = row.original.progress_percentage || 0;

      return (
        <div className="flex flex-col gap-1.5 w-25">
          <span className="text-xs font-medium text-right">{progress}%</span>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={getProjectStatus(status)}>{status}</Badge>;
    },
  },
  createActionsColumn<Project>(),
];
