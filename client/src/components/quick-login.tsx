import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function QuickLogin() {
  const [isOpen, setIsOpen] = useState(true); // Open by default
  const [username, setUsername] = useState("demouser5647");
  const [password, setPassword] = useState("password123");
  const { toast } = useToast();
  const { loginMutation, user } = useAuth();
  
  // Check if already logged in
  if (user) {
    return null; // Don't show login button if already logged in
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Use the direct admin login endpoint
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Admin login failed');
      }
      
      const user = await response.json();
      
      // Update query client with the user data
      queryClient.setQueryData(["/api/user"], user);
      
      setIsOpen(false);
      toast({
        title: "Login successful",
        description: "You are now logged in as the admin user",
      });
      
      // Refresh the page to update UI components that depend on authentication
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Admin user not found or server error",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          className="fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur"
        >
          Login as Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login as Admin</DialogTitle>
          <DialogDescription>
            Use your admin credentials to log in and access all premium features.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="demouser5647"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <p className="text-xs text-muted-foreground">
              Default password: password123
            </p>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}