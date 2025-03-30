import React, { useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, CheckCircle, AlertCircle, Calendar, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import gsap from 'gsap';

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

/**
 * SubscriptionStatus component displays the current subscription status
 * and related information for the user
 */
export default function SubscriptionStatus() {
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['/api/subscription'],
    enabled: !!user,
  });
  
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
  
  if (!user) {
    return (
      <div className="h-full flex flex-col">
        <h2 
          ref={titleRef}
          className="cosmic-page-title text-2xl flex items-center mb-4"
        >
          <CreditCard className="mr-2 h-5 w-5 text-blue-400" />
          Subscription
        </h2>
        
        <div ref={cardRef}>
          <Card className="solid-card shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-card-foreground no-blur">Subscription Status</CardTitle>
              <CardDescription className="text-muted-foreground no-blur">Sign in to view your subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground no-blur">You need to be logged in to view your subscription information.</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="default"
                onClick={() => window.location.href = "/auth"}
                className="w-full"
              >
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <h2 
          ref={titleRef}
          className="cosmic-page-title text-2xl flex items-center mb-4"
        >
          <CreditCard className="mr-2 h-5 w-5 text-blue-400" />
          Subscription
        </h2>
        
        <div ref={cardRef}>
          <Card className="solid-card shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white no-blur">Subscription Status</CardTitle>
              <CardDescription className="text-gray-300 no-blur">Loading your subscription details...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex flex-col">
        <h2 
          ref={titleRef}
          className="cosmic-page-title text-2xl flex items-center mb-4"
        >
          <CreditCard className="mr-2 h-5 w-5 text-blue-400" />
          Subscription
        </h2>
        
        <div ref={cardRef}>
          <Card className="solid-card shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white no-blur">Subscription Status</CardTitle>
              <CardDescription className="text-gray-300 no-blur">There was an error retrieving your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-red-400 no-blur">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load subscription details. Please try again later.</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => window.location.reload()}
                variant="default"
                className="w-full"
              >
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  const sub = subscription as Subscription;
  
  // Determine if subscription is active
  const isActive = sub?.status === 'active';
  
  // Format dates
  const startDate = sub?.startDate ? format(new Date(sub.startDate), 'MMM d, yyyy') : 'Unknown';
  const endDate = sub?.endDate ? format(new Date(sub.endDate), 'MMM d, yyyy') : 'Never';
  
  // Determine display info based on plan type
  const planInfo = {
    free: {
      title: 'Free Plan',
      description: 'Basic access with limited features',
      icon: <CreditCard className="h-5 w-5 text-gray-300" />,
      color: 'text-gray-300',
      badgeColor: 'bg-gray-900/60 text-gray-300 border-gray-700'
    },
    pro: {
      title: 'Pro Plan',
      description: 'Full access to all features',
      icon: <Sparkles className="h-5 w-5 text-blue-400" />,
      color: 'text-blue-400',
      badgeColor: 'bg-blue-900/60 text-blue-300 border-blue-700'
    },
    premium: {
      title: 'Premium Plan',
      description: 'Priority access and advanced features',
      icon: <Zap className="h-5 w-5 text-amber-400" />,
      color: 'text-amber-400',
      badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-700'
    },
  };
  
  // Use the plan info or default to free
  const plan = sub?.planType ? planInfo[sub.planType as keyof typeof planInfo] : planInfo.free;
  
  return (
    <div className="h-full flex flex-col">
      <h2 
        ref={titleRef}
        className="cosmic-page-title text-2xl flex items-center mb-4"
      >
        <CreditCard className="mr-2 h-5 w-5 text-blue-400" />
        Subscription
      </h2>
      
      <div ref={cardRef}>
        <Card className="solid-card shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white no-blur">Subscription Status</CardTitle>
                <CardDescription className="text-gray-300 no-blur">Your current plan and status</CardDescription>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-medium border ${isActive ? 'bg-green-900/60 text-green-300 border-green-700' : 'bg-amber-900/60 text-amber-300 border-amber-700'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`rounded-lg p-4 solid-card flex items-center space-x-3 shadow-inner`}>
              <div className="p-2 bg-gray-800/50 rounded-full">
                {plan.icon}
              </div>
              <div className="no-blur">
                <h3 className={`font-medium ${plan.color}`}>{plan.title}</h3>
                <p className="text-sm text-gray-300">{plan.description}</p>
              </div>
            </div>
            
            <div className="space-y-3 no-blur">
              <div className="flex justify-between items-center py-2 border-b border-white/10 dark:border-gray-700/30">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Start Date</span>
                </div>
                <span className="text-sm font-medium text-white">{startDate}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10 dark:border-gray-700/30">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">End Date</span>
                </div>
                <span className="text-sm font-medium text-white">{endDate}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10 dark:border-gray-700/30">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Auto Renewal</span>
                </div>
                <span className="text-sm font-medium text-white">{sub?.autoRenew ? 'Enabled' : 'Disabled'}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Payment Method</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {sub?.paymentMethod || 'None'}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.location.href = "/subscription"}
            >
              Manage Subscription
            </Button>
            
            {sub?.planType === 'free' && (
              <Button 
                variant="outline"
                className="w-full border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
                onClick={() => window.location.href = "/subscription?upgrade=true"}
              >
                Upgrade Plan
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}