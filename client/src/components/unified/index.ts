/**
 * Unified Components Export
 * 
 * This file exports all of our unified components to make importing easier.
 * Components should be imported from this file using:
 * import { Button, Text, Container, PageHeader, Card } from '@/components/unified';
 */

// Core components
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Text } from './Text';
export type { TextProps } from './Text';

export { Container, UnifiedContainer } from './Container';
export type { ContainerProps, UnifiedContainerProps } from './Container';

export { PageHeader, UnifiedPageHeader } from './PageHeader';
export type { PageHeaderProps, UnifiedPageHeaderProps } from './PageHeader';

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './Card';
export type { CardProps } from './Card';

// Form components
export {
  FormField,
  Label,
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  FormError,
  SubmitButton,
  FormGroup
} from './Form';
export type {
  FormFieldProps,
  LabelProps,
  InputProps,
  TextAreaProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
  FormErrorProps,
  SubmitButtonProps,
  FormGroupProps
} from './Form';