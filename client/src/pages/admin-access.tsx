import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import CosmicBackground from "@/components/cosmic-background";
import Navbar from "@/components/navbar";
import PageHeader from "@/components/page-header";
import { apiRequest } from "@/lib/queryClient";

export default function AdminAccess() {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);
  
  const makeAdmin = async () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to make admin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/make-admin", { username });
      
      if (response.ok) {
        const result = await response.json();
        setAdminCreated(true);
        toast({
          title: "Success!",
          description: `User "${result.username}" is now an admin user.`,
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
  
  const makeCurrentUserAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/make-admin", {});
      
      if (response.ok) {
        setAdminCreated(true);
        toast({
          title: "Success!",
          description: "Your account is now an admin user.",
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
  
  return (
    <>
      <CosmicBackground />
      <Navbar />
      <div className="container pt-24 pb-10 px-4 md:px-6 max-w-7xl mx-auto min-h-screen relative z-10">
        <PageHeader
          title="Admin Access"
          subtitle="Grant admin privileges to your account"
        />
        
        <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
          <Card className="bg-card/60 backdrop-blur shadow-md">
            <CardHeader>
              <CardTitle>Admin Access Panel</CardTitle>
              <CardDescription>
                Make yourself or any user an admin with full premium features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminCreated ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 rounded-md">
                  <p className="font-medium">Admin Access Granted</p>
                  <p className="text-sm opacity-80 mt-1">Admin privileges have been successfully assigned.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username (Optional)</Label>
                    <Input
                      id="username"
                      placeholder="Enter username or leave blank for current user"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave blank to grant admin access to your current account.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {!adminCreated && (
                <>
                  <Button
                    className="w-full"
                    onClick={makeAdmin}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Make User Admin
                  </Button>
                  
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={makeCurrentUserAdmin}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Make Me Admin
                  </Button>
                </>
              )}
              
              {adminCreated && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = "/"}
                >
                  Go to Dashboard
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}