import React from 'react';
import { Button } from '@/ui/core/Button';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  CardTitle,
  CardDescription
} from '@/ui/core/Card';

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
 * Modern ThemeGuide component
 * 
 * This component serves as a live demonstration of the unified theme system.
 * It showcases all the button and card variants, as well as their various states.
 * It can be used as a reference for developers implementing new components.
 * 
 * Updated to use the new Button and Card components from our unified theme system.
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
        <Card>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Primary</p>
              <Button variant="default">Primary Button</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Secondary</p>
              <Button variant="secondary">Secondary Button</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Outline</p>
              <Button variant="outline">Outline Button</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Destructive</p>
              <Button variant="destructive">Destructive Button</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Ghost</p>
              <Button variant="ghost">Ghost Button</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Link</p>
              <Button variant="link">Link Button</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Button Sizes Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Button Sizes</h2>
        <Card>
          <CardContent className="flex flex-wrap items-end gap-4 py-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Small (sm)</p>
              <Button size="sm">Small</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Default</p>
              <Button>Default</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Large (lg)</p>
              <Button size="lg">Large</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon</p>
              <Button size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Button States Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Button States</h2>
        <Card>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Default</p>
              <Button>Default State</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Disabled</p>
              <Button disabled>Disabled State</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Loading</p>
              <Button isLoading>Loading State</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Loading with Text</p>
              <Button isLoading loadingText="Loading...">
                Processing
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Full Width</p>
              <Button fullWidth>Full Width Button</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Buttons with Icons Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Buttons with Icons</h2>
        <Card>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon Left</p>
              <Button iconLeft={<Plus size={16} />}>
                Add New
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon Right</p>
              <Button iconRight={<ArrowRight size={16} />}>
                Next Step
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Both Icons</p>
              <Button 
                iconLeft={<User size={16} />}
                iconRight={<ChevronRight size={16} />}
              >
                User Profile
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon Only</p>
              <div className="flex gap-2">
                <Button size="icon" aria-label="Add"><Plus size={16} /></Button>
                <Button size="icon" aria-label="Favorite"><Star size={16} /></Button>
                <Button size="icon" aria-label="Settings"><Settings size={16} /></Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Icon with Variant</p>
              <div className="flex gap-2">
                <Button
                  variant="default" 
                  iconLeft={<Save size={16} />}
                >
                  Save
                </Button>
                <Button 
                  variant="destructive" 
                  iconLeft={<Trash2 size={16} />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Card Variants Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Card Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                The standard card with a subtle border
              </CardDescription>
            </CardHeader>
            <CardContent>
              This is the default card variant used for most content throughout the application.
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>
                Card with pronounced shadow for emphasis
              </CardDescription>
            </CardHeader>
            <CardContent>
              The elevated card variant is used to highlight important content or to create a hierarchy.
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          <Card className="border border-primary/20 bg-transparent">
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
              <CardDescription>
                Card with transparent background and border
              </CardDescription>
            </CardHeader>
            <CardContent>
              The outlined card is useful for content that doesn't need to stand out as much.
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Flat Card</CardTitle>
              <CardDescription>
                Card without border or shadow
              </CardDescription>
            </CardHeader>
            <CardContent>
              The flat card blends more with the background and works well for content that needs minimal separation.
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Card Hover States Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Card Hover States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transition-all duration-300 hover:shadow-lg cursor-pointer">
            <CardContent className="pt-6">
              <CardTitle>Interactive Card</CardTitle>
              <p className="mt-2">This card has a hover and click effect, indicating it's clickable.</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:border-primary/50">
            <CardContent className="pt-6">
              <CardTitle>Hover Border Card</CardTitle>
              <p className="mt-2">This card has a subtle hover effect that highlights the border.</p>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]">
            <CardContent className="pt-6">
              <CardTitle>Glowing Card</CardTitle>
              <p className="mt-2">This card has a subtle glow effect around the border.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Usage Examples Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter>
              <Button variant="link" className="mr-auto">Forgot password?</Button>
              <Button variant="ghost">Cancel</Button>
              <Button>Sign In</Button>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Feature Highlight</CardTitle>
              <CardDescription>
                Upgrade your account to access premium features
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter>
              <Button fullWidth className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90">
                Upgrade Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      <div className="py-12 text-center text-sm text-muted-foreground">
        <p>This theme guide is part of the unified theme system documentation.</p>
        <p>Refer to THEME-GUIDE.md for complete documentation.</p>
      </div>
    </div>
  );
}