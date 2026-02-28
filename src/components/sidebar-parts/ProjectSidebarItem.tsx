import { ChevronRight, Circle, FolderOpen, Pen, Plus } from "lucide-react";
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
  const [selectedPhaseForEdit, setSelectedPhaseForEdit] = useState<Phase | null>(null);

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
  

  const { data: phasesResponse } = useQuery({
    queryKey: ["sidebar-phases", corporateId, project.project_id],
    refetchOnWindowFocus: false,
    queryFn: () =>
      getListPhases(corporateId, project.project_id, { limit: 100 }),
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
                  <SidebarMenuSubItem key={phase.phase_id} className="group/phase-item">
                    <SidebarMenuSubButton asChild>
                      <Link
                        to="/admin/projects"
                        search={{ page: 1, limit: 10 }}
                        onClick={handleLinkClick}
                        className="pr-8" 
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
                    
                    <button
                      onClick={(e) => handleEditClick(e, phase)}
                      className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground group-hover/phase-item:flex transition-colors"
                      title="Edit Phase"
                    >
                      <Pen className="h-3.5 w-3.5" />
                    </button>
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
    </>
  );
};
