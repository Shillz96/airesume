/**
 * COMPONENT MIGRATED: This component has been moved to features/auth/components/AuthDialog.tsx
 * Please use the new component from the auth feature directory
 * This file will be removed in a future update
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema } from "@shared/schema";

// Login schema
const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

// Register schema extends insertUserSchema with password confirmation
const registerSchema = insertUserSchema.extend({
  passwordConfirm: z.string().min(6, {
    message: "Password confirmation must be at least 6 characters long",
  }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'register';
}

export default function AuthDialog({ isOpen, onOpenChange, defaultTab = 'login' }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const { toast } = useToast();
  const { loginMutation, registerMutation, user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // If the user is logged in, close the dialog
    if (user && isOpen) {
      onOpenChange(false);
      navigate('/dashboard');
    }
  }, [user, isOpen, onOpenChange, navigate]);

  // Set up login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Set up register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirm: "",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await loginMutation.mutateAsync(values);
      // Dialog will close automatically due to useEffect
    } catch (error) {
      // Error is handled by mutation
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    try {
      // Remove passwordConfirm from the data sent to the server
      const { passwordConfirm, ...registerData } = values;
      await registerMutation.mutateAsync(registerData);
      // Dialog will close automatically due to useEffect
    } catch (error) {
      // Error is handled by mutation
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] cosmic-card border-white/10">
        <DialogHeader>
          <DialogTitle className="cosmic-text-gradient text-2xl">
            Welcome to AIreHire
          </DialogTitle>
          <DialogDescription>
            Your AI-powered career development platform
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} className="w-full" onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 pt-1">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          {...field} 
                          autoComplete="username"
                        />
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
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 pt-1">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a username" 
                          {...field} 
                          autoComplete="username"
                        />
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
                        <Input 
                          type="password" 
                          placeholder="Create a password" 
                          {...field} 
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your password" 
                          {...field} 
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-xs text-gray-400">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </div>
      </DialogContent>
    </Dialog>
  );
}