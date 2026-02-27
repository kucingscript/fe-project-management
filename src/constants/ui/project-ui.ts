import {
  Activity,
  Archive,
  CheckCircle2,
  FileText,
  PauseCircle,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/types/project";
import type { BadgeProps } from "@/components/ui/badge";

export interface ProjectStatusUI {
  variant: BadgeProps["variant"];
  color: string;
  icon: LucideIcon;
  description: string;
}

export interface ProjectTypeUI {
  variant: BadgeProps["variant"];
  color: string;
}

export const PROJECT_STATUS_UI: Record<Project["status"], ProjectStatusUI> = {
  ACTIVE: {
    variant: "primary",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Activity,
    description: "Project is currently active and in progress.",
  },
  COMPLETED: {
    variant: "success",
    color:
      "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: CheckCircle2,
    description: "Project has been successfully completed.",
  },
  ON_HOLD: {
    variant: "warning",
    color:
      "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
    icon: PauseCircle,
    description: "Project is currently on hold and waiting for further action.",
  },
  ARCHIVED: {
    variant: "secondary",
    color: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
    icon: Archive,
    description: "Project has been archived and is no longer active.",
  },
  DRAFT: {
    variant: "secondary",
    color: "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
    icon: FileText,
    description: "Project is currently in draft state.",
  },
};

export const PROJECT_TYPE_UI: Record<Project["project_type"], ProjectTypeUI> = {
  SOFTWARE: {
    variant: "success",
    color:
      "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  CONSTRUCTION: {
    variant: "info",
    color:
      "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  CUSTOM: {
    variant: "warning",
    color:
      "text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400",
  },
};
