import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";

import { Button } from "@/ui/core/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/core/Card";
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

import { AdminControls } from "@/features/admin/components/AdminTools";

import { UnifiedPageHeader, UnifiedContainer } from "@/components/unified";

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
        <UnifiedPageHeader
          title="Subscription Management"
          subtitle="Manage your plans, add-ons, and payment history"
          variant="cosmic"
          borderStyle="gradient"
          actions={
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="hidden sm:flex items-center bg-transparent border border-gray-700 hover:bg-gray-800 text-white cosmic-glow"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          }
        />
        
        <Tabs defaultValue="subscription" className="w-full mt-6 cosmic-tabs">
          <TabsList className="cosmic-tablist">
            <TabsTrigger 
              value="subscription" 
              className="cosmic-tab">
              Plans
            </TabsTrigger>
            <TabsTrigger 
              value="addons" 
              className="cosmic-tab">
              Add-ons
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="cosmic-tab">
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-4">
            {/* Admin Controls Section */}
            {!isGuestMode && user && (
              <div className="bg-[#151830] border border-[#252a47] rounded-md p-4 shadow-lg mb-4">
                <p className="text-gray-400 text-sm">You already have admin privileges.</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Subscription Card */}
              <Card className="cosmic-card border-0 text-white shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Current Plan</CardTitle>
                  <CardDescription className="text-gray-400">Your active subscription details</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSubscription ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                    </div>
                  ) : subscription ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">Plan</p>
                          <p className="text-xl font-bold text-white capitalize">
                            {subscription.planType.replace('_', ' ')}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "bg-gradient-to-r rounded-full px-3 text-xs font-medium",
                            subscription.status === 'active' 
                              ? "from-green-500 to-emerald-600 text-white" 
                              : "from-red-500 to-red-600 text-white"
                          )}
                        >
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-3" />
                      
                      <div>
                        <p className="text-sm font-medium text-gray-400">Started</p>
                        <p className="text-white">{formatDate(subscription.startDate)}</p>
                      </div>
                      
                      {subscription.endDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-400">Expires</p>
                          <p className="text-white">{formatDate(subscription.endDate)}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-400">Auto-renew</p>
                          <Switch
                            id="auto-renew"
                            checked={subscription.autoRenew}
                            className="data-[state=checked]:bg-indigo-600"
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
                      <p className="mb-4 text-gray-400">You don't have an active subscription.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2 border-t border-[#252a47]">
                  {subscription ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border border-gray-700 hover:bg-gray-800 text-white"
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
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0 cosmic-btn-glow"
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
              <Card className="cosmic-card border-0 text-white shadow-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Starter</CardTitle>
                      <CardDescription className="text-gray-400">Essentials for job seekers</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">$9.99</span>
                      <span className="text-sm text-gray-400">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[200px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Create up to 3 custom resumes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Basic AI suggestions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Job match recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Application tracking</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-[#252a47] ">
                  <Button 
                    className="w-full cosmic-btn-glow"
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
              <Card className="cosmic-card border-0 text-white shadow-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Pro</CardTitle>
                      <CardDescription className="text-gray-400">Advanced features for professionals</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">$19.99</span>
                      <span className="text-sm text-gray-400">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[200px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Unlimited custom resumes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Advanced AI tailoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Priority job matching</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Interview AI assistance</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">3 cover letter templates</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-[#252a47] ">
                  <Button 
                    className="w-full cosmic-btn-glow"
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
              <Card className="cosmic-card border-0 text-white shadow-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Career Builder</CardTitle>
                      <CardDescription className="text-gray-400">Complete career development package</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">$29.99</span>
                      <span className="text-sm text-gray-400">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[200px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Everything in Pro plan</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">LinkedIn profile optimizations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Personal branding assistance</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Unlimited cover letters</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Job application prioritization</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-[#252a47] ">
                  <Button 
                    className="w-full cosmic-btn-glow"
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
              <Card className="col-span-1 md:col-span-2 border-0 bg-[#151830] text-white shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Your Add-ons</CardTitle>
                  <CardDescription className="text-gray-400">Your active add-on products</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[150px]">
                  {isLoadingAddons ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                    </div>
                  ) : addons && addons.length > 0 ? (
                    <ul className="space-y-3">
                      {addons.map((addon) => (
                        <li key={addon.id} className="flex justify-between items-center p-3 bg-[#0f1229]/80 rounded-md border border-[#252a47]">
                          <div>
                            <p className="font-medium text-white">{getAddonName(addon.addonType)}</p>
                            <p className="text-sm text-gray-400">
                              Purchased on {formatDate(addon.createdAt)}
                            </p>
                          </div>
                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 rounded-full px-3 text-xs">
                            {addon.expiresAt ? `Expires ${formatDate(addon.expiresAt)}` : 'Lifetime'}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="mb-4 text-gray-400">You don't have any add-ons yet.</p>
                      <Button 
                        className="bg-transparent hover:bg-[#252a47] text-white border border-[#353e65]"
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
              <Card className="cosmic-card border-0 text-white shadow-xl overflow-hidden" id="add-ons-section">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Cover Letter Pack</CardTitle>
                      <CardDescription className="text-gray-400">Professional cover letter templates</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">$4.99</span>
                      <span className="text-sm text-gray-400">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[150px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">5 Premium cover letter templates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">AI-powered customization</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Job-specific tailoring</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-[#252a47] ">
                  <Button 
                    className="w-full cosmic-btn-glow"
                    onClick={() => {
                      setSelectedAddon("cover_letter_pack");
                      handlePurchaseAddon();
                    }}
                  >
                    {createAddonMutation.isPending && selectedAddon === "cover_letter_pack" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Purchase
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="cosmic-card border-0 text-white shadow-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Interview Prep</CardTitle>
                      <CardDescription className="text-gray-400">AI-powered interview preparation</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">$7.99</span>
                      <span className="text-sm text-gray-400">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[150px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">200+ practice interview questions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">AI feedback on responses</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Industry-specific preparation</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-[#252a47] ">
                  <Button 
                    className="w-full cosmic-btn-glow"
                    onClick={() => {
                      setSelectedAddon("interview_prep");
                      handlePurchaseAddon();
                    }}
                  >
                    {createAddonMutation.isPending && selectedAddon === "interview_prep" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Purchase
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="cosmic-card border-0 text-white shadow-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Premium Filters</CardTitle>
                      <CardDescription className="text-gray-400">Advanced job search filters</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">$3.99</span>
                      <span className="text-sm text-gray-400">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 min-h-[150px]">
                  <ul className="space-y-3 mt-3 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Salary range filters</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Company size & type filters</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-gray-300">Custom algorithm matching</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-[#252a47] ">
                  <Button 
                    className="w-full cosmic-btn-glow"
                    onClick={() => {
                      setSelectedAddon("premium_filters");
                      handlePurchaseAddon();
                    }}
                  >
                    {createAddonMutation.isPending && selectedAddon === "premium_filters" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Purchase
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card className="cosmic-card border-0 text-white shadow-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Payment History</CardTitle>
                <CardDescription className="text-gray-400">Your recent payments and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPayments ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-[#252a47]">
                          <th className="px-4 py-2 text-sm font-medium text-gray-400">Date</th>
                          <th className="px-4 py-2 text-sm font-medium text-gray-400">Description</th>
                          <th className="px-4 py-2 text-sm font-medium text-gray-400 text-right">Amount</th>
                          <th className="px-4 py-2 text-sm font-medium text-gray-400 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-t border-[#252a47] hover:bg-[#1a1f3a]">
                            <td className="px-4 py-3 text-sm text-gray-300">
                              {formatDate(payment.createdAt)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">
                              {payment.itemType === 'subscription'
                                ? 'Subscription Plan'
                                : payment.itemType === 'addon'
                                ? 'Add-on Purchase'
                                : 'Payment'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300 text-right">
                              ${parseFloat(payment.amount).toFixed(2)} {payment.currency}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Badge
                                className={cn(
                                  "bg-gradient-to-r rounded-full px-3 text-xs font-medium",
                                  payment.status === 'completed' 
                                    ? "from-green-500 to-emerald-600 text-white" 
                                    : "from-red-500 to-red-600 text-white"
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
                    <p className="text-gray-400">No payment history available.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="cosmic-card border-0 text-white shadow-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Payment Methods</CardTitle>
                <CardDescription className="text-gray-400">Manage your payment options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-6 text-center">
                  <p className="mb-4 text-gray-400">No payment methods saved.</p>
                  <Button 
                    className="cosmic-btn-glow"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Payment method management will be available in the next update."
                      });
                    }}
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
          <DialogContent className="bg-card/90 backdrop-blur-xl border-white/10 shadow-xl text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Subscribe to {selectedPlan.replace('_', ' ')} Plan</DialogTitle>
              <DialogDescription className="text-gray-400">
                Complete your subscription purchase
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center p-4 rounded-md bg-[#0f1229]/80 border border-[#252a47]">
                <div>
                  <p className="font-medium capitalize text-white">{selectedPlan.replace('_', ' ')} Plan</p>
                  <p className="text-sm text-gray-400">Monthly subscription</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-white">
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
                    className="data-[state=checked]:bg-indigo-600"
                    onCheckedChange={setAutoRenew}
                  />
                  <Label htmlFor="auto-renew-option" className="text-gray-300">Auto-renew subscription</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter className="border-t border-[#252a47] ">
              <Button
                className="cosmic-btn-glow !bg-transparent"
                variant="outline"
                onClick={() => setActivePlanDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="cosmic-btn-glow"
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