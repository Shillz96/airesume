import Navbar from "@/components/navbar";
import DashboardStats from "@/components/dashboard-stats";
import RecentActivity from "@/components/recent-activity";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-secondary-900">Welcome back, {user?.username}!</h1>
              <p className="mt-1 text-sm text-secondary-500">
                Here's an overview of your resume and job application progress.
              </p>
            </div>
            
            <DashboardStats />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
