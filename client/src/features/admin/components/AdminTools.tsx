import { Button } from "@/ui/core/Button";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

/**
 * AdminTools component provides administrative tools and controls
 * Only available to users with appropriate permissions
 */
export function AdminControls() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to make the current user an admin
  const makeAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/make-admin");
      
      if (response.ok) {
        // Refresh the page to update the session
        window.location.reload();
        toast({
          title: "Success!",
          description: "You are now an admin user.",
          variant: "default",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Failed to make admin",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to make admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (user?.isAdmin) {
    return (
      <div className="rounded-md bg-slate-50 dark:bg-slate-900 p-4 mb-4">
        <h3 className="text-lg font-medium mb-2">Admin Access</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You already have admin privileges.
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md bg-slate-50 dark:bg-slate-900 p-4 mb-4">
      <h3 className="text-lg font-medium mb-2">Admin Access</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Make yourself an admin to access all premium features.
      </p>
      <Button onClick={makeAdmin} disabled={isLoading}>
        {isLoading ? "Processing..." : "Make Me Admin"}
      </Button>
    </div>
  );
}