import { CopyPlus, FileText, MoreHorizontal, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { getListProjects } from "@/services/projectService";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ProjectSidebarItem } from "./ProjectSidebarItem";
import { useState } from "react";
import CreateProjectModal from "../modal/project/create";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const WorkspaceProjects = () => {
  const { selectedCorporate } = useAuthStore();
  const { isMobile, setOpenMobile } = useSidebar();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const { data: projectsResponse } = useQuery({
    queryKey: ["sidebar-projects", selectedCorporate],
    refetchOnWindowFocus: false,
    queryFn: () =>
      getListProjects({
        corporate_id: selectedCorporate!,
        limit: 5,
        status: "ACTIVE",
      }),
    enabled: !!selectedCorporate,
  });

  const activeProjects = projectsResponse?.data || [];

  if (!selectedCorporate) return null;

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarGroupAction title="Add Project">
              <Plus /> <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setIsCreateModalOpen(true)}>
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              Blank Project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Open Template Modal")}
            >
              <CopyPlus className="mr-2 h-4 w-4 text-muted-foreground" />
              From Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SidebarGroupContent>
          <SidebarMenu>
            {activeProjects.map((project) => (
              <ProjectSidebarItem
                key={project.project_id}
                project={project}
                corporateId={selectedCorporate}
              />
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="/admin/projects"
                  search={{ page: 1, limit: 10 }}
                  onClick={handleLinkClick}
                  className="text-muted-foreground"
                >
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  <span>View all projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
};
