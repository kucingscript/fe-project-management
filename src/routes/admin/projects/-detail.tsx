import Badge from "@/components/ui/badge";
import { PROJECT_STATUS_UI, PROJECT_TYPE_UI } from "@/constants/ui/project-ui";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/project";
import {
  AlignLeft,
  Briefcase,
  Calendar,
  CalendarDays,
  FolderOpen,
  Hash,
  Percent,
} from "lucide-react";

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const statusConfig =
    PROJECT_STATUS_UI[project.status] || PROJECT_STATUS_UI["DRAFT"];
  const typeConfig =
    PROJECT_TYPE_UI[project.project_type] || PROJECT_TYPE_UI["CUSTOM"];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-5 pb-2">
        <div className="h-20 w-20 flex items-center justify-center rounded-full border-4 border-background shadow-sm ring-2 ring-muted bg-slate-50 dark:bg-slate-900">
          <FolderOpen className="w-8 h-8 text-slate-600 dark:text-slate-400" />
        </div>

        <div className="text-center sm:text-left space-y-1 flex-1">
          <h3 className="text-xl font-semibold text-foreground tracking-tight">
            {project.name}
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-mono bg-muted px-2 py-0.5 rounded text-xs">
              <Hash className="w-3 h-3" />
              {project.project_code}
            </span>
          </div>
        </div>

        <div className="mt-2 sm:mt-0">
          <Badge
            variant={statusConfig.variant}
            className="px-3 py-1 text-sm uppercase"
          >
            {project.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors flex items-center gap-3">
          <div className={`p-2 rounded-md ${typeConfig.color}`}>
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">
              Project Type
            </p>
            <p className="text-sm font-medium">{project.project_type || "-"}</p>
          </div>
        </div>

        <div className="p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors flex items-center gap-3">
          <div className="p-2 rounded-md bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
            <Percent className="w-4 h-4" />
          </div>
          <div className="w-full pr-4">
            <p className="text-xs font-medium text-muted-foreground mb-0.5">
              Progress
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${project.progress_percentage || 0}%` }}
                />
              </div>
              <p className="text-sm font-medium w-8 text-right">
                {project.progress_percentage || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors flex items-center gap-3">
          <div className="p-2 rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">
              Start Date
            </p>
            <p className="text-sm font-medium">
              {project.start_date
                ? formatDate(new Date(project.start_date))
                : "-"}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors flex items-center gap-3">
          <div className="p-2 rounded-md bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">
              End Date
            </p>
            <p className="text-sm font-medium">
              {project.end_date ? formatDate(new Date(project.end_date)) : "-"}
            </p>
          </div>
        </div>
      </div>

      {project.description && (
        <div className="p-4 rounded-lg border bg-card flex items-start gap-3">
          <div className="p-2 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 mt-0.5">
            <AlignLeft className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Description</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg bg-muted/50 border border-dashed flex items-start gap-3">
        <div className={`p-2 rounded-md ${statusConfig.color}`}>
          <StatusIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium">Project Status</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {statusConfig.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
