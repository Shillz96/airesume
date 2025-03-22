import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import Navbar from "@/components/navbar";
import { 
  FileText, 
  Briefcase, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Bot,
  Search,
  Zap,
  Mail,
  Lock,
  User,
  X,
  Loader2,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { insertUserSchema } from "@shared/schema";
import { useGuestMode } from "@/hooks/use-guest-mode";
import gsap from "gsap";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema (extends the base schema from shared)
const registerSchema = insertUserSchema
  .extend({
    confirmPassword: z.string(),
    plan: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const { showGuestModal } = useGuestMode();
  
  // Animation refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Dialog states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Form setup
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      plan: "",
    },
  });
  
  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  // Form submission handlers
  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await loginMutation.mutateAsync(values);
      setIsLoginOpen(false);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setLocation("/");
    } catch (error) {
      // Error is handled in the mutation
    }
  }
  
  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const { confirmPassword, plan, ...userValues } = values;
      await registerMutation.mutateAsync(userValues);
      setIsRegisterOpen(false);
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
      setLocation("/");
    } catch (error) {
      // Error is handled in the mutation
    }
  }
  
  // Starfield animation
  useEffect(() => {
    const createStar = () => {
      const star = document.createElement("div");
      star.className = "cosmic-star absolute rounded-full";
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = `${Math.random() * 0.5 + 0.3}`;
      const colors = ['#ffffff', '#e1e1ff', '#b3c6ff', '#d6e4ff'];
      star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      document.querySelector('.cosmic-page')?.appendChild(star);
      return () => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      };
    };

    const cleanupFns = [];
    const starCount = window.innerWidth < 768 ? 50 : 100;
    for (let i = 0; i < starCount; i++) {
      cleanupFns.push(createStar());
    }
    
    if (titleRef.current && subtitleRef.current && ctaRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
      gsap.fromTo(subtitleRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, delay: 0.3 });
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, delay: 0.6 });
    }
    
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll('.feature-card');
      gsap.fromTo(features, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, scrollTrigger: { trigger: featuresRef.current, start: "top 80%" } }
      );
    }
    
    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  const handleLoginClick = () => setIsLoginOpen(true);
  const handleRegisterClick = () => setIsRegisterOpen(true);
  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    registerForm.setValue("plan", plan);
    setIsRegisterOpen(true);
  };

  useEffect(() => {
    const loginBtn = document.getElementById("login-button");
    const registerBtn = document.getElementById("register-button");
    if (loginBtn) loginBtn.addEventListener("click", handleLoginClick);
    if (registerBtn) registerBtn.addEventListener("click", handleRegisterClick);
    return () => {
      if (loginBtn) loginBtn.removeEventListener("click", handleLoginClick);
      if (registerBtn) registerBtn.removeEventListener("click", handleRegisterClick);
    };
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="bg-card/90 backdrop-blur-xl border-white/10 sm:max-w-md">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-2xl cosmic-text-gradient">Log In</DialogTitle>
            <DialogDescription>Enter your credentials to access your account</DialogDescription>
          </DialogHeader>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter your username" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="Enter your password" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full cosmic-btn-glow" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Log In
              </Button>
            </form>
          </Form>
          <DialogFooter className="mt-4 text-center flex-col sm:flex-col sm:space-y-2">
            <div className="text-sm">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-400 hover:text-blue-300"
                onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}
              >
                Sign up
              </Button>
            </div>
            <div className="text-sm">
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-400 hover:text-blue-300"
                onClick={() => { setIsLoginOpen(false); showGuestModal(); }}
              >
                Continue as guest
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Register Dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="bg-card/90 backdrop-blur-xl border-white/10 sm:max-w-md">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-2xl cosmic-text-gradient">Create Account</DialogTitle>
            <DialogDescription>Sign up to get started with AIreHire</DialogDescription>
          </DialogHeader>
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Choose a username" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="Create a password" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="Confirm your password" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedPlan && (
                <Alert>
                  <AlertDescription className="text-sm">
                    You've selected the <span className="font-medium">{selectedPlan}</span> plan. You can change this later in your subscription settings.
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full cosmic-btn-glow mt-2" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Account
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-400 hover:text-blue-300"
              onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
            >
              Log in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Main Content */}
      <div className="container pt-12 pb-10 px-4 md:px-6 mx-auto min-h-screen relative z-10 cosmic-page">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold background-animate bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              ref={titleRef}
            >
              Accelerate Your Career with AI-Powered Resume & Job Tools
            </h1>
            <p 
              className="mt-6 max-w-2xl mx-auto text-xl text-gray-300"
              ref={subtitleRef}
            >
              Create stunning resumes tailored to each job, discover your perfect career match, and land more interviews with our AI-powered platform.
            </p>
            <div 
              className="mt-10 flex justify-center gap-4"
              ref={ctaRef}
            >
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg cosmic-btn-glow"
                onClick={() => setIsRegisterOpen(true)}
              >
                Try for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg border-white/10 hover:bg-white/10 text-gray-200"
                onClick={() => showGuestModal()}
              >
                Continue as Guest
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 relative z-10" ref={featuresRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold cosmic-text-gradient">
                Powerful Features to Supercharge Your Job Search
              </h2>
              <p className="mt-4 text-xl text-gray-300">
                Everything you need to create professional resumes and find your dream job
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="feature-card cosmic-card border border-white/10 rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Resume Builder</h3>
                <p className="text-gray-300">
                  Create ATS-optimized resumes with intelligent suggestions for every section, customizable templates, and real-time feedback.
                </p>
              </div>
              
              <div className="feature-card cosmic-card border border-white/10 rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Tailor Resume</h3>
                <p className="text-gray-300">
                  Automatically optimize your resume for specific job descriptions, increasing your chances of getting interviews.
                </p>
              </div>
              
              <div className="feature-card cosmic-card border border-white/10 rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Intelligent Job Matching</h3>
                <p className="text-gray-300">
                  Discover jobs that match your skills and experience with our AI-powered job search and matching algorithm.
                </p>
              </div>
              
              <div className="feature-card cosmic-card border border-white/10 rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Resume Versions</h3>
                <p className="text-gray-300">
                  Create and manage multiple resume versions for different job types, industries, or career paths.
                </p>
              </div>
              
              <div className="feature-card cosmic-card border border-white/10 rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ATS Keyword Analysis</h3>
                <p className="text-gray-300">
                  Identify missing keywords and optimize your resume to pass through Applicant Tracking Systems.
                </p>
              </div>
              
              <div className="feature-card cosmic-card border border-white/10 rounded-lg p-6">
                <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Job Application Tracking</h3>
                <p className="text-gray-300">
                  Keep track of your job applications, status, and follow-ups in one centralized dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold cosmic-text-gradient">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Choose the plan that fits your needs. All plans include our core features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <Card className="cosmic-card border border-white/10 relative flex flex-col h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Basic</CardTitle>
                  <CardDescription>For individuals just getting started</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">Free</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pb-6">
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>1 Resume Creation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Basic AI Resume Tips</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>10 Job Matches Per Month</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Access to Basic Templates</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-0">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => handleSelectPlan("Basic")}
                  >
                    Get Started Free
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Pro Plan */}
              <Card className="cosmic-card border-2 border-blue-400/50 relative flex flex-col h-full">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Pro</CardTitle>
                  <CardDescription>For individuals actively job hunting</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$15</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pb-6">
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Unlimited Resume Creations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced AI Resume Suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Unlimited Job Matches</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Resume Tailoring for Each Job</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Application Tracking Dashboard</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-0">
                  <Button 
                    className="w-full cosmic-btn-glow"
                    onClick={() => handleSelectPlan("Pro")}
                  >
                    Start Pro Plan
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Business Plan */}
              <Card className="cosmic-card border border-white/10 relative flex flex-col h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Enterprise</CardTitle>
                  <CardDescription>For career professionals and teams</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pb-6">
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>All Pro Features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Premium Resume Templates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Priority AI Assistance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced Career Insights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 shrink-0 mt-0.5" />
                      <span>Team Collaboration Features</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-0">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => handleSelectPlan("Enterprise")}
                  >
                    Start Enterprise Plan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold cosmic-text-gradient">
                What Our Users Say
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Join thousands of professionals who have accelerated their careers with AIreHire
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="cosmic-card border border-white/10 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold">JM</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">James Mitchell</h4>
                    <p className="text-sm text-gray-400">Software Developer</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "The AI resume tailoring feature is a game-changer. I saw an immediate increase in interview callbacks after optimizing my resume for each job application."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              
              <div className="cosmic-card border border-white/10 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold">SR</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah Rodriguez</h4>
                    <p className="text-sm text-gray-400">Marketing Manager</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "The job matching algorithm found opportunities that perfectly aligned with my skills and career goals. I landed my dream job within a month!"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="cosmic-card border border-white/10 rounded-lg p-8 text-center bg-gradient-to-r from-blue-900/40 to-purple-900/40">
              <h2 className="text-3xl font-bold mb-4 cosmic-text-gradient">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have transformed their job search with AIreHire's AI-powered tools.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg cosmic-btn-glow"
                  onClick={() => setIsRegisterOpen(true)}
                >
                  Get Started Today <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-10 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 cosmic-text-gradient">AIreHire</h3>
              <p className="text-gray-400">
                AI-powered career development platform that transforms professional growth through intelligent tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="flex items-center mb-2">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-400">support@airehire.com</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} AIreHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}