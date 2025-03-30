import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Form schemas
const loginSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'register';
}

export default function AuthDialog({ isOpen, onOpenChange, defaultTab = 'login' }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const { loginMutation, registerMutation } = useAuth();
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    await loginMutation.mutateAsync(values);
    if (!loginMutation.isError) {
      onOpenChange(false);
    }
  }
  
  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    const { confirmPassword, ...registerData } = values;
    await registerMutation.mutateAsync(registerData);
    if (!registerMutation.isError) {
      onOpenChange(false);
    }
  }
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md mx-auto">
        <Card className="solid-card border-white/10 shadow-xl">
          <div className="absolute right-4 top-4">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1 inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          
          <CardHeader>
            <CardTitle className="text-xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent no-blur">
              {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
            </CardTitle>
          </CardHeader>
          
          <div className="flex border-b border-border mb-4">
            <button
              className={cn(
                "flex-1 px-4 py-2 text-center text-sm font-medium no-blur",
                activeTab === 'login'
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={cn(
                "flex-1 px-4 py-2 text-center text-sm font-medium no-blur",
                activeTab === 'register'
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          
          <CardContent>
            {activeTab === 'login' ? (
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
                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Enter your username" className="pl-9" {...field} />
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
                            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Enter your password" 
                              className="pl-9 pr-10" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full"
                    variant="default"
                  >
                    {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>
                  
                  {loginMutation.isError && (
                     <p className="text-sm font-medium text-destructive text-center pt-2">
                       {loginMutation.error?.message || 'Invalid username or password'}
                     </p>
                  )}
                </form>
              </Form>
            ) : (
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
                             <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                             <Input placeholder="Choose a username" className="pl-9" {...field} />
                           </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <div className="relative">
                             <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                             <Input type="email" placeholder="Enter your email" className="pl-9" {...field} />
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
                             <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                             <Input 
                               type={showPassword ? "text" : "password"} 
                               placeholder="Create a password" 
                               className="pl-9 pr-10" 
                               {...field} 
                             />
                             <button
                               type="button"
                               onClick={() => setShowPassword(!showPassword)}
                               className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                            >
                               {showPassword ? (
                                 <EyeOff className="h-4 w-4" />
                               ) : (
                                 <Eye className="h-4 w-4" />
                               )}
                             </button>
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
                             <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                             <Input type={showPassword ? "text" : "password"} placeholder="Confirm password" className="pl-9" {...field} />
                           </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full"
                    variant="default"
                  >
                     {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     Register
                  </Button>
                  
                  {registerMutation.isError && (
                     <p className="text-sm font-medium text-destructive text-center pt-2">
                       {registerMutation.error?.message || 'Registration failed. Please try again.'}
                     </p>
                  )}
                </form>
              </Form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="text-xs text-center text-muted-foreground">
              {activeTab === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setActiveTab('register')}
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}