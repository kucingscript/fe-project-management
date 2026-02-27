import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "../styles.css";
import {
  CustomErrorComponent,
  CustomPendingComponent,
} from "@/components/CustomRouteState";

export const Route = createRootRoute({
  pendingComponent: CustomPendingComponent,
  errorComponent: CustomErrorComponent,

  component: () => {
    return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Outlet />
        <Toaster />
        {import.meta.env.VITE_ENV === "dev" && (
          <TanStackRouterDevtools
            initialIsOpen={false}
            position="bottom-right"
          />
        )}
      </ThemeProvider>
    );
  },
});
