import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
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
import { CosmicButton } from "@/components/custom/CosmicButton";
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
import { Badge } from "@/components/ui/badge";

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
      // Remove confirmPassword and plan as they're not part of the API schema
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

  // Animation for text elements (no starfield - using global CosmicBackground)
  useEffect(() => {

    // GSAP animations
    if (titleRef.current && subtitleRef.current && ctaRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
      gsap.fromTo(subtitleRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, delay: 0.3 });
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, delay: 0.6 });
    }

    // Feature animations on scroll with modified approach to prevent circular references
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll('.feature-card');
      
      // Use a simple animation without ScrollTrigger to avoid circular references
      gsap.fromTo(features, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, delay: 1.0 }
      );
      
      // Optional: Add scroll-based reveal with IntersectionObserver instead of ScrollTrigger
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, { opacity: 1, y: 0, duration: 0.5 });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      features.forEach(feature => {
        observer.observe(feature);
      });
    }

    // No background cleanup needed since we're using the global CosmicBackground
    return () => {
      // No cleanup needed for removed star animations
    };
  }, []);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
  };

  // Handle the "Try Free" buttons in pricing cards
  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    registerForm.setValue("plan", plan);
    setIsRegisterOpen(true);
  };

  // Button event listener effect
  useEffect(() => {
    const loginBtn = document.getElementById("login-button");
    const registerBtn = document.getElementById("register-button");

    if (loginBtn) {
      loginBtn.addEventListener("click", handleLoginClick);
    }

    if (registerBtn) {
      registerBtn.addEventListener("click", handleRegisterClick);
    }

    return () => {
      if (loginBtn) {
        loginBtn.removeEventListener("click", handleLoginClick);
      }

      if (registerBtn) {
        registerBtn.removeEventListener("click", handleRegisterClick);
      }
    };
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10">
      {/* We're letting App.tsx handle the background */}

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="solid-card sm:max-w-md">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Log In</DialogTitle>
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsLoginOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Log In
                </Button>
              </DialogFooter>
            </form>
          </Form>
          <DialogFooter className="mt-4 text-center flex-col sm:flex-col sm:space-y-2">
            <div className="text-sm">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-400 hover:text-blue-300"
                onClick={() => {
                  setIsLoginOpen(false);
                  setIsRegisterOpen(true);
                }}
              >
                Sign up
              </Button>
            </div>
            <div className="text-sm">
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-400 hover:text-blue-300"
                onClick={() => {
                  setIsLoginOpen(false);
                  showGuestModal();
                }}
              >
                Continue as guest
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="solid-card sm:max-w-md">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Create Account</DialogTitle>
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
                        <Input placeholder="Choose a username" className="pl-8 no-blur" {...field} />
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
                        <Input type="password" placeholder="Create a password" className="pl-8 no-blur" {...field} />
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
                        <Input type="password" placeholder="Confirm your password" className="pl-8 no-blur" {...field} />
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" className="w-full mt-2" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Sign Up
                </Button>
              </DialogFooter>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-400 hover:text-blue-300"
              onClick={() => {
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
              }}
            >
              Log in
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="pt-24 pb-10 mx-auto relative z-10">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 text-center">
          <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Land Your Dream Job Faster
          </h1>
          <p ref={subtitleRef} className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Leverage AI to craft the perfect resume, find tailored job openings, and get expert career advice. All in one place.
          </p>
          <div ref={ctaRef} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* Use CosmicButton component? Assuming it provides the intended style */}
            <CosmicButton 
              className="px-8 py-6 text-lg"
              onClick={handleRegisterClick} 
              id="register-button"
            >
              Start Building for Free <ArrowRight className="ml-2 h-5 w-5" />
            </CosmicButton>
            <Button variant="ghost" onClick={handleLoginClick} id="login-button" className="text-muted-foreground hover:text-primary">
              Already have an account? Log in
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Why Choose AllHire?</h2>
          <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ /* Feature data array */
              { icon: FileText, title: "AI Resume Builder", desc: "Craft tailored resumes that bypass ATS and impress recruiters instantly." },
              { icon: Briefcase, title: "Smart Job Matching", desc: "Get matched with jobs that fit your skills and career goals perfectly." },
              { icon: Star, title: "Personalized Career Advice", desc: "Receive AI-driven insights and guidance to navigate your career path." },
              { icon: Sparkles, title: "Cover Letter Generator", desc: "Generate compelling cover letters customized for each application." },
              { icon: Search, title: "Intelligent Job Search", desc: "Filter and search through millions of jobs with advanced AI criteria." },
              { icon: Bot, title: "Interview Preparation", desc: "Practice common interview questions and get AI feedback on your answers." },
            ].map((feature, index) => (
              <Card key={index} className="feature-card p-6">
                <CardHeader className="p-0 mb-4">
                  <div className="bg-primary/10 rounded-full p-3 inline-block mb-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 sm:py-24">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Simple Pricing for Every Stage</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pricing Card 1 (Free) */}
            <Card className="solid-card p-6">
              <CardHeader className="p-0 mb-4 space-y-2">
                <CardTitle className="text-xl font-bold no-blur">Free</CardTitle>
                <div className="no-blur">
                  <span className="text-4xl font-bold mb-2">$0</span>
                  <span className="text-muted-foreground ml-1">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-2 no-blur">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Basic Resume Builder</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Limited Job Search</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">5 AI-Powered Job Matches</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 mt-6">
                <Button 
                  className="w-full"
                  variant="default"
                  onClick={() => handleSelectPlan("free")}
                >
                  Try Free
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pro Plan with Special Styling */}
            <Card className="solid-card p-6 border-primary/50 ring-2 ring-primary/30">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 no-blur">Most Popular</Badge>
              <CardHeader className="p-0 mb-4 space-y-2">
                <CardTitle className="text-xl font-bold no-blur">Pro</CardTitle>
                <div className="no-blur">
                  <span className="text-4xl font-bold mb-2">$19</span>
                  <span className="text-muted-foreground ml-1">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-2 no-blur">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Advanced Resume Builder</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Unlimited Job Search</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">50 AI-Powered Job Matches</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">AI Interview Preparation</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 mt-6">
                <Button 
                  className="w-full"
                  variant="default"
                  onClick={() => handleSelectPlan("pro")}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="solid-card p-6">
              <CardHeader className="p-0 mb-4 space-y-2">
                <CardTitle className="text-xl font-bold no-blur">Premium</CardTitle>
                <div className="no-blur">
                  <span className="text-4xl font-bold mb-2">$39</span>
                  <span className="text-muted-foreground ml-1">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-2 no-blur">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Premium Resume Templates</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Unlimited AI Job Matches</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Career Coaching</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Priority Support</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 mt-6">
                <Button 
                  className="w-full"
                  variant="default"
                  onClick={() => handleSelectPlan("premium")}
                >
                  Get Premium
                </Button>
              </CardFooter>
            </Card>

            {/* Pricing Card 3 (Enterprise/Custom) */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-semibold mb-2">Enterprise</CardTitle>
                <p className="text-4xl font-bold">Custom</p>
              </CardHeader>
              <CardContent className="p-0 mb-6">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Everything in Pro</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Team Management Tools</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> API Access</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Dedicated Support Manager</li>
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {/* Link to contact form or page */}}
                >
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                What Our Users Say
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Join thousands of professionals who have accelerated their careers with AIreHire
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Testimonial 1 */}
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

              {/* Testimonial 2 */}
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

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24">
          <Card 
            className="p-8 text-center bg-gradient-to-r from-blue-900/40 to-purple-900/40"
          > 
            <CardHeader className="p-0 mb-4">
              <Rocket className="h-10 w-10 mx-auto mb-4 text-primary" />
              <CardTitle className="text-3xl font-bold mb-2">Ready to Elevate Your Career?</CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
                Join thousands of job seekers using AllHire AI to land their dream jobs faster.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg"
                onClick={() => setIsRegisterOpen(true)}
              >
                Get Started Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AIreHire</h3>
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
          <div className="mt-8  border-t border-white/10 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} AIreHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}