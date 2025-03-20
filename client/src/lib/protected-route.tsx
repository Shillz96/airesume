import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useEffect } from "react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const { isGuestMode } = useGuestMode();

  // If not logged in, enable guest mode via URL parameter
  useEffect(() => {
    if (!user && !isGuestMode && !isLoading) {
      // Only modify the URL if we're not already on the auth page
      if (!window.location.pathname.includes('/auth')) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('guest', 'true');
        window.history.replaceState({}, '', currentUrl.toString());
        // Force a page reload to apply the guest mode
        window.location.reload();
      }
    }
  }, [user, isGuestMode, isLoading]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // If the user is not logged in and not in guest mode, redirect to auth
  if (!user && !isGuestMode) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // User is either logged in OR in guest mode, show the component
  return <Route path={path} component={Component} />;
}
