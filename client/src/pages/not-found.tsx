import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <>
      {/* Using global CosmicBackground from App.tsx */}
      <div className="cosmic-error-page min-h-screen relative z-10">
        <div className="z-10 relative max-w-md mx-auto text-center">
          <div className="cosmic-error-code">404</div>
          
          <div className="cosmic-card p-8 mb-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h1 className="text-2xl font-bold mb-4 cosmic-text-gradient">Page Not Found</h1>
            
            <p className="text-gray-300 mb-6">
              The page you're looking for doesn't exist or has been moved to another location.
            </p>
            
            <Link href="/">
              <Button className="bg-[hsl(221.2,83.2%,53.3%)] hover:bg-[hsl(221.2,83.2%,43.3%)] text-white">
                <Home className="mr-2 h-4 w-4" /> Return Home
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} AIreHire • AI-Powered Resume & Job Platform
          </div>
        </div>
      </div>
    </>
  );
}
