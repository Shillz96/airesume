import { Button } from "@/components/unified";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/unified";
import { Text } from "@/components/unified";

/**
 * Guide component that demonstrates the unified button styles
 * This can be imported into any page for reference
 */
export default function ButtonGuide() {
  return (
    <Card variant="glass" className="space-y-6 p-6">
      <CardHeader>
        <CardTitle>Unified Button Style Guide</CardTitle>
        <CardDescription>Use these consistent button styles throughout the application.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <Text variant="h3" className="mb-2">Primary Buttons</Text>
          <Text variant="body2" color="muted" className="mb-3">Use for primary actions, like submitting forms or confirming an important action</Text>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">
              Primary Button
            </Button>
            <Button 
              variant="primary" 
              iconLeft={<Save />}
            >
              Save Resume
            </Button>
            <Button 
              variant="primary" 
              iconRight={<ArrowRight />}
            >
              Next Step
            </Button>
            <Button 
              variant="primary" 
              isLoading 
              loadingText="Saving..."
            >
              Save Resume
            </Button>
          </div>
        </div>

        <div>
          <Text variant="h3" className="mb-2">Secondary Buttons</Text>
          <Text variant="body2" color="muted" className="mb-3">Use for secondary actions, like alternative options</Text>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary">
              Secondary Button
            </Button>
            <Button 
              variant="secondary" 
              iconLeft={<Download />}
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
          <Text variant="h3" className="mb-2">Outline Buttons</Text>
          <Text variant="body2" color="muted" className="mb-3">Use for less emphasized actions or in card interfaces</Text>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              Outline Button
            </Button>
            <Button 
              variant="outline" 
              iconLeft={<Plus />}
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
          <Text variant="h3" className="mb-2">Ghost Buttons</Text>
          <Text variant="body2" color="muted" className="mb-3">Use for subtle actions or in tight spaces</Text>
          <div className="flex flex-wrap gap-4">
            <Button variant="ghost">
              Ghost Button
            </Button>
            <Button 
              variant="ghost" 
              iconLeft={<Mail />}
            >
              Contact Support
            </Button>
            <Button variant="ghost" iconLeft={<LogIn />}>
              Sign In
            </Button>
          </div>
        </div>

        <div>
          <Text variant="h3" className="mb-2">Destructive Buttons</Text>
          <Text variant="body2" color="muted" className="mb-3">Use for dangerous actions like deletion</Text>
          <div className="flex flex-wrap gap-4">
            <Button variant="destructive">
              Destructive Button
            </Button>
            <Button 
              variant="destructive" 
              iconLeft={<Trash2 />}
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
          <Text variant="h3" className="mb-2">Cosmic Buttons</Text>
          <Text variant="body2" color="muted" className="mb-3">Use for cosmic themed actions</Text>
          <div className="flex flex-wrap gap-4">
            <Button variant="cosmic">
              Cosmic Button
            </Button>
            <Button 
              variant="cosmic" 
              iconLeft={<Save />}
            >
              Save Resume
            </Button>
            <Button 
              variant="cosmic" 
              isLoading 
              loadingText="Loading..."
            >
              Loading
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}