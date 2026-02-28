import { Building2, Home, Search, Settings, UserRound } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { memo } from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { WorkspaceProjects } from "./sidebar-parts/WorkSpaceProject";
import { SidebarUserMenu } from "./sidebar-parts/SidebarUserMenu";

const mainNavItems = [
  { title: "Dashboard", url: "/admin", icon: Home, show: true },
  { title: "Users", url: "/admin/users", icon: UserRound, show: true },
  {
    title: "Corporates",
    url: "/admin/corporates",
    icon: Building2,
    show: true,
  },
  { title: "Search", url: "#", icon: Search, show: true },
  { title: "Settings", url: "#", icon: Settings, show: true },
];

const AppSidebar = () => {
  const { pathname } = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
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
                <span className="font-bold">Project Management</span>
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
              {mainNavItems
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
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <WorkspaceProjects />
      </SidebarContent>

      <SidebarUserMenu />
    </Sidebar>
  );
};

export default memo(AppSidebar);
