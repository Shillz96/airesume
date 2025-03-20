import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { FileText, Briefcase, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: number | string;
  linkText: string;
  linkUrl: string;
}

function StatsCard({
  icon,
  iconBgColor,
  iconColor,
  title,
  value,
  linkText,
  linkUrl,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-secondary-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-secondary-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkUrl} className="font-medium text-primary-700 hover:text-primary-900">
            {linkText} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function DashboardStats() {
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: false,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="ml-5 w-0 flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-10" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-secondary-50 px-5 py-3">
              <Skeleton className="h-4 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const stats = dashboardStats || {
    activeResumes: 0,
    jobMatches: 0,
    submittedApplications: 0
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        icon={<FileText className="text-primary-600" />}
        iconBgColor="bg-primary-100"
        iconColor="text-primary-600"
        title="Active Resumes"
        value={stats.activeResumes}
        linkText="Create new resume"
        linkUrl="/resume-builder"
      />

      <StatsCard
        icon={<Briefcase className="text-accent-600" />}
        iconBgColor="bg-accent-100"
        iconColor="text-accent-600"
        title="Job Matches"
        value={stats.jobMatches}
        linkText="View matches"
        linkUrl="/job-finder"
      />

      <StatsCard
        icon={<CheckCircle className="text-green-600" />}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        title="Applications Submitted"
        value={stats.submittedApplications}
        linkText="View applications"
        linkUrl="/applications"
      />
    </div>
  );
}
