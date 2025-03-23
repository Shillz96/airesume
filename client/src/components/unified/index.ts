/**
 * Unified Component Library
 * 
 * This file exports all unified components to simplify imports.
 * When using these components, you can import multiple components in a single line:
 * 
 * import { UnifiedButton, UnifiedCard, UnifiedContainer } from '@/components/unified';
 */

// Core components
export { UnifiedButton, buttonVariants } from './Button';
export { 
  UnifiedCard, 
  UnifiedCardHeader, 
  UnifiedCardTitle, 
  UnifiedCardDescription, 
  UnifiedCardContent, 
  UnifiedCardFooter,
  cardVariants 
} from './Card';
export { UnifiedContainer } from './Container';
export { 
  UnifiedText, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Subtitle, 
  Lead, 
  Label, 
  Code,
  GradientText 
} from './Text';
export { UnifiedPageHeader } from './PageHeader';
export { ThemeSwitcher } from './ThemeSwitcher';
export { CosmicBackground } from './CosmicBackground';
export { UnifiedNavbar } from './Navbar';

// Add other components as they are created