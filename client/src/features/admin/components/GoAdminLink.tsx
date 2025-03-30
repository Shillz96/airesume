import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

/**
 * GoAdminLink component displays a link to the admin dashboard
 * Only renders for users with admin privileges
 */
export default function GoAdminLink() {
  const { user } = useAuth();
  
  // Only render if user is logged in and is an admin
  if (!user || !user.isAdmin) return null;
  
  return (
    <Link href="/admin-access">
      <a className="inline-block">
        <Button 
          variant="outline" 
          className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur"
        >
          Admin Dashboard
        </Button>
      </a>
    </Link>
  );
}