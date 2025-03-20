import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { FileText, Briefcase, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import gsap from "gsap";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate card entry
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { 
          y: 30, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          delay: 0.1 * index,
          ease: "power2.out" 
        }
      );
    }
    
    // Animate count up
    if (valueRef.current && typeof value === 'number') {
      gsap.fromTo(
        valueRef.current,
        { textContent: 0 },
        { 
          textContent: value,
          duration: 1.5,
          delay: 0.3 + (0.1 * index),
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: () => {
            if (valueRef.current) {
              valueRef.current.textContent = valueRef.current.textContent;
            }
          }
        }
      );
    }
  }, [value, index]);
  
  return (
    <Card className="cosmic-card relative overflow-hidden" ref={cardRef}>
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ 
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)` 
        }}
      ></div>
      
      <CardContent className="p-5 z-10 relative">
        <div className="flex items-center">
          <div 
            className="flex-shrink-0 rounded-full p-3 cosmic-glow" 
            style={{ 
              background: `rgba(255, 255, 255, 0.1)`,
              boxShadow: `0 0 15px ${glowColor}`
            }}
          >
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-300 truncate">{title}</dt>
              <dd>
                <div className="text-2xl font-bold text-white" ref={valueRef}>
                  {typeof value === 'number' ? '0' : value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-white/5 px-5 py-3 border-t border-white/10 z-10 relative">
        <div className="text-sm">
          <Link 
            href={linkUrl} 
            className="font-medium text-blue-400 hover:text-blue-300 flex items-center transition-colors"
          >
            {linkText} 
            <ExternalLink className="ml-1 h-3 w-3" />
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="cosmic-card">
            <CardContent className="p-5">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                <div className="ml-5 w-0 flex-1">
                  <Skeleton className="h-4 w-24 mb-2 bg-white/10" />
                  <Skeleton className="h-6 w-10 bg-white/10" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-white/5 px-5 py-3 border-t border-white/10">
              <Skeleton className="h-4 w-32 bg-white/10" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  interface DashboardStats {
    activeResumes: number;
    jobMatches: number;
    submittedApplications: number;
  }
  
  const stats: DashboardStats = dashboardStats as DashboardStats || {
    activeResumes: 0,
    jobMatches: 0,
    submittedApplications: 0
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      <StatsCard
        icon={<FileText className="text-blue-400 h-6 w-6" />}
        glowColor="rgba(59, 130, 246, 0.5)"
        title="Active Resumes"
        value={stats.activeResumes}
        linkText="Create new resume"
        linkUrl="/resume-builder"
        index={0}
      />

      <StatsCard
        icon={<Briefcase className="text-purple-400 h-6 w-6" />}
        glowColor="rgba(147, 51, 234, 0.5)"
        title="Job Matches"
        value={stats.jobMatches}
        linkText="View matches"
        linkUrl="/job-finder"
        index={1}
      />

      <StatsCard
        icon={<CheckCircle className="text-cyan-400 h-6 w-6" />}
        glowColor="rgba(20, 184, 166, 0.5)"
        title="Applications Submitted"
        value={stats.submittedApplications}
        linkText="View applications"
        linkUrl="/applications"
        index={2}
      />
    </div>
  );
}
