import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export default function NotFound() {
  return (
    <>
      {/* Using global CosmicBackground from App.tsx */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl -mt-4 pb-10 min-h-screen relative z-10 cosmic-error-page">
        <div className="z-10 relative max-w-md mx-auto text-center">
          <div className="cosmic-error-code">404</div>
          
          <Card className="p-8 mb-8 border-white/10">
            <CardHeader className="p-0 pb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <CardTitle className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Page Not Found</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-6">
              <CardDescription className="text-gray-300 mb-6">
                The page you're looking for doesn't exist or has been moved to another location.
              </CardDescription>
              <Link href="/">
                <Button className="bg-[hsl(221.2,83.2%,53.3%)] hover:bg-[hsl(221.2,83.2%,43.3%)] text-white">
                  <Home className="mr-2 h-4 w-4" /> Return Home
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} AIreHire • AI-Powered Resume & Job Platform
          </div>
        </div>
      </div>
    </>
  );
}
