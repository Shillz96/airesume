import React from 'react';
import { ThemeButton } from './ModernThemeButton';
import { 
  ThemeCard, 
  ThemeCardHeader, 
  ThemeCardContent, 
  ThemeCardFooter,
  ThemeCardTitle,
  ThemeCardDescription
} from './ModernThemeCard';

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
 * ModernThemeGuide component
 * 
 * This component serves as a live demonstration of the unified theme system.
 * It showcases all the button and card variants, as well as their various states.
 * It can be used as a reference for developers implementing new components.
 * 
 * Uses the modern ThemeButton and ThemeCard components from our unified theme system.
 */
export default function ModernThemeGuide() {
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
          <ThemeCardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Primary</p>
              <ThemeButton variant="primary">Primary Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Secondary</p>
              <ThemeButton variant="secondary">Secondary Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Outline</p>
              <ThemeButton variant="outline">Outline Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Destructive</p>
              <ThemeButton variant="destructive">Destructive Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Ghost</p>
              <ThemeButton variant="ghost">Ghost Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Success</p>
              <ThemeButton variant="success">Success Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Gradient Border</p>
              <ThemeButton variant="gradient-border">Gradient Button</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Animated Gradient</p>
              <ThemeButton variant="animated-gradient">Animated Button</ThemeButton>
            </div>
          </ThemeCardContent>
        </ThemeCard>
      </section>

      {/* Button Sizes Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Button Sizes</h2>
        <ThemeCard>
          <ThemeCardContent className="flex flex-wrap items-end gap-4 py-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Small (sm)</p>
              <ThemeButton size="sm">Small</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Default</p>
              <ThemeButton>Default</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Large (lg)</p>
              <ThemeButton size="lg">Large</ThemeButton>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon</p>
              <ThemeButton size="icon"><Plus className="h-4 w-4" /></ThemeButton>
            </div>
          </ThemeCardContent>
        </ThemeCard>
      </section>
      
      {/* Button States Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Button States</h2>
        <ThemeCard>
          <ThemeCardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6">
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
          </ThemeCardContent>
        </ThemeCard>
      </section>

      {/* Buttons with Icons Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Buttons with Icons</h2>
        <ThemeCard>
          <ThemeCardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6">
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
                <ThemeButton size="icon"><Plus size={16} /></ThemeButton>
                <ThemeButton size="icon"><Star size={16} /></ThemeButton>
                <ThemeButton size="icon"><Settings size={16} /></ThemeButton>
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
          </ThemeCardContent>
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
            <ThemeCardContent>
              This is the default card variant used for most content throughout the application.
            </ThemeCardContent>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard className="border-0 shadow-lg">
            <ThemeCardHeader>
              <ThemeCardTitle>Elevated Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card with pronounced shadow for emphasis
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardContent>
              The elevated card variant is used to highlight important content or to create a hierarchy.
            </ThemeCardContent>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard className="border border-primary/20 bg-transparent">
            <ThemeCardHeader>
              <ThemeCardTitle>Outlined Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card with transparent background and border
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardContent>
              The outlined card is useful for content that doesn't need to stand out as much.
            </ThemeCardContent>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard className="border-0 shadow-none">
            <ThemeCardHeader>
              <ThemeCardTitle>Flat Card</ThemeCardTitle>
              <ThemeCardDescription>
                Card without border or shadow
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardContent>
              The flat card blends more with the background and works well for content that needs minimal separation.
            </ThemeCardContent>
            <ThemeCardFooter>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Save</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>
        </div>
      </section>

      {/* Card Hover States Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Card Hover States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ThemeCard isInteractive>
            <ThemeCardContent className="pt-6">
              <ThemeCardTitle>Interactive Card</ThemeCardTitle>
              <p className="mt-2">This card has a hover and click effect, indicating it's clickable.</p>
            </ThemeCardContent>
          </ThemeCard>

          <ThemeCard isHoverable>
            <ThemeCardContent className="pt-6">
              <ThemeCardTitle>Hover Border Card</ThemeCardTitle>
              <p className="mt-2">This card has a subtle hover effect that highlights the border.</p>
            </ThemeCardContent>
          </ThemeCard>

          <ThemeCard withGlow>
            <ThemeCardContent className="pt-6">
              <ThemeCardTitle>Glowing Card</ThemeCardTitle>
              <p className="mt-2">This card has a subtle glow effect around the border.</p>
            </ThemeCardContent>
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
            <ThemeCardContent className="space-y-4">
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
            </ThemeCardContent>
            <ThemeCardFooter>
              <ThemeButton variant="ghost" className="mr-auto">Forgot password?</ThemeButton>
              <ThemeButton variant="ghost">Cancel</ThemeButton>
              <ThemeButton>Sign In</ThemeButton>
            </ThemeCardFooter>
          </ThemeCard>

          <ThemeCard className="border-0 shadow-lg">
            <ThemeCardHeader>
              <ThemeCardTitle>Feature Highlight</ThemeCardTitle>
              <ThemeCardDescription>
                Upgrade your account to access premium features
              </ThemeCardDescription>
            </ThemeCardHeader>
            <ThemeCardContent>
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
            </ThemeCardContent>
            <ThemeCardFooter>
              <ThemeButton fullWidth className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90">
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