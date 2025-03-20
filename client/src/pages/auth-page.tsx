import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { FileText, Briefcase, User, Rocket, Database, Cpu } from "lucide-react";
import { z } from "zod";
import gsap from "gsap";

export default function AuthPage() {
  const { user, registerMutation, loginMutation } = useAuth();
  
  // Redirect if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const loginSchema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const registerSchema = insertUserSchema.extend({
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

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
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
  }

  // Create refs for animations
  const featureIconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const authPanelRef = useRef<HTMLDivElement>(null);
  
  // Animation effects
  useEffect(() => {
    // Animate feature icons
    featureIconsRef.current.forEach((icon, index) => {
      if (!icon) return;
      
      gsap.fromTo(
        icon,
        { 
          y: 20, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          delay: 0.2 + (index * 0.1),
          ease: "power2.out" 
        }
      );
    });
    
    // Animate auth panel
    if (authPanelRef.current) {
      gsap.fromTo(
        authPanelRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);
  
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[hsl(219,90%,10%)] to-[hsl(260,90%,10%)] text-white">
      {/* Starfield Background */}
      <div className="starfield absolute inset-0 pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="star absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.15,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Top Navigation */}
      <nav className="cosmic-navbar py-4 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight cosmic-text-gradient">AIreHire</h1>
            <p className="text-sm text-gray-300">Your AI-powered resume builder and job finder</p>
          </div>
          <div>
            <Button
              onClick={() => window.location.href = "/?guest=true"}
              variant="outline"
              className="border-[hsl(221.2,83.2%,53.3%)] text-[hsl(221.2,83.2%,53.3%)] mr-3"
            >
              Try Now
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="flex flex-col lg:flex-row relative z-10 min-h-[calc(100vh-80px)] items-center">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24" ref={authPanelRef}>
          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 border border-white/20">
                <TabsTrigger 
                  value="login" 
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card className="cosmic-card">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-white text-2xl">Login to your account</CardTitle>
                    <CardDescription className="text-gray-300 text-base">
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200 text-base">Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="johndoe" 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 py-6"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200 text-base">Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 py-6"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <div className="flex space-x-3 pt-2">
                          <Button 
                            type="submit" 
                            className="flex-1 bg-[hsl(221.2,83.2%,53.3%)] hover:bg-[hsl(221.2,83.2%,43.3%)] text-white text-base py-6" 
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? 'Logging in...' : 'Login'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-[hsl(221.2,83.2%,53.3%)] text-[hsl(221.2,83.2%,53.3%)] text-base py-6 login-guest-button"
                            onClick={() => window.location.href = "/?guest=true"}
                          >
                            Try Now
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card className="cosmic-card">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-white text-2xl">Create an account</CardTitle>
                    <CardDescription className="text-gray-300 text-base">
                      Join AIreHire to create professional resumes and find jobs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200 text-base">Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="johndoe" 
                                  {...field}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 py-6"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200 text-base">Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 py-6"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200 text-base">Confirm Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 py-6"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <div className="flex space-x-3 pt-2">
                          <Button 
                            type="submit" 
                            className="flex-1 bg-[hsl(221.2,83.2%,53.3%)] hover:bg-[hsl(221.2,83.2%,43.3%)] text-white text-base py-6" 
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? 'Creating account...' : 'Register'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-[hsl(221.2,83.2%,53.3%)] text-[hsl(221.2,83.2%,53.3%)] text-base py-6 register-guest-button"
                            onClick={() => window.location.href = "/?guest=true"}
                          >
                            Try Now
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="hidden lg:block relative lg:flex-1 h-full">
          <div className="flex flex-col items-center justify-center h-full p-16 text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 cosmic-text-gradient">Navigate Your Career</h2>
            
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg mb-8">
              <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[hsl(221.2,83.2%,53.3%)]">10,000+</p>
                <p className="text-sm text-gray-300">Users Helped</p>
              </div>
              <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[hsl(221.2,83.2%,53.3%)]">95%</p>
                <p className="text-sm text-gray-300">Resume Score</p>
              </div>
              <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[hsl(221.2,83.2%,53.3%)]">50,000+</p>
                <p className="text-sm text-gray-300">Job Matches</p>
              </div>
            </div>
            
            {/* Testimonial */}
            <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg mb-8 max-w-lg w-full">
              <p className="text-sm text-gray-300 italic">
                "AIreHire helped me land my dream job in just two weeks! The AI resume builder made my application stand out."
              </p>
              <p className="text-sm font-medium text-white mt-2">
                — Sarah M., Software Engineer
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 max-w-lg w-full">
              <div className="flex items-start space-x-4" ref={el => featureIconsRef.current[0] = el}>
                <div className="bg-[hsl(210,100%,60%)] bg-opacity-20 p-3 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <Cpu size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">AI-Powered Resume Builder</h3>
                  <p className="text-gray-300">Create professional resumes with AI suggestions that highlight your strengths.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" ref={el => featureIconsRef.current[1] = el}>
                <div className="bg-[hsl(260,100%,60%)] bg-opacity-20 p-3 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Smart Job Matching</h3>
                  <p className="text-gray-300">Our AI matches your skills with job opportunities for the perfect career fit.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" ref={el => featureIconsRef.current[2] = el}>
                <div className="bg-[hsl(170,100%,60%)] bg-opacity-20 p-3 rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.5)]">
                  <Rocket size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Career Navigation</h3>
                  <p className="text-gray-300">Track applications, manage multiple resumes, and navigate your career journey.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}