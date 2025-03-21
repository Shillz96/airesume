import React from 'react';
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function GoAdminLink() {
  const [, setLocation] = useLocation();
  
  const goToAdminPage = () => {
    // We need to handle this manually since the router seems to have issues
    window.location.href = "/admin-access";
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={goToAdminPage}
      className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur"
    >
      Admin Access
    </Button>
  );
}