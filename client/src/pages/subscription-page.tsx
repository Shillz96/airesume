import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCardIcon, ArrowRightIcon, GiftIcon, PlusCircleIcon } from "lucide-react";


import { AdminControls } from "@/components/admin-tools";
import Navbar from "@/components/navbar";
import PageHeader from "@/components/page-header";

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

interface Addon {
  id: number;
  userId: number;
  addonType: string;
  quantity: number;
  expiresAt: string | null;
  createdAt: string;
}

interface Payment {
  id: number;
  userId: number;
  amount: string;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionId: string | null;
  itemType: string;
  itemId: number | null;
  createdAt: string;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { isGuestMode, showGuestModal } = useGuestMode();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activePlanDialog, setActivePlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("starter");
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [selectedAddon, setSelectedAddon] = useState<string>("cover_letter_pack");
  
  // Fetch user's subscription
  const { 
    data: subscription, 
    isLoading: isLoadingSubscription, 
    error: subscriptionError 
  } = useQuery<Subscription | null>({
    queryKey: ['/api/subscription'],
    enabled: !!user && !isGuestMode,
  });
  
  // Fetch user's addons
  const { 
    data: addons, 
    isLoading: isLoadingAddons, 
    error: addonsError 
  } = useQuery<Addon[]>({
    queryKey: ['/api/addons'],
    enabled: !!user && !isGuestMode,
  });
  
