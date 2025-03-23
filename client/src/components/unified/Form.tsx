/**
 * Unified Form Components
 * 
 * This is the collection of form components to be used across the entire application.
 * It provides consistent styling and behavior for all form elements.
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Form Field
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-2 mb-4', className)} {...props}>
      {children}
    </div>
  );
};

// Label
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  children,
  className,
  required = false,
  ...props
}) => {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
};

// Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  className,
  error = false,
  icon,
  iconPosition = 'left',
  type,
  ...props
}) => {
  return (
    <div className="relative">
      {icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          icon && iconPosition === 'left' && 'pl-10',
          icon && iconPosition === 'right' && 'pr-10',
          className
        )}
        {...props}
      />
      {icon && iconPosition === 'right' && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
    </div>
  );
};

// TextArea
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  className,
  error = false,
  ...props
}) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      {...props}
    />
  );
};

// Select
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  className,
  error = false,
  children,
  ...props
}) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

// Checkbox
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  label,
  error = false,
  ...props
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        className={cn(
          'h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
};

// Radio
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  className,
  label,
  error = false,
  ...props
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        className={cn(
          'h-4 w-4 shrink-0 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus:ring-destructive',
          className
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
};

// Form Error message
export interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  message,
  className,
  ...props
}) => {
  if (!message) return null;
  
  return (
    <div
      className={cn('text-sm font-medium text-destructive mt-1', className)}
      {...props}
    >
      {message}
    </div>
  );
};

// Submit Button
export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'cosmic';
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  className,
  isLoading = false,
  loadingText,
  fullWidth = false,
  variant = 'primary',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center h-10 px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    cosmic: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type="submit"
      className={cn(
        baseClasses,
        variantClasses[variant],
        widthClass,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Form Group - contains a full form field (label, input, error)
export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className,
  label,
  htmlFor,
  error,
  required = false,
  ...props
}) => {
  return (
    <div className={cn('space-y-2 mb-4', className)} {...props}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {error && <FormError message={error} />}
    </div>
  );
};