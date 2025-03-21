import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { Loader2 } from "lucide-react";
import { Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const { isGuestMode } = useGuestMode();

  // Show loading while auth status is being determined
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </Route>
    );
  }

  // Simply render the component - the GuestModeProvider will handle enabling guest mode
  // automatically based on URL or location
  return <Route path={path} component={Component} />;
}
