import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { isTokenValid } from "@/lib/token";
import { getListCorporates } from "@/services/corporateService";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const { token, logout } = useAuthStore.getState();

    if (!isTokenValid(token)) {
      logout();
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },

  component: RouteComponent,
});

function RouteComponent() {
  const defaultOpen = Cookies.get("sidebar_state") === "true";
  const { user, setUserCorporate } = useAuthStore();

  const { data: corporatesResponse } = useQuery({
    queryKey: ["corporates-for-user", user?.user_id],
    queryFn: () =>
      getListCorporates({
        limit: 1000,
        status: "ACTIVE",
      }),
    enabled: !!user,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: false,
  });

  useEffect(() => {
    if (corporatesResponse?.data) {
      const corporates = corporatesResponse.data;

      setUserCorporate(corporates);
    }
  }, [corporatesResponse, setUserCorporate]);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full">
        <Navbar />
        <div className="px-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
