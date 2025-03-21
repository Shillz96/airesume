import React from 'react';
import { Button } from "@/components/ui/button";

export default function GoAdminLink() {
  const goToAdminPage = () => {
    // Use our simple direct admin page instead of the React router
    window.location.href = "/direct-admin";
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