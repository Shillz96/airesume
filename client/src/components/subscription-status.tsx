import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { CreditCard, Star, Sparkles, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Subscription {
  id: number;
  userId: number;
  planType: string;
  status: string;
  startDate: string;
  endDate: string | null;
  paymentMethod: string | null;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SubscriptionStatus() {
  const { user } = useAuth();
  
  const { 
    data: subscription, 
    isLoading,
    error 
  } = useQuery<Subscription | null>({
    queryKey: ['/api/subscription'],
    enabled: !!user,
  });
  
  if (isLoading) {
    return (
      <Card className="bg-card/60 backdrop-blur-lg border-white/10 mt-4 overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-card/60 backdrop-blur-lg border-white/10 mt-4 overflow-hidden relative">
        <CardContent className="p-6">
          <div className="text-sm text-red-400">
            Error loading subscription details
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!subscription) {
    return (
      <Card className="bg-card/60 backdrop-blur-lg border-white/10 mt-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full cosmic-nebula opacity-20 z-0"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gray-800 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-300">No Active Subscription</h3>
                <p className="text-sm text-gray-400">Unlock premium features with a subscription plan</p>
              </div>
            </div>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
              Free Tier
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="px-6 py-4 bg-black/20 flex justify-between items-center relative z-10">
          <div className="text-sm text-gray-400 flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            <span>Limited to 1 resume and basic features</span>
          </div>
          <Button size="sm" variant="default" asChild className="gap-1">
            <Link href="/subscription">
              Upgrade <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Otherwise show active subscription details
  const getPlanIcon = () => {
    switch (subscription.planType) {
      case 'starter':
        return <Star className="h-5 w-5 text-blue-400" />;
      case 'pro':
        return <Sparkles className="h-5 w-5 text-purple-400" />;
      case 'career_builder':
        return <Sparkles className="h-5 w-5 text-yellow-400" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getPlanColor = () => {
    switch (subscription.planType) {
      case 'starter':
        return 'text-blue-400 border-blue-400/30';
      case 'pro':
        return 'text-purple-400 border-purple-400/30';
      case 'career_builder':
        return 'text-yellow-400 border-yellow-400/30';
      default:
        return 'text-gray-400 border-gray-400/30';
    }
  };
  
  const formatPlanName = (planType: string) => {
    return planType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <Card className="bg-card/60 backdrop-blur-lg border-white/10 mt-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full cosmic-nebula opacity-20 z-0"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 p-2 rounded-full">
              {getPlanIcon()}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-200">{formatPlanName(subscription.planType)} Plan</h3>
              <p className="text-sm text-gray-400">
                {subscription.status === 'active' 
                  ? 'Your subscription is active' 
                  : 'Your subscription is ' + subscription.status}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={getPlanColor()}>
            {formatPlanName(subscription.planType)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-black/20 flex justify-between items-center relative z-10">
        <div className="text-sm text-gray-400 flex items-center gap-1">
          {subscription.autoRenew ? (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
              Auto-renews
            </>
          ) : (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
              Renew manually
            </>
          )}
        </div>
        <Button size="sm" variant="outline" asChild className="gap-1">
          <Link href="/subscription">
            Manage <CreditCard className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}