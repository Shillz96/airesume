import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/ui/core/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/ui/core/Card';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

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
        <Card className="cosmic-card border-white/10 shadow-xl">
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
            <CardTitle className="text-xl text-center cosmic-text-gradient">
              {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
            </CardTitle>
          </CardHeader>
          
          <div className="flex border-b border-border mb-4">
            <button
              className={cn(
                "flex-1 px-4 py-2 text-center text-sm font-medium",
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
                "flex-1 px-4 py-2 text-center text-sm font-medium",
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
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-username" className="text-sm font-medium">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      id="login-username"
                      type="text"
                      className={cn(
                        "w-full pl-10 py-2 rounded-md border bg-background",
                        "focus:ring-1 focus:ring-primary focus:border-primary",
                        loginForm.formState.errors.username 
                          ? "border-destructive focus:border-destructive focus:ring-destructive" 
                          : "border-border"
                      )}
                      {...loginForm.register('username')}
                    />
                  </div>
                  {loginForm.formState.errors.username && (
                    <p className="text-xs text-destructive">{loginForm.formState.errors.username.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      className={cn(
                        "w-full pl-10 pr-10 py-2 rounded-md border bg-background",
                        "focus:ring-1 focus:ring-primary focus:border-primary",
                        loginForm.formState.errors.password 
                          ? "border-destructive focus:border-destructive focus:ring-destructive" 
                          : "border-border"
                      )}
                      {...loginForm.register('password')}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  isLoading={loginMutation.isPending}
                  fullWidth
                  variant="cosmic"
                  glow="cosmic"
                  className="cosmic-btn-glow"
                >
                  Login
                </Button>
                
                {loginMutation.isError && (
                  <p className="text-sm text-destructive text-center">
                    {loginMutation.error?.message || 'Invalid username or password'}
                  </p>
                )}
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="register-username" className="text-sm font-medium">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      id="register-username"
                      type="text"
                      className={cn(
                        "w-full pl-10 py-2 rounded-md border bg-background",
                        "focus:ring-1 focus:ring-primary focus:border-primary",
                        registerForm.formState.errors.username 
                          ? "border-destructive focus:border-destructive focus:ring-destructive" 
                          : "border-border"
                      )}
                      {...registerForm.register('username')}
                    />
                  </div>
                  {registerForm.formState.errors.username && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.username.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      id="register-email"
                      type="email"
                      className={cn(
                        "w-full pl-10 py-2 rounded-md border bg-background",
                        "focus:ring-1 focus:ring-primary focus:border-primary",
                        registerForm.formState.errors.email 
                          ? "border-destructive focus:border-destructive focus:ring-destructive" 
                          : "border-border"
                      )}
                      {...registerForm.register('email')}
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      className={cn(
                        "w-full pl-10 pr-10 py-2 rounded-md border bg-background",
                        "focus:ring-1 focus:ring-primary focus:border-primary",
                        registerForm.formState.errors.password 
                          ? "border-destructive focus:border-destructive focus:ring-destructive" 
                          : "border-border"
                      )}
                      {...registerForm.register('password')}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      id="register-confirm-password"
                      type={showPassword ? "text" : "password"}
                      className={cn(
                        "w-full pl-10 py-2 rounded-md border bg-background",
                        "focus:ring-1 focus:ring-primary focus:border-primary",
                        registerForm.formState.errors.confirmPassword 
                          ? "border-destructive focus:border-destructive focus:ring-destructive" 
                          : "border-border"
                      )}
                      {...registerForm.register('confirmPassword')}
                    />
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  isLoading={registerMutation.isPending}
                  fullWidth
                  variant="cosmic"
                  glow="cosmic"
                  className="cosmic-btn-glow"
                >
                  Register
                </Button>
                
                {registerMutation.isError && (
                  <p className="text-sm text-destructive text-center">
                    {registerMutation.error?.message || 'Registration failed. Please try again.'}
                  </p>
                )}
              </form>
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