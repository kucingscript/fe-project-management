import {
  ChevronRight,
  Circle,
  FolderOpen,
  ListTodo,
  MoreHorizontal,
  Pen,
  Plus,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { getListPhases } from "@/services/phaseService";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Project } from "@/types/project";
import type { Phase } from "@/types/phase";
import { useState } from "react";
import CreatePhaseModal from "../modal/phase/create";
import EditPhaseModal from "../modal/phase/update";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CreateTaskGroupModal from "../modal/task-group/create";

const getPhaseStatusColor = (status: Phase["status"]) => {
  switch (status) {
    case "COMPLETED":
      return "text-emerald-500 fill-emerald-500";
    case "IN_PROGRESS":
      return "text-blue-500 fill-blue-500";
    case "NOT_STARTED":
      return "text-slate-400 fill-slate-400 dark:text-slate-500 dark:fill-slate-500";
    default:
      return "text-slate-400 fill-slate-400";
  }
};

interface ProjectSidebarItemProps {
  project: Project;
  corporateId: string;
}

export const ProjectSidebarItem = ({
  project,
  corporateId,
}: ProjectSidebarItemProps) => {
  const { isMobile, setOpenMobile } = useSidebar();

  const [isCreatePhaseOpen, setIsCreatePhaseOpen] = useState(false);

  const [isEditPhaseOpen, setIsEditPhaseOpen] = useState(false);
  const [selectedPhaseForEdit, setSelectedPhaseForEdit] =
    useState<Phase | null>(null);

  const [isCreateTaskGroupOpen, setIsCreateTaskGroupOpen] = useState(false);
  const [selectedPhaseForTaskGroup, setSelectedPhaseForTaskGroup] =
    useState<Phase | null>(null);

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCreatePhaseOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, phase: Phase) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPhaseForEdit(phase);
    setIsEditPhaseOpen(true);
  };

  const handleCreateTaskGroupClick = (e: React.MouseEvent, phase: Phase) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPhaseForTaskGroup(phase);
    setIsCreateTaskGroupOpen(true);
  };

  const { data: phasesResponse } = useQuery({
    queryKey: ["sidebar-phases", corporateId, project.project_id],
    refetchOnWindowFocus: false,
    queryFn: () => getListPhases(corporateId, project.project_id, { limit: 5 }),
    enabled: !!corporateId && !!project.project_id,
  });

  const phases = phasesResponse?.data || [];

  return (
    <>
      <Collapsible className="group/project">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={project.name}>
              <ChevronRight className="transition-transform group-data-[state=open]/project:rotate-90" />

              <FolderOpen />
              <span className="truncate">{project.name}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <SidebarMenuAction
            showOnHover
            onClick={(e) => handleCreateClick(e)}
            title="Create Phase"
          >
            <Plus />
            <span className="sr-only">Create Phase</span>
          </SidebarMenuAction>

          <CollapsibleContent>
            <SidebarMenuSub className="mr-0 pr-0">
              {phases.length > 0 ? (
                phases.map((phase) => (
                  <SidebarMenuSubItem
                    key={phase.phase_id}
                    className="group/phase-item"
                  >
                    <SidebarMenuSubButton asChild>
                      <Link
                        to="/admin/projects/$projectId/phases/$phaseId"
                        params={{
                          projectId: project.project_id,
                          phaseId: phase.phase_id,
                        }}
                        onClick={handleLinkClick}
                        className="pr-8 transition-colors"
                        activeProps={{
                          className:
                            "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                        }}
                      >
                        <Circle
                          className={cn(
                            "h-2 w-2 shrink-0",
                            getPhaseStatusColor(phase.status),
                          )}
                        />
                        <span className="truncate">{phase.name}</span>
                      </Link>
                    </SidebarMenuSubButton>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground opacity-0 group-hover/phase-item:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                          title="Options"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e) => handleEditClick(e, phase)}
                        >
                          <Pen className="mr-2 h-4 w-4 text-muted-foreground" />
                          Edit Phase
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleCreateTaskGroupClick(e, phase)}
                        >
                          <ListTodo className="mr-2 h-4 w-4 text-muted-foreground" />
                          Create Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuSubItem>
                ))
              ) : (
                <SidebarMenuSubItem>
                  <div className="text-xs text-muted-foreground px-2 py-1.5">
                    No phases
                  </div>
                </SidebarMenuSubItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>

      <CreatePhaseModal
        isOpen={isCreatePhaseOpen}
        onOpenChange={setIsCreatePhaseOpen}
        projectId={project.project_id}
      />

      <EditPhaseModal
        isOpen={isEditPhaseOpen}
        onOpenChange={setIsEditPhaseOpen}
        projectId={project.project_id}
        phaseToEdit={selectedPhaseForEdit}
      />

      <CreateTaskGroupModal
        isOpen={isCreateTaskGroupOpen}
        onOpenChange={setIsCreateTaskGroupOpen}
        projectId={project.project_id}
        defaultPhaseId={selectedPhaseForTaskGroup?.phase_id}
      />
    </>
  );
};
