import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/ui/core/Button';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/core/Card';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';

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
  
  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['/api/subscription'],
    enabled: !!user,
  });
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Sign in to view your subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need to be logged in to view your subscription information.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => window.location.href = "/auth"}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Loading your subscription details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>There was an error retrieving your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load subscription details. Please try again later.</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardFooter>
      </Card>
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
      color: 'text-slate-500',
      bgColor: 'bg-slate-100',
    },
    pro: {
      title: 'Pro Plan',
      description: 'Full access to all features',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
    },
    premium: {
      title: 'Premium Plan',
      description: 'Priority access and advanced features',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
    },
  };
  
  // Use the plan info or default to free
  const plan = sub?.planType ? planInfo[sub.planType as keyof typeof planInfo] : planInfo.free;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Your current plan and status</CardDescription>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-lg p-4 ${plan.bgColor} flex items-center space-x-3`}>
          <div className={`rounded-full p-2 ${plan.color} bg-white`}>
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium">{plan.title}</h3>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Start Date</span>
            </div>
            <span className="text-sm font-medium">{startDate}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">End Date</span>
            </div>
            <span className="text-sm font-medium">{endDate}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Auto Renewal</span>
            </div>
            <span className="text-sm font-medium">{sub?.autoRenew ? 'Enabled' : 'Disabled'}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Payment Method</span>
            </div>
            <span className="text-sm font-medium">
              {sub?.paymentMethod || 'None'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => window.location.href = "/subscription"}
        >
          Manage Subscription
        </Button>
        
        {sub?.planType === 'free' && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = "/subscription?upgrade=true"}
          >
            Upgrade Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}