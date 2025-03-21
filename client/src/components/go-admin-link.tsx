import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function GoAdminLink() {
  const { user } = useAuth();
  
  // Only render if user is logged in
  if (!user) return null;
  
  return (
    <Link href="/admin-access">
      <Button 
        variant="outline" 
        className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur"
      >
        Admin Dashboard
      </Button>
    </Link>
  );
}