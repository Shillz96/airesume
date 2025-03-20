import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityItem {
  id: string;
  type: 'resume_update' | 'job_application' | 'job_match';
  title: string;
  status: 'complete' | 'in_progress' | 'new';
  timestamp: string;
}

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activities'],
    refetchInterval: false,
  });

  function getStatusBadge(status: string) {
    switch (status) {
      case 'complete':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Complete</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">In progress</Badge>;
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">New</Badge>;
      default:
        return null;
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg leading-6 font-medium text-secondary-900 mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-secondary-200">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <ul role="list" className="divide-y divide-secondary-200">
              {activities.map((activity: ActivityItem) => (
                <li key={activity.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600 truncate">{activity.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-secondary-500">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-secondary-400" />
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-10 sm:px-6 text-center text-secondary-500">
              <p>No recent activity found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
