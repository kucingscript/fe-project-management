import {
  Building2,
  ChevronDown,
  ChevronUp,
  Edit,
  FolderOpen,
  Home,
  LifeBuoy,
  ListChecks,
  MoreHorizontal,
  Plus,
  Projector,
  Search,
  Send,
  Settings,
  User2,
  UserRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { getListProjects } from "@/services/projectService";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    show: true,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: UserRound,
    show: true,
  },
  {
    title: "Corporates",
    url: "/admin/corporates",
    icon: Building2,
    // show: hasPermission(PERMISSIONS.CORPORATE.READ),
    show: true,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
    show: true,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    show: true,
  },
];

const AppSidebar = () => {
  const { user, logout, selectedCorporate } = useAuthStore();
  const navigate = useNavigate({ from: "/admin" });
  const { pathname } = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

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

  const isProjectsActive = pathname.startsWith("/admin/projects");

  const handleLogout = () => {
    logout();
    navigate({ to: "/login", search: { redirect: undefined } });
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/admin">
                <img
                  src="https://github.com/shadcn.png"
                  alt="logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span>ShadCN</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel>Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => item.show)
                .map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                          {
                            "bg-sidebar-primary text-white hover:bg-sidebar-primary hover:text-white hover:opacity-90":
                              isActive,
                          },
                        )}
                      >
                        <Link to={item.url} onClick={handleLinkClick}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.title === "Inbox" && (
                        <SidebarMenuBadge>3</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen={true} className="group/projects">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "transition-colors",
                        isProjectsActive
                          ? "bg-sidebar-primary text-white hover:bg-sidebar-primary hover:text-white hover:opacity-90 data-[state=open]:bg-sidebar-primary data-[state=open]:text-white data-[state=open]:hover:bg-sidebar-primary data-[state=open]:hover:text-white"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <FolderOpen />
                      <span className="font-medium">Projects</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/projects:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {activeProjects.map((project) => (
                        <SidebarMenuSubItem key={project.project_id}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              to="/admin/projects"
                              onClick={handleLinkClick}
                              search={{ page: 1, limit: 10 }}
                            >
                              <ListChecks className="mr-2 h-4 w-4" />
                              <span className="truncate">{project.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to="/admin/projects"
                            search={{ page: 1, limit: 10 }}
                            onClick={handleLinkClick}
                            className="text-muted-foreground"
                          >
                            <MoreHorizontal className="mr-2 h-4 w-4" />
                            <span>View all projects</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Help
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin" onClick={handleLinkClick}>
                        <LifeBuoy /> Support
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin" onClick={handleLinkClick}>
                        <Send /> Feedback
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <SidebarGroup>
          <SidebarGroupLabel>Nested Items</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin" onClick={handleLinkClick}>
                    <Projector /> See all projects
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/admin" onClick={handleLinkClick}>
                        <Plus />
                        Add Project
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/admin" onClick={handleLinkClick}>
                        <Edit />
                        Edit Project
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.name} <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/admin" onClick={handleLinkClick}>
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default memo(AppSidebar);
