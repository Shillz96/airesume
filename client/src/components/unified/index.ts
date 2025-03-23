/**
 * Unified Component Library
 * 
 * This file exports all unified components to simplify imports.
 * When using these components, you can import multiple components in a single line:
 * 
 * import { UnifiedButton, UnifiedCard, UnifiedContainer } from '@/components/unified';
 */

// Core components
export { default as UnifiedButton } from './Button';
export { 
  default as UnifiedCard,
  UnifiedCardHeader, 
  UnifiedCardTitle, 
  UnifiedCardDescription, 
  UnifiedCardContent, 
  UnifiedCardFooter
} from './Card';
export { default as UnifiedContainer } from './Container';
export { 
  default as UnifiedText, 
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
export { default as UnifiedPageHeader } from './PageHeader';
export { default as ThemeSwitcher } from './ThemeSwitcher';
export { default as CosmicBackground } from './CosmicBackground';
export { default as UnifiedNavbar } from './Navbar';
export { default as MobileMenu } from './MobileMenu';

// Add other components as they are created