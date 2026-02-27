import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, TriangleAlert, SearchX } from "lucide-react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import React from "react";

const PageStateLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
    <div className="flex max-w-md flex-col items-center space-y-4">
      {children}
    </div>
  </div>
);

export const CustomPendingComponent = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-background">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

export const CustomNotFoundComponent = () => (
  <PageStateLayout>
    <SearchX className="h-20 w-20 text-muted-foreground" />
    <h1 className="text-6xl font-bold text-primary">404</h1>
    <h2 className="text-3xl font-semibold">Page Not Found</h2>
    <p className="text-muted-foreground">
      Sorry, the page you are looking for doesn't exist or has been moved.
    </p>
    <Button asChild className="mt-4">
      <Link to="/admin" search={{ error: undefined }}>
        Back to Dashboard
      </Link>
    </Button>
  </PageStateLayout>
);

export const CustomErrorComponent = ({ error }: ErrorComponentProps) => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate({ to: "/admin", search: { error: undefined } });
  };

  const reloadPage = () => {
    window.location.reload();
  };

  console.error("Route Error:", error);

  return (
    <PageStateLayout>
      <TriangleAlert className="h-20 w-20 text-destructive" />
      <h1 className="text-3xl font-bold">Something Went Wrong</h1>
      <p className="text-lg text-muted-foreground">
        Sorry, an unexpected error occurred.
      </p>
      {error && (
        <pre className="mt-2 w-full max-w-full overflow-auto rounded-md bg-muted p-4 text-left text-sm text-destructive">
          {(error as Error)?.message || "Unknown error details"}
        </pre>
      )}
      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={reloadPage}>
          Try Again
        </Button>
        <Button onClick={goToHome}>Back to Dashboard</Button>
      </div>
    </PageStateLayout>
  );
};
