import React from 'react';
import { Link, useLocation } from 'wouter';
import { FileText, Briefcase, CheckSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

interface StatsCardProps {
  icon: React.ReactNode;
  glowColor: string;
  title: string;
  value: number | string;
  linkText: string;
  linkUrl: string;
  index: number;
}

function StatsCard({
  icon,
  glowColor,
  title,
  value,
  linkText,
  linkUrl,
  index
}: StatsCardProps) {
  return (
    <Card 
      className={cn(
        "solid-card h-full flex flex-col justify-between",
        "transition-all duration-300 hover:scale-[1.03]",
        "shadow-lg"
      )}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className={cn(
            "p-3 rounded-lg mb-3",
            glowColor === 'blue' && "bg-blue-500/20 text-blue-500",
            glowColor === 'green' && "bg-green-500/20 text-green-500",
            glowColor === 'purple' && "bg-purple-500/20 text-purple-500",
          )}>
            {icon}
          </div>
          <div className={cn(
            "text-xs font-medium rounded-full px-2 py-0.5 no-blur",
            glowColor === 'blue' && "bg-blue-500/20 text-blue-500",
            glowColor === 'green' && "bg-green-500/20 text-green-500",
            glowColor === 'purple' && "bg-purple-500/20 text-purple-500",
          )}>
            Last 30 days
          </div>
        </div>

        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent no-blur">{value}</h3>
        <p className="text-sm text-muted-foreground mt-1 no-blur">{title}</p>
      </CardContent>

      <CardFooter className="px-5 py-3 border-t border-white/10 dark:border-gray-700/30">
        <Link href={linkUrl} className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors no-blur">
          {linkText}
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function DashboardStats() {
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    staleTime: 60000, // 1 minute
  });

  interface DashboardStats {
    activeResumes: number;
    jobMatches: number;
    submittedApplications: number;
  }

  // Default values if data is not loaded yet
  const stats: DashboardStats = dashboardStats as DashboardStats || {
    activeResumes: 0,
    jobMatches: 0,
    submittedApplications: 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        icon={<FileText className="h-5 w-5" />}
        glowColor="purple"
        title="Active Resumes"
        value={stats.activeResumes}
        linkText="Manage Resumes"
        linkUrl="/resumes"
        index={0}
      />
      
      <StatsCard
        icon={<Briefcase className="h-5 w-5" />}
        glowColor="blue"
        title="Job Matches"
        value={stats.jobMatches}
        linkText="View Matches"
        linkUrl="/jobs"
        index={1}
      />
      
      <StatsCard
        icon={<CheckSquare className="h-5 w-5" />}
        glowColor="green"
        title="Applications Submitted"
        value={stats.submittedApplications}
        linkText="Track Applications"
        linkUrl="/applications"
        index={2}
      />
    </div>
  );
}