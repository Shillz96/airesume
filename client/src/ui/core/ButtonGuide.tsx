import { Button } from "@/ui/core/Button";
import { 
  Save, 
  Plus, 
  Download, 
  Mail, 
  LogIn, 
  Trash2, 
  Loader2, 
  ArrowRight 
} from "lucide-react";

/**
 * Guide component that demonstrates the various button styles
 * This can be imported into any page for reference
 * 
 * Uses the unified Button component from ui/core/Button.tsx
 */
export default function ButtonGuide() {
  return (
    <div className="space-y-6 p-6 bg-black/30 backdrop-blur-md rounded-lg border border-white/10">
      <div>
        <h2 className="text-xl font-bold mb-2 text-white">Button Style Guide</h2>
        <p className="text-gray-300 mb-4">Use these consistent button styles throughout the application.</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Primary Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for primary actions, like submitting forms or confirming an important action</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">
              Primary Button
            </Button>
            <Button 
              variant="default" 
              iconLeft={<Save className="mr-2 h-4 w-4" />}
            >
              Save Resume
            </Button>
            <Button 
              variant="default" 
              iconRight={<ArrowRight className="ml-2 h-4 w-4" />}
            >
              Next Step
            </Button>
            <Button 
              variant="default" 
              isLoading 
              loadingText="Saving..."
            >
              Save Resume
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Secondary Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for secondary actions, like alternative options</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary">
              Secondary Button
            </Button>
            <Button 
              variant="secondary" 
              iconLeft={<Download className="mr-2 h-4 w-4" />}
            >
              Download PDF
            </Button>
            <Button 
              variant="secondary" 
              isLoading 
              loadingText="Loading..."
            >
              Load Resume
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Outline Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for less emphasized actions or in card interfaces</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              Outline Button
            </Button>
            <Button 
              variant="outline" 
              iconLeft={<Plus className="mr-2 h-4 w-4" />}
            >
              Add Section
            </Button>
            <Button 
              variant="outline" 
              isLoading 
              loadingText="Generating..."
            >
              Generate AI Content
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Ghost Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for subtle actions or in tight spaces</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="ghost">
              Ghost Button
            </Button>
            <Button 
              variant="ghost" 
              iconLeft={<Mail className="mr-2 h-4 w-4" />}
            >
              Contact Support
            </Button>
            <Button variant="ghost" iconLeft={<LogIn className="mr-2 h-4 w-4" />}>
              Sign In
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Destructive Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for dangerous actions like deletion</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="destructive">
              Destructive Button
            </Button>
            <Button 
              variant="destructive" 
              iconLeft={<Trash2 className="mr-2 h-4 w-4" />}
            >
              Delete Resume
            </Button>
            <Button 
              variant="destructive" 
              isLoading
              loadingText="Deleting..."
            >
              Delete Account
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Button Sizes</h3>
          <p className="text-gray-400 text-sm mb-3">Use appropriate sizing based on context</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="default" size="sm">
              Small Button
            </Button>
            <Button variant="default" size="md">
              Default Size
            </Button>
            <Button variant="default" size="lg">
              Large Button
            </Button>
            <Button variant="default" size="sm" iconLeft={<Plus className="mr-2 h-3 w-3" />}>
              Small with Icon
            </Button>
            <Button variant="default" size="lg" iconRight={<ArrowRight className="ml-2 h-5 w-5" />}>
              Large with Icon
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Full Width Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for prominent actions or mobile interfaces</p>
          <div className="space-y-2">
            <Button variant="default" fullWidth>
              Full Width Primary
            </Button>
            <Button variant="secondary" fullWidth>
              Full Width Secondary
            </Button>
            <Button 
              variant="default" 
              fullWidth
              iconLeft={<LogIn className="mr-2 h-4 w-4" />}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}