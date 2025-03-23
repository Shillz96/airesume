/**
 * Unified Components Barrel File
 * 
 * This file exports all the unified components for easy importing
 */

// Export card components
export { default as Card } from './Card';
export { 
  UnifiedCard, 
  UnifiedCardHeader, 
  UnifiedCardTitle, 
  UnifiedCardDescription, 
  UnifiedCardContent, 
  UnifiedCardFooter 
} from './Card';

// Export button components
export { default as Button, UnifiedButton } from './Button';

// Export input components
export { default as FormControls } from './Input';
export { 
  UnifiedInput, 
  UnifiedTextarea, 
  UnifiedLabel, 
  Input, 
  Textarea 
} from './Input';

// Export select components
export { default as SelectControls } from './Select';
export { 
  UnifiedSelect, 
  UnifiedSelectOption, 
  Select 
} from './Select';

// Export layout components
export { default as Layout } from './Container';
export { 
  UnifiedContainer, 
  UnifiedSection, 
  UnifiedGrid 
} from './Container';

// Export page header component
export { default as UnifiedPageHeader } from './PageHeader';

// Export our navbar (if it exists)
export { default as UnifiedNavbar } from './Navbar';

// Export other components
export { default as CosmicBackground } from '@/ui/theme/CosmicBackground';

// Export text components
export { default as Text } from './Text';
export { 
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Paragraph,
  GradientText
} from './Text';