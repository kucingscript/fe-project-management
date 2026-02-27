import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    throw redirect({
      to: "/login",
      search: {
        redirect: undefined,
      },
    });
  },
  component: App,
});

function App() {
  return;
}
