import { Button } from "@/components/ui/button";
import { 
  Save, 
  Plus, 
  Download, 
  Mail, 
  LogIn, 
  Trash2, 
  Loader2, 
  ArrowRight,
  Heart,
  Check,
  Trash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * Guide component that demonstrates the unified button styles
 * This can be imported into any page for reference
 */
export default function ButtonGuide() {
  return (
    <Card className="space-y-6 p-6 bg-black/30 backdrop-blur-md rounded-lg border border-white/10">
      <CardHeader className="p-0">
        <CardTitle>Unified Button Style Guide</CardTitle>
        <CardDescription>Use these consistent button styles throughout the application.</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-2 text-white">Primary Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for primary actions, like submitting forms or confirming an important action</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="default">
              <Heart className="mr-2 h-4 w-4" /> Default Primary
            </Button>
            <Button variant="default" size="sm">Small Primary</Button>
            <Button variant="default" size="lg">Large Primary</Button>
            <Button variant="default" disabled>Disabled Primary</Button>
            <Button variant="default" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium mb-2 text-white">Secondary Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for secondary actions, like alternative options</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="secondary">
              <ArrowRight className="mr-2 h-4 w-4" /> Secondary
            </Button>
            <Button variant="secondary" size="sm">Small Secondary</Button>
            <Button variant="secondary" disabled>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Loading...
            </Button>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium mb-2 text-white">Outline Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for less emphasized actions or in card interfaces</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline">
              <Trash className="mr-2 h-4 w-4" /> Outline
            </Button>
            <Button variant="outline" size="sm">Small Outline</Button>
            <Button variant="outline" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Loading...
            </Button>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium mb-2 text-white">Ghost Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for subtle actions or in tight spaces</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="ghost">
              <Check className="mr-2 h-4 w-4" /> Ghost
            </Button>
            <Button variant="ghost" size="sm">Small Ghost</Button>
            <Button variant="ghost" disabled>Disabled Ghost</Button>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium mb-2 text-white">Destructive Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for dangerous actions like deletion</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="destructive">
               <Trash className="mr-2 h-4 w-4" /> Destructive
            </Button>
            <Button variant="destructive" size="sm">Small Destructive</Button>
            <Button variant="destructive" disabled>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Loading...
            </Button>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <h3 className="text-2xl font-bold mb-2">Cosmic Buttons</h3>
          <p className="text-sm text-muted-foreground mb-3">Use for cosmic themed actions</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="default" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
            <Button variant="default" size="sm">Small Cosmic</Button>
            <Button variant="default" size="lg">Large Cosmic</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}