import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/ui/core/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/core/Button";
import { Clock, Activity, FileText, Briefcase, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "wouter";

interface ActivityItem {
  id: string;
  type: 'resume_update' | 'job_application' | 'job_match';
  title: string;
  status: 'complete' | 'in_progress' | 'new';
  timestamp: string;
}

/**
 * RecentActivity component displays a timeline of user activity
 * Shows resume updates, job applications, and job matches
 * Provides suggested actions when no activity is available
 */
export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<ActivityItem[]>({
    queryKey: ['/api/activities'],
    refetchInterval: false,
  });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );
    }
    
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  function getStatusBadge(status: string) {
    switch (status) {
      case 'complete':
        return (
          <Badge variant="outline" className="bg-teal-500/20 text-teal-300 border-teal-500/30">
            Complete
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            In progress
          </Badge>
        );
      case 'new':
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            New
          </Badge>
        );
      default:
        return null;
    }
  }
  
  function getActivityIcon(type: string) {
    switch (type) {
      case 'resume_update':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'job_application':
        return <Briefcase className="h-4 w-4 text-purple-400" />;
      case 'job_match':
        return <Activity className="h-4 w-4 text-green-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  }

  return (
    <div className="h-full flex flex-col">
      <h2 
        ref={titleRef}
        className="cosmic-page-title text-2xl flex items-center mb-4"
      >
        <Activity className="mr-2 h-5 w-5 text-blue-400" />
        Recent Activity
      </h2>
      
      <div ref={cardRef}>
        <Card className="cosmic-card border border-white/10 bg-black/30 flex-1 flex flex-col hover:border-blue-500/50 transition-all duration-300">
        <CardHeader className="pb-2 flex-shrink-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <CardTitle className="text-lg text-white font-medium">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          {isLoading ? (
            <div className="divide-y divide-white/10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-2/3 bg-white/10" />
                    <Skeleton className="h-5 w-20 bg-white/10" />
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <Skeleton className="h-4 w-32 bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <ul role="list" className="divide-y divide-white/10 relative">
              {/* Timeline line */}
              <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-cyan-500/50"></div>
              
              {(activities as ActivityItem[]).map((activity: ActivityItem, index: number) => (
                <li key={activity.id} className="relative">
                  <div className="px-4 py-4 sm:px-6 relative">
                    {/* Timeline dot */}
                    <div className="absolute left-0 ml-2 mt-1 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.7)] z-10"></div>
                    
                    <div className="ml-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">{getActivityIcon(activity.type)}</span>
                          <p className="text-sm font-medium text-blue-400 truncate">{activity.title}</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          {getStatusBadge(activity.status)}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-400">
                            <Clock className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-500" />
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 sm:px-6">
              <div className="text-center text-gray-400 mb-4">
                <p>No recent activity found. Let's get started with your job search journey!</p>
              </div>
              
              {/* Suggested actions for new users */}
              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-medium text-blue-400 mb-2">Suggested Actions</h3>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 transition-all hover:bg-white/10">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Create Your First Resume</h4>
                      <p className="text-xs text-gray-400 mt-1">Build a professional resume with AI-powered assistance</p>
                    </div>
                  </div>
                  <Link href="/resume-builder">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-3 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 transition-all hover:bg-white/10">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                      <Briefcase className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Explore Job Matches</h4>
                      <p className="text-xs text-gray-400 mt-1">Discover jobs that match your skills and experience</p>
                    </div>
                  </div>
                  <Link href="/job-finder">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-3 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 w-full"
                    >
                      Explore Jobs
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Daily Tip */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-blue-400 mb-2">Daily Tip</h3>
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start">
                    <div className="p-2 bg-amber-500/20 rounded-full mr-3 mt-1">
                      <Lightbulb className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Resume Optimization</h4>
                      <p className="text-xs text-gray-300 mt-1">
                        Tailor your resume for each job application to increase your chances by 30%! 
                        Use our AI-Assistant to highlight the most relevant skills and experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        </Card>
      </div>
    </div>
  );
}