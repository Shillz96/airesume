/**
 * Unified Components Index
 * 
 * This file exports all components from the unified system to provide a single import path.
 * Import components from here rather than individual files for better organization.
 * 
 * Example:
 * import { PageHeader, Container, Heading1 } from '@/components/unified';
 */

// Layout components
export { default as PageHeader } from './PageHeader';
export { default as Container } from './Container';

// For backward compatibility with existing code
export { default as UnifiedPageHeader } from './PageHeader';
export { default as UnifiedContainer } from './Container';

// Typography components
export {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  GradientText
} from './Text';

// Export additional typography components if needed - currently Heading5, Heading6 and Paragraph
// need special handling as they're not exported correctly from Text.tsx

// Import more unified components as they are created