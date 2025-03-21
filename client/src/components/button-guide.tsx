import { CosmicButton } from "@/components/cosmic-button";
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
 * Guide component that demonstrates the various cosmic button styles
 * This can be imported into any page for reference
 */
export default function ButtonGuide() {
  return (
    <div className="space-y-6 p-6 bg-black/30 backdrop-blur-md rounded-lg border border-white/10">
      <div>
        <h2 className="text-xl font-bold mb-2 text-white">Cosmic Button Style Guide</h2>
        <p className="text-gray-300 mb-4">Use these consistent button styles throughout the application.</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Primary Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for primary actions, like submitting forms or confirming an important action</p>
          <div className="flex flex-wrap gap-4">
            <CosmicButton variant="primary">
              Primary Button
            </CosmicButton>
            <CosmicButton 
              variant="primary" 
              iconLeft={<Save />}
            >
              Save Resume
            </CosmicButton>
            <CosmicButton 
              variant="primary" 
              iconRight={<ArrowRight />}
            >
              Next Step
            </CosmicButton>
            <CosmicButton 
              variant="primary" 
              isLoading 
              loadingText="Saving..."
            >
              Save Resume
            </CosmicButton>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Secondary Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for secondary actions, like alternative options</p>
          <div className="flex flex-wrap gap-4">
            <CosmicButton variant="secondary">
              Secondary Button
            </CosmicButton>
            <CosmicButton 
              variant="secondary" 
              iconLeft={<Download />}
            >
              Download PDF
            </CosmicButton>
            <CosmicButton 
              variant="secondary" 
              isLoading 
              loadingText="Loading..."
            >
              Load Resume
            </CosmicButton>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Outline Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for less emphasized actions or in card interfaces</p>
          <div className="flex flex-wrap gap-4">
            <CosmicButton variant="outline">
              Outline Button
            </CosmicButton>
            <CosmicButton 
              variant="outline" 
              iconLeft={<Plus />}
            >
              Add Section
            </CosmicButton>
            <CosmicButton 
              variant="outline" 
              isLoading 
              loadingText="Generating..."
            >
              Generate AI Content
            </CosmicButton>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Ghost Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for subtle actions or in tight spaces</p>
          <div className="flex flex-wrap gap-4">
            <CosmicButton variant="ghost">
              Ghost Button
            </CosmicButton>
            <CosmicButton 
              variant="ghost" 
              iconLeft={<Mail />}
            >
              Contact Support
            </CosmicButton>
            <CosmicButton variant="ghost" iconLeft={<LogIn />}>
              Sign In
            </CosmicButton>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Destructive Buttons</h3>
          <p className="text-gray-400 text-sm mb-3">Use for dangerous actions like deletion</p>
          <div className="flex flex-wrap gap-4">
            <CosmicButton variant="destructive">
              Destructive Button
            </CosmicButton>
            <CosmicButton 
              variant="destructive" 
              iconLeft={<Trash2 />}
            >
              Delete Resume
            </CosmicButton>
            <CosmicButton 
              variant="destructive" 
              isLoading
              loadingText="Deleting..."
            >
              Delete Account
            </CosmicButton>
          </div>
        </div>
      </div>
    </div>
  );
}