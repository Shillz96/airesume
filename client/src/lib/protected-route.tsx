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

  // If the user is not logged in and not in guest mode, redirect to home to login/register
  if (!user && !isGuestMode) {
    // Add ?guest=true parameter to the current URL to enable guest mode
    const currentPath = window.location.pathname;
    const guestUrl = currentPath + '?guest=true';
    
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-black/70 p-8 rounded-lg border border-blue-500/30 max-w-md">
            <h2 className="text-xl font-bold cosmic-text-gradient mb-4">Authentication Required</h2>
            <p className="text-gray-300 mb-4">You need to log in to access this page, or continue as a guest.</p>
            <div className="flex gap-3 flex-wrap">
              <a 
                href="/?login=true" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-center"
              >
                Log In
              </a>
              <a 
                href="/?register=true" 
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded px-4 py-2 text-center"
              >
                Register
              </a>
              <a 
                href={guestUrl} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded px-4 py-2 text-center"
              >
                Continue as Guest
              </a>
            </div>
          </div>
        </div>
      </Route>
    );
  }

  // User is either logged in OR in guest mode, show the component
  return <Route path={path} component={Component} />;
}
