import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Activity,
  ChevronRight,
  CreditCard,
  Loader2,
  Users,
  FileText,
  Briefcase,
  LineChart,
  Settings,
  User,
  ShieldCheck
} from "lucide-react";


import PageHeader from "@/features/layout/components/PageHeader";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";

export default function AdminAccess() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch stats
  const { data: userCount } = useQuery({
    queryKey: ['/api/admin/stats/users'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/admin/stats/users');
        if (!res.ok) return { count: 0 };
        return await res.json();
      } catch (error) {
        return { count: 0 };
      }
    },
    initialData: { count: 0 }
  });
  
  const { data: resumeCount } = useQuery({
    queryKey: ['/api/admin/stats/resumes'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/admin/stats/resumes');
        if (!res.ok) return { count: 0 };
        return await res.json();
      } catch (error) {
        return { count: 0 };
      }
    },
    initialData: { count: 0 }
  });
  
  const { data: jobCount } = useQuery({
    queryKey: ['/api/admin/stats/jobs'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/admin/stats/jobs');
        if (!res.ok) return { count: 0 };
        return await res.json();
      } catch (error) {
        return { count: 0 };
      }
    },
    initialData: { count: 0 }
  });
  
  const { data: subscriptionCount } = useQuery({
    queryKey: ['/api/admin/stats/subscriptions'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/admin/stats/subscriptions');
        if (!res.ok) return { count: 0 };
        return await res.json();
      } catch (error) {
        return { count: 0 };
      }
    },
    initialData: { count: 0 }
  });
  
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
  
  // Generate sample stat tiles for the admin dashboard
  const StatCard = ({ icon: Icon, title, value, color }: { icon: any, title: string, value: number | string, color: string }) => (
    <Card className="bg-card/60 backdrop-blur shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  if (!user) {
    return (
      <>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to access this page.</p>
            <Button onClick={() => window.location.href = "/"}>Go to Home</Button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage your application and users"
        />
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full md:w-fit grid-cols-4 md:grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="no-blur">Dashboard</TabsTrigger>
            <TabsTrigger value="users" className="no-blur">Users</TabsTrigger>
            <TabsTrigger value="jobs" className="no-blur">Jobs</TabsTrigger>
            <TabsTrigger value="subscriptions" className="no-blur">Subscriptions</TabsTrigger>
            <TabsTrigger value="reports" className="hidden md:inline-flex no-blur">Reports</TabsTrigger>
            <TabsTrigger value="settings" className="hidden md:inline-flex no-blur">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                icon={Users} 
                title="Total Users" 
                value={userCount.count}
                color="bg-blue-500/20 text-blue-500"
              />
              <StatCard 
                icon={FileText} 
                title="Resumes Created" 
                value={resumeCount.count}
                color="bg-green-500/20 text-green-500"
              />
              <StatCard 
                icon={Briefcase} 
                title="Job Listings" 
                value={jobCount.count}
                color="bg-amber-500/20 text-amber-500"
              />
              <StatCard 
                icon={CreditCard} 
                title="Active Subscriptions" 
                value={subscriptionCount.count}
                color="bg-purple-500/20 text-purple-500"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-card/60 backdrop-blur shadow-md lg:col-span-2">
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>Recent activity across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                    <Activity className="h-8 w-8 mb-2" />
                    <p>Activity data visualization would go here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/60 backdrop-blur shadow-md">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-between">
                    Manage Users <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    View Reports <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Manage Subscriptions <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card className="bg-card/60 backdrop-blur shadow-md mb-6">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and grant admin privileges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <div className="flex gap-2">
                    <Input
                      id="admin-username"
                      placeholder="Enter username to grant admin access"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={makeAdmin}
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Make Admin
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This will grant admin privileges to the specified user.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur shadow-md">
              <CardHeader>
                <CardTitle>Users List</CardTitle>
                <CardDescription>Registered users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                  <User className="h-8 w-8 mb-2" />
                  <p>User list would be displayed here</p>
                  <p className="text-sm mt-1">Table with pagination and search functionality</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card className="bg-card/60 backdrop-blur shadow-md">
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>Manage and monitor job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                  <Briefcase className="h-8 w-8 mb-2" />
                  <p>Job listings management would be displayed here</p>
                  <p className="text-sm mt-1">Including filtering, statistics, and matching algorithms</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscriptions">
            <Card className="bg-card/60 backdrop-blur shadow-md">
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>Manage subscription plans and user subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                  <CreditCard className="h-8 w-8 mb-2" />
                  <p>Subscription management interface would be displayed here</p>
                  <p className="text-sm mt-1">Including plans, payments, and user subscription status</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card className="bg-card/60 backdrop-blur shadow-md">
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Platform performance and user engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                  <LineChart className="h-8 w-8 mb-2" />
                  <p>Analytics and reporting dashboard would be displayed here</p>
                  <p className="text-sm mt-1">Including charts, trends, and downloadable reports</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-card/60 backdrop-blur shadow-md">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                  <Settings className="h-8 w-8 mb-2" />
                  <p>System configuration options would be displayed here</p>
                  <p className="text-sm mt-1">Including API keys, email settings, and platform customization</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}