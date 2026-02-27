import { isTokenValid } from "@/lib/token";
import { useAuthStore } from "@/stores/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const { token } = useAuthStore.getState();

    if (isTokenValid(token)) {
      throw redirect({
        to: "/admin",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