  // Fetch user's payment history
  const { 
    data: payments, 
    isLoading: isLoadingPayments, 
    error: paymentsError 
  } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
    enabled: !!user && !isGuestMode,
  });
  
  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/subscription", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      toast({
        title: "Success",
        description: "Your subscription has been created successfully.",
      });
      setActivePlanDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create subscription: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/subscription/${id}/cancel`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      toast({
        title: "Success",
        description: "Your subscription has been cancelled.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to cancel subscription: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Create addon mutation
  const createAddonMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/addons", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/addons'] });
      toast({
        title: "Success",
        description: "Add-on has been purchased successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to purchase add-on: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // No longer need to show guest modal - guest can browse plans freely

  // Both guest mode and logged in users can view subscription plans
  // No redirect needed
  
  const handlePurchasePlan = () => {
    if (isGuestMode) {
      // For guests, instead of showing modal, just redirect to signup
      setLocation("/?register=true");
      return;
    }
    
    // Simulate payment handling
    const planPrices: Record<string, number> = {
      starter: 9.99,
      pro: 19.99,
      career_builder: 29.99,
    };
    
    createSubscriptionMutation.mutate({
      planType: selectedPlan,
      paymentMethod: "credit_card", // In a real app, this would come from a payment form
      amount: planPrices[selectedPlan],
      autoRenew: autoRenew
    });
  };
  
  const handlePurchaseAddon = () => {
    if (isGuestMode) {
      // For guests, instead of showing modal, just redirect to signup
      setLocation("/?register=true");
      return;
    }
    
    // Simulate payment handling
    const addonPrices: Record<string, number> = {
      cover_letter_pack: 4.99,
      interview_prep: 7.99,
      linkedin_import: 2.99,
      premium_filters: 3.99,
    };
    
    createAddonMutation.mutate({
      addonType: selectedAddon,
      quantity: 1,
      paymentMethod: "credit_card", // In a real app, this would come from a payment form
      amount: addonPrices[selectedAddon]
    });
  };
  
  const handleCancelSubscription = () => {
    if (subscription) {
      if (window.confirm("Are you sure you want to cancel your subscription?")) {
        cancelSubscriptionMutation.mutate(subscription.id);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getAddonName = (addonType: string) => {
    const addonNames: Record<string, string> = {
      cover_letter_pack: "Cover Letter Pack",
      interview_prep: "Interview Preparation",
      linkedin_import: "LinkedIn Import",
      premium_filters: "Premium Job Filters",
    };
    return addonNames[addonType] || addonType;
  };
  
  return (
    <>
      <Navbar />
      <div className="container pt-12 pb-10 px-4 md:px-6 max-w-7xl mx-auto min-h-screen relative z-10">
        <PageHeader
          title="Subscription Management"
          subtitle="Manage your plans, add-ons, and payment history"
          actions={
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="hidden sm:flex items-center gap-2"
            >
              <ArrowRightIcon className="w-4 h-4 rotate-180" />
              Back to Dashboard
            </Button>
          }
        />
        
        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 mb-8">
            <TabsTrigger value="subscription">Plans</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-4">
            {/* Admin Controls Section */}
            {!isGuestMode && user && <AdminControls />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Subscription Card */}
              <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-card/60 backdrop-blur shadow-md">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your active subscription details</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSubscription ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : subscriptionError ? (
                    <div className="py-6 text-center text-destructive">
                      Error loading subscription
                    </div>
                  ) : subscription ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Plan</p>
                          <p className="text-xl font-bold capitalize">
                            {subscription.planType.replace('_', ' ')}
                          </p>
                        </div>
                        <Badge
                          variant={
                            subscription.status === 'active'
                              ? 'default'
                              : subscription.status === 'cancelled'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div>
                        <p className="text-sm font-medium">Started</p>
                        <p>{formatDate(subscription.startDate)}</p>
                      </div>
                      
                      {subscription.endDate && (
                        <div>
                          <p className="text-sm font-medium">Expires</p>
                          <p>{formatDate(subscription.endDate)}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">Auto-renew</p>
                          <Switch
                            id="auto-renew"
                            checked={subscription.autoRenew}
                            onCheckedChange={() => {
                              toast({
                                title: 'Coming Soon',
                                description: 'Auto-renew toggle will be available in the next update'
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="mb-4">You don't have an active subscription.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {subscription ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={cancelSubscriptionMutation.isPending}
                        onClick={handleCancelSubscription}
                      >
                        {cancelSubscriptionMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Cancel Subscription
                      </Button>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => setActivePlanDialog(true)}
                      >
                        Upgrade Plan
                      </Button>
                    </>
                  ) : (
                    <div className="h-[38px]"></div>
                  )}
                </CardFooter>
              </Card>

              {/* Plan Options Cards */}
              <Card className="bg-card/60 backdrop-blur shadow-md border-primary/40">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Starter</CardTitle>
                      <CardDescription>Essentials for job seekers</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">$9.99</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 min-h-[216px]">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Create up to 3 custom resumes
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Basic AI suggestions
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Job match recommendations
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Application tracking
                    </li>
                    <li className="flex items-center opacity-0">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Hidden spacer
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedPlan("starter");
                      setActivePlanDialog(true);
                    }}
                  >
                    {subscription?.planType === "starter" ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card/60 backdrop-blur shadow-md border-primary/40">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Pro</CardTitle>
                      <CardDescription>Advanced features for professionals</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">$19.99</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 min-h-[216px]">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Unlimited custom resumes
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Advanced AI tailoring
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Priority job matching
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Interview AI assistance
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      3 cover letter templates
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedPlan("pro");
                      setActivePlanDialog(true);
                    }}
                  >
                    {subscription?.planType === "pro" ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card/60 backdrop-blur shadow-md border-primary/40">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Career Builder</CardTitle>
                      <CardDescription>Complete career development package</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">$29.99</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 min-h-[216px]">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Everything in Pro plan
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      LinkedIn profile optimizations
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Personal branding assistance
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Unlimited cover letters
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Job application prioritization
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedPlan("career_builder");
                      setActivePlanDialog(true);
                    }}
                  >
                    {subscription?.planType === "career_builder" ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="addons" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Current Add-ons */}
              <Card className="col-span-1 md:col-span-2 bg-card/60 backdrop-blur shadow-md">
                <CardHeader>
                  <CardTitle>My Add-ons</CardTitle>
                  <CardDescription>Your purchased add-ons and extensions</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAddons ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : addonsError ? (
                    <div className="py-6 text-center text-destructive">
                      Error loading add-ons
                    </div>
                  ) : addons && addons.length > 0 ? (
                    <div className="space-y-4">
                      {addons.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between p-4 border rounded-md">
                          <div>
                            <h3 className="font-medium">{getAddonName(addon.addonType)}</h3>
                            <p className="text-sm text-muted-foreground">
                              Purchased on {formatDate(addon.createdAt)}
                            </p>
                            {addon.expiresAt && (
                              <p className="text-sm">
                                Expires on {formatDate(addon.expiresAt)}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline">Quantity: {addon.quantity}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="mb-4">You don't have any add-ons yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add-on Options */}
              <Card className="bg-card/60 backdrop-blur shadow-md border-primary/40">
                <CardHeader>
                  <CardTitle>Cover Letter Pack</CardTitle>
                  <CardDescription>$4.99</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[75px]">
                  <p className="text-sm">Get 5 professionally designed cover letter templates with AI customization.</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedAddon("cover_letter_pack");
                      handlePurchaseAddon();
                    }}
                  >
                    Add to Account
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card/60 backdrop-blur shadow-md border-primary/40">
                <CardHeader>
                  <CardTitle>Interview Prep</CardTitle>
                  <CardDescription>$7.99</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[75px]">
                  <p className="text-sm">Access to AI interview coach with industry-specific question practice.</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedAddon("interview_prep");
                      handlePurchaseAddon();
                    }}
                  >
                    Add to Account
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card/60 backdrop-blur shadow-md border-primary/40">
                <CardHeader>
                  <CardTitle>LinkedIn Import</CardTitle>
                  <CardDescription>$2.99</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Import your LinkedIn profile data to quickly create professional resumes.</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedAddon("linkedin_import");
                      handlePurchaseAddon();
                    }}
                  >
                    Add to Account
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card/60 backdrop-blur shadow-md border-primary/40">
                <CardHeader>
                  <CardTitle>Premium Filters</CardTitle>
                  <CardDescription>$3.99</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Advanced job search filters with salary information and company insights.</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedAddon("premium_filters");
                      handlePurchaseAddon();
                    }}
                  >
                    Add to Account
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card className="bg-card/60 backdrop-blur shadow-md">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your recent transactions and billing details</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPayments ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : paymentsError ? (
                  <div className="py-6 text-center text-destructive">
                    Error loading payment history
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left font-medium p-2">Date</th>
                          <th className="text-left font-medium p-2">Description</th>
                          <th className="text-left font-medium p-2">Amount</th>
                          <th className="text-left font-medium p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="p-2">{formatDate(payment.createdAt)}</td>
                            <td className="p-2 capitalize">
                              {payment.itemType === 'subscription' ? 'Subscription Payment' : 'Add-on Purchase'}
                            </td>
                            <td className="p-2">
                              {payment.currency} {payment.amount}
                            </td>
                            <td className="p-2">
                              <Badge
                                variant={
                                  payment.status === 'completed'
                                    ? 'default'
                                    : payment.status === 'failed'
                                    ? 'destructive'
                                    : 'outline'
                                }
                              >
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="mb-4">You don't have any payment history yet.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Need help with billing? Contact support at support@airehire.com
                </p>
              </CardFooter>
            </Card>

            <Card className="bg-card/60 backdrop-blur shadow-md">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <CreditCardIcon className="h-6 w-6" />
                      <div>
                        <p className="font-medium">Credit Card</p>
                        <p className="text-sm text-muted-foreground">
                          **** **** **** 1234
                        </p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" className="gap-2">
                      <PlusCircleIcon className="h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Purchase Plan Dialog */}
      <Dialog open={activePlanDialog} onOpenChange={setActivePlanDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subscribe to {selectedPlan.replace('_', ' ')}</DialogTitle>
            <DialogDescription>
              Choose your payment options below
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select defaultValue="credit_card">
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing-cycle">Billing Cycle</Label>
              <RadioGroup defaultValue="monthly" className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annual" id="annual" />
                  <Label htmlFor="annual">Annual (Save 20%)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-renew-option"
                checked={autoRenew}
                onCheckedChange={setAutoRenew}
              />
              <Label htmlFor="auto-renew-option">Auto-renew subscription</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivePlanDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePurchasePlan}
              disabled={createSubscriptionMutation.isPending}
            >
              {createSubscriptionMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Subscribe Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}