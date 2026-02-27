import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate({ from: "/admin" });

  const handleLogout = () => {
    logout();
    navigate({ to: "/login", search: { redirect: undefined } });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
      <p>This is a protected admin page.</p>
      <Button onClick={handleLogout} className="mt-6">
        Logout
      </Button>
    </div>
  );
}
