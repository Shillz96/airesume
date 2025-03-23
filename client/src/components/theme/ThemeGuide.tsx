import React from 'react';
import { ThemeButton } from '@/components/ui/ThemeButton';
import { 
  ThemeCard, 
  ThemeCardHeader, 
  ThemeCardBody, 
  ThemeCardFooter,
  ThemeCardTitle,
  ThemeCardDescription
} from '@/components/ui/ThemeCard';

// Icons for demo purposes
import { 
  ArrowRight, 
  Plus, 
  Star, 
  Settings, 
  User, 
  ChevronRight, 
  Save,
  Trash2
} from 'lucide-react';

/**
 * ThemeGuide component
 * 
 * This component serves as a live demonstration of the unified theme system.
 * It showcases all the button and card variants, as well as their various states.
 * It can be used as a reference for developers implementing new components.
 */
export default function ThemeGuide() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-4">Unified Theme Guide</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A comprehensive guide to the unified theme system components
        </p>
      </div>

      {/* Button Variants Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Button Variants</h2>
        <ThemeCard>
          <ThemeCardBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Primary</p>
              <ThemeButton variant="primary">Primary Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Secondary</p>
              <ThemeButton variant="secondary">Secondary Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Accent</p>
              <ThemeButton variant="accent">Accent Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Destructive</p>
              <ThemeButton variant="destructive">Destructive Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Success</p>
              <ThemeButton variant="success">Success Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Outline</p>
              <ThemeButton variant="outline">Outline Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Ghost</p>
              <ThemeButton variant="ghost">Ghost Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Link</p>
              <ThemeButton variant="link">Link Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Gradient</p>
              <ThemeButton variant="gradient">Gradient Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Gradient Border</p>
              <ThemeButton variant="gradient-border">Gradient Border</ThemeButton>
            </div>
          </ThemeCardBody>
        </ThemeCard>
      </section>

      {/* Button Sizes Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Button Sizes</h2>
        <ThemeCard>
          <ThemeCardBody className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Extra Small (xs)</p>
              <ThemeButton size="xs">Extra Small</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Small (sm)</p>
              <ThemeButton size="sm">Small</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Medium (md - default)</p>
              <ThemeButton size="md">Medium</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Large (lg)</p>
              <ThemeButton size="lg">Large</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Extra Large (xl)</p>
              <ThemeButton size="xl">Extra Large</ThemeButton>
            </div>
          </ThemeCardBody>
        </ThemeCard>
      </section>

      {/* Button States Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Button States</h2>
        <ThemeCard>
          <ThemeCardBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Default</p>
              <ThemeButton>Default State</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Disabled</p>
              <ThemeButton disabled>Disabled State</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Loading</p>
              <ThemeButton isLoading>Loading State</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Loading with Text</p>
              <ThemeButton isLoading loadingText="Loading...">
                Processing
              </ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">With Glow Effect</p>
              <ThemeButton withGlow>Glowing Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Full Width</p>
              <ThemeButton fullWidth>Full Width Button</ThemeButton>
            </div>
          </ThemeCardBody>
        </ThemeCard>
      </section>

      {/* Buttons with Icons Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Buttons with Icons</h2>
        <ThemeCard>
          <ThemeCardBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon Left</p>
              <ThemeButton iconLeft={<Plus size={16} />}>
                Add New
              </ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon Right</p>
              <ThemeButton iconRight={<ArrowRight size={16} />}>
                Next Step
              </ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Both Icons</p>
              <ThemeButton 
                iconLeft={<User size={16} />}
                iconRight={<ChevronRight size={16} />}
              >
                User Profile
              </ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon Only</p>
              <div className="flex gap-2">
                <ThemeButton iconLeft={<Plus size={16} />} aria-label="Add" />
                <ThemeButton iconLeft={<Star size={16} />} aria-label="Favorite" />
                <ThemeButton iconLeft={<Settings size={16} />} aria-label="Settings" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon with Variant</p>
              <div className="flex gap-2">
                <ThemeButton 
                  variant="primary" 
                  iconLeft={<Save size={16} />}
                >
                  Save
                </ThemeButton>
                <ThemeButton 
                  variant="destructive" 
                  iconLeft={<Trash2 size={16} />}
                >
                  Delete
                </ThemeButton>
              </div>
            </div>
          </ThemeCardBody>
        </ThemeCard>
      </section>

      {/* Card Variants Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Card Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThemeCard>
            <ThemeCardHeader>
              <ThemeCardTitle>Default Card</ThemeCardTitle>
              <ThemeCardDescription>
                The standard card with a subtle border
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardBody>
              This is the default card variant used for most content throughout the application.
            </ThemeCardBody>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard variant="elevated">
            <ThemeCardHeader>
              <ThemeCardTitle>Elevated Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card with pronounced shadow for emphasis
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardBody>
              The elevated card variant is used to highlight important content or to create a hierarchy.
            </ThemeCardBody>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard variant="outlined">
            <ThemeCardHeader>
              <ThemeCardTitle>Outlined Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card with transparent background and border
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardBody>
              The outlined card is useful for content that doesn't need to stand out as much.
            </ThemeCardBody>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard variant="flat">
            <ThemeCardHeader>
              <ThemeCardTitle>Flat Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card without border or shadow
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardBody>
              The flat card blends more with the background and works well for content that needs minimal separation.
            </ThemeCardBody>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard variant="gradient">
            <ThemeCardHeader>
              <ThemeCardTitle>Gradient Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card with gradient background
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardBody>
              The gradient card adds visual interest and can be used for promotional or featured content.
            </ThemeCardBody>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard variant="glass">
            <ThemeCardHeader>
              <ThemeCardTitle>Glass Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card with frosted glass effect
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardBody>
              The glass card creates a modern, translucent effect that works well for overlays or modals.
            </ThemeCardBody>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>
        </div>
      </section>

      {/* Card Interactive States Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Card Interactive States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ThemeCard isInteractive>
            <ThemeCardBody>
              <ThemeCardTitle>Interactive Card</ThemeCardTitle>
              <p className="mt-2">This card has a hover and click effect, indicating it's clickable.</p>
            </ThemeCardBody>
          </ThemeCard>

          <ThemeCard isHoverable>
            <ThemeCardBody>
              <ThemeCardTitle>Hoverable Card</ThemeCardTitle>
              <p className="mt-2">This card has a subtle hover effect but doesn't indicate it's clickable.</p>
            </ThemeCardBody>
          </ThemeCard>

          <ThemeCard withGlow>
            <ThemeCardBody>
              <ThemeCardTitle>Glowing Card</ThemeCardTitle>
              <p className="mt-2">This card has a subtle glow effect around the border.</p>
            </ThemeCardBody>
          </ThemeCard>
        </div>
      </section>

      {/* Usage Examples Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThemeCard>
            <ThemeCardHeader>
              <ThemeCardTitle>Sign In</ThemeCardTitle>
              <ThemeCardDescription>
                Enter your credentials to access your account
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardBody className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="********"
                />
              </div>
            </ThemeCardBody>
            <ThemeCardFooter>
              <ThemeButton variant="link" className="mr-auto">Forgot password?</ThemeButton>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Sign In</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard variant="elevated">
            <ThemeCardHeader>
              <ThemeCardTitle>Feature Highlight</ThemeCardTitle>
              <ThemeCardDescription>
                Upgrade your account to access premium features
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardBody>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  <span>Unlimited access to all templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  <span>Advanced AI resume optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  <span>Priority customer support</span>
                </li>
              </ul>
            </ThemeCardBody>
            <ThemeCardFooter>
              <ThemeButton fullWidth withGlow>
                Upgrade Now
              </ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>
        </div>
      </section>
      
      <div className="py-12 text-center text-sm text-muted-foreground">
        <p>This theme guide is part of the unified theme system documentation.</p>
        <p>Refer to THEME-GUIDE.md for complete documentation.</p>
      </div>
    </div>
  );
}