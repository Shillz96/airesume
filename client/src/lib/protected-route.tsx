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

  // Check URL for guest parameter without modifying it
  useEffect(() => {
    if (!user && !isGuestMode && !isLoading) {
      // Only check if we're not already on the auth page
      if (!window.location.pathname.includes('/auth')) {
        // Check if we have the guest parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const hasGuestParam = urlParams.has('guest');
        
        // If no guest parameter exists, add it without reloading
        if (!hasGuestParam) {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('guest', 'true');
          window.history.replaceState({}, '', currentUrl.toString());
          // No page reload needed - the useGuestMode hook will handle this parameter change
        }
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
