import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity, FileText, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ActivityItem {
  id: string;
  type: 'resume_update' | 'job_application' | 'job_match';
  title: string;
  status: 'complete' | 'in_progress' | 'new';
  timestamp: string;
}

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
    <div>
      <h2 
        ref={titleRef}
        className="cosmic-page-title text-2xl flex items-center"
      >
        <Activity className="mr-2 h-5 w-5 text-blue-400" />
        Recent Activity
      </h2>
      
      <Card className="cosmic-card mt-4" ref={cardRef}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white font-medium">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
            <div className="px-4 py-10 sm:px-6 text-center text-gray-400">
              <p>No recent activity found. Start by creating a resume or searching for jobs.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
