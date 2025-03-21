import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { Route, useLocation } from "wouter";
import CosmicLoader from "@/components/cosmic-loader";
import PageTransition from "@/components/page-transition";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const { isGuestMode } = useGuestMode();
  const [location] = useLocation();

  // Show enhanced cosmic loader while auth status is being determined
  if (isLoading) {
    return (
      <Route path={path}>
        <CosmicLoader fullScreen={true} />
      </Route>
    );
  }

  // Wrap the component in PageTransition for smooth transitions
  return (
    <Route path={path}>
      {({ params }) => (
        <PageTransition location={location}>
          <Component {...params} />
        </PageTransition>
      )}
    </Route>
  );
}
