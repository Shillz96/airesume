import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCardIcon, ArrowRightIcon, GiftIcon, PlusCircleIcon, ArrowLeft, CheckIcon } from "lucide-react";

import PageHeader from "@/features/layout/components/PageHeader";

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
  const { isGuestMode } = useGuestMode();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activePlanDialog, setActivePlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("starter");
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [selectedAddon, setSelectedAddon] = useState<string>("cover_letter_pack");
  
  // Fetch user's subscription
  const { 
    data: subscription, 
    isLoading: isLoadingSubscription 
  } = useQuery<Subscription | null>({
    queryKey: ['/api/subscription'],
    enabled: !!user && !isGuestMode,
  });
  
  // Fetch user's addons
  const { 
    data: addons, 
    isLoading: isLoadingAddons 
  } = useQuery<Addon[]>({
    queryKey: ['/api/addons'],
    enabled: !!user && !isGuestMode,
  });
  
  // Fetch user's payment history
  const { 
    data: payments, 
    isLoading: isLoadingPayments 
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
  
  const handlePurchasePlan = () => {
    if (isGuestMode) {
      setLocation("/?register=true");
      return;
    }
    
    const planPrices: Record<string, number> = {
      starter: 9.99,
      pro: 19.99,
      career_builder: 29.99,
    };
    
    createSubscriptionMutation.mutate({
      planType: selectedPlan,
      paymentMethod: "credit_card",
      amount: planPrices[selectedPlan],
      autoRenew: autoRenew
    });
  };
  
  const handlePurchaseAddon = () => {
    if (isGuestMode) {
      setLocation("/?register=true");
      return;
    }
    
    const addonPrices: Record<string, number> = {
      cover_letter_pack: 4.99,
      interview_prep: 7.99,
      linkedin_import: 2.99,
      premium_filters: 3.99,
    };
    
    createAddonMutation.mutate({
      addonType: selectedAddon,
      quantity: 1,
      paymentMethod: "credit_card",
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
      {/* Using global CosmicBackground from App.tsx */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10">
        <PageHeader
          title="Subscription Management"
          subtitle="Manage your plans, add-ons, and payment history"
          actions={
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="hidden sm:flex items-center text-muted-foreground border-border hover:bg-muted hover:text-muted-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          }
        />
        
        {user?.isAdmin && (
          <div className="bg-muted/50 border border-border rounded-md p-4 shadow-lg mb-4">
            <p className="text-muted-foreground text-sm">You already have admin privileges.</p>
          </div>
        )}

        <Tabs defaultValue="subscription" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3 solid-card">
            <TabsTrigger value="subscription" className="no-blur">Plans & Subscription</TabsTrigger>
            <TabsTrigger value="addons" className="no-blur">Add-ons</TabsTrigger>
            <TabsTrigger value="billing" className="no-blur">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Subscription Card */}
              <Card className="shadow-xl overflow-hidden solid-card">
                <CardHeader>
                  <CardTitle className="no-blur">Current Plan</CardTitle>
                  <CardDescription className="no-blur">Your active subscription details</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSubscription ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : subscription ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground no-blur">Plan</p>
                          <p className="text-xl font-bold text-foreground capitalize no-blur">
                            {subscription.planType.replace('_', ' ')}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "rounded-full px-3 text-xs font-medium",
                            subscription.status === 'active' 
                              ? "bg-success text-success-foreground"
                              : "bg-destructive text-destructive-foreground"
                          )}
                        >
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="h-px bg-border my-3" />
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground no-blur">Started</p>
                        <p className="text-foreground no-blur">{formatDate(subscription.startDate)}</p>
                      </div>
                      
                      {subscription.endDate && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground no-blur">Expires</p>
                          <p className="text-foreground no-blur">{formatDate(subscription.endDate)}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-muted-foreground no-blur">Auto-renew</p>
                          <Switch
                            id="auto-renew"
                            checked={subscription.autoRenew}
                            onCheckedChange={() => {
                              toast({ title: 'Coming Soon', description: 'Auto-renew toggle will be available soon' });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="mb-4 text-muted-foreground no-blur">You don't have an active subscription.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2 border-t border-border pt-4">
                  {subscription ? (
                    <>
                      <Button
                        variant="destructive"
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

              {/* Starter Plan Card */}
              <Card className="shadow-xl overflow-hidden solid-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="no-blur">Starter</CardTitle>
                      <CardDescription className="no-blur">Essentials for job seekers</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground no-blur">$9.99</span>
                      <span className="text-sm text-muted-foreground no-blur">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[200px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Create up to 3 custom resumes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Basic AI suggestions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Job match recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Application tracking</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button 
                    className="w-full"
                    variant="default"
                    onClick={() => {
                      setSelectedPlan("starter");
                      setActivePlanDialog(true);
                    }}
                  >
                    {subscription?.planType === "starter" ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Plan Card */}
              <Card className="shadow-xl overflow-hidden border-primary/50 ring-1 ring-primary/30 solid-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="no-blur">Pro</CardTitle>
                      <CardDescription className="no-blur">Advanced features for professionals</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground no-blur">$19.99</span>
                      <span className="text-sm text-muted-foreground no-blur">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[200px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Unlimited custom resumes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Advanced AI tailoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Priority job matching</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Interview AI assistance</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">3 cover letter templates</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button 
                    className="w-full"
                    variant="default"
                    onClick={() => {
                      setSelectedPlan("pro");
                      setActivePlanDialog(true);
                    }}
                  >
                    {subscription?.planType === "pro" ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Career Builder Plan Card */}
              <Card className="shadow-xl overflow-hidden solid-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="no-blur">Career Builder</CardTitle>
                      <CardDescription className="no-blur">Complete career development package</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground no-blur">$29.99</span>
                      <span className="text-sm text-muted-foreground no-blur">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[200px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Everything in Pro plan</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">LinkedIn profile optimizations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Personal branding assistance</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Unlimited cover letters</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Job application prioritization</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button 
                    className="w-full"
                    variant="default"
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

          <TabsContent value="addons" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Current Add-ons */}
              <Card className="col-span-1 md:col-span-2 shadow-xl overflow-hidden solid-card">
                <CardHeader>
                  <CardTitle className="no-blur">Your Add-ons</CardTitle>
                  <CardDescription className="no-blur">Your active add-on products</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[150px]">
                  {isLoadingAddons ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto my-8" />
                  ) : addons && addons.length > 0 ? (
                    <ul className="space-y-3">
                      {addons.map((addon) => (
                        <li key={addon.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-md border border-border">
                          <div>
                            <p className="font-medium text-foreground no-blur">{getAddonName(addon.addonType)}</p>
                            <p className="text-sm text-muted-foreground no-blur">
                              Purchased on {formatDate(addon.createdAt)}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {addon.expiresAt ? `Expires ${formatDate(addon.expiresAt)}` : 'Lifetime'}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="mb-4 text-muted-foreground no-blur">You don't have any add-ons yet.</p>
                      <Button 
                        variant="outline"
                        onClick={() => document.getElementById("add-ons-section")?.scrollIntoView({ behavior: "smooth" })}
                      >
                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                        Browse Add-ons
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Add-on Cards */}
              <Card className="shadow-xl overflow-hidden solid-card" id="add-ons-section">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="no-blur">Cover Letter Pack</CardTitle>
                      <CardDescription className="no-blur">Professional cover letter templates</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground no-blur">$4.99</span>
                      <span className="text-sm text-muted-foreground no-blur">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[150px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">5 Premium cover letter templates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">AI-powered customization</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Job-specific tailoring</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedAddon("cover_letter_pack");
                      handlePurchaseAddon();
                    }}
                    disabled={createAddonMutation.isPending}
                  >
                    {createAddonMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Purchase
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-xl overflow-hidden solid-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="no-blur">Interview Prep</CardTitle>
                      <CardDescription className="no-blur">AI-powered interview preparation</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground no-blur">$7.99</span>
                      <span className="text-sm text-muted-foreground no-blur">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[150px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">200+ practice interview questions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">AI feedback on responses</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Industry-specific preparation</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedAddon("interview_prep");
                      handlePurchaseAddon();
                    }}
                    disabled={createAddonMutation.isPending}
                  >
                    {createAddonMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Purchase
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-xl overflow-hidden solid-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="no-blur">Premium Filters</CardTitle>
                      <CardDescription className="no-blur">Advanced job search filters</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground no-blur">$3.99</span>
                      <span className="text-sm text-muted-foreground no-blur">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[150px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Salary range filters</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Company size & type filters</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-success" />
                      <span className="text-muted-foreground no-blur">Custom algorithm matching</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedAddon("premium_filters");
                      handlePurchaseAddon();
                    }}
                    disabled={createAddonMutation.isPending}
                  >
                    {createAddonMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Purchase
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4 mt-6">
            <Card className="shadow-xl overflow-hidden solid-card">
              <CardHeader>
                <CardTitle className="no-blur">Payment History</CardTitle>
                <CardDescription className="no-blur">Your recent payments and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPayments ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto my-8" />
                ) : payments && payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-border">
                          <th className="px-4 py-2 text-sm font-medium text-muted-foreground no-blur">Date</th>
                          <th className="px-4 py-2 text-sm font-medium text-muted-foreground no-blur">Description</th>
                          <th className="px-4 py-2 text-sm font-medium text-muted-foreground text-right no-blur">Amount</th>
                          <th className="px-4 py-2 text-sm font-medium text-muted-foreground text-right no-blur">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-t border-border hover:bg-muted/50">
                            <td className="px-4 py-3 text-sm text-muted-foreground no-blur">
                              {formatDate(payment.createdAt)}
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground no-blur">
                              {payment.itemType === 'subscription'
                                ? 'Subscription Plan'
                                : payment.itemType === 'addon'
                                ? 'Add-on Purchase'
                                : 'Payment'}
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground text-right no-blur">
                              ${parseFloat(payment.amount).toFixed(2)} {payment.currency}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Badge
                                className={cn(
                                  "rounded-full px-3 text-xs font-medium",
                                  payment.status === 'completed' 
                                    ? "bg-success text-success-foreground"
                                    : "bg-destructive text-destructive-foreground"
                                )}
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
                    <p className="text-muted-foreground no-blur">No payment history available.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl overflow-hidden mt-6 solid-card">
              <CardHeader>
                <CardTitle className="no-blur">Payment Methods</CardTitle>
                <CardDescription className="no-blur">Manage your payment options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-6 text-center">
                  <p className="mb-4 text-muted-foreground no-blur">No payment methods saved.</p>
                  <Button 
                    variant="default"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Payment method management will be available in the next update."
                      });
                    }}
                    disabled
                  >
                    <CreditCardIcon className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Active Plan Purchase Dialog */}
        <Dialog open={activePlanDialog} onOpenChange={setActivePlanDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl">Subscribe to {selectedPlan.replace('_', ' ')} Plan</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Complete your subscription purchase
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center p-4 rounded-md bg-muted/50 border border-border">
                <div>
                  <p className="font-medium capitalize text-foreground no-blur">{selectedPlan.replace('_', ' ')} Plan</p>
                  <p className="text-sm text-muted-foreground no-blur">Monthly subscription</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground no-blur">
                    {selectedPlan === 'starter' ? '$9.99' : 
                     selectedPlan === 'pro' ? '$19.99' : '$29.99'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-renew-option"
                    checked={autoRenew}
                    onCheckedChange={setAutoRenew}
                  />
                  <Label htmlFor="auto-renew-option" className="text-muted-foreground no-blur">Auto-renew subscription</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter className="border-t border-border pt-4">
              <Button
                variant="outline"
                onClick={() => setActivePlanDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default"
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
      </div>
    </>
  );
}