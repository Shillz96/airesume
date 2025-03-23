import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated';
  isHoverable?: boolean;
  isInteractive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { 
      className, 
      variant = 'default', 
      isHoverable = false, 
      isInteractive = false,
      children, 
      ...props 
    }, 
    ref
  ) => {
    // Base card classes
    const baseClasses = 'rounded-lg overflow-hidden';
    
    // Variant classes
    const variantClasses = {
      default: 'bg-card text-card-foreground',
      outline: 'bg-transparent border border-border',
      elevated: 'bg-card text-card-foreground shadow-lg',
    };
    
    // Hover effect classes
    const hoverClasses = isHoverable ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : '';
    
    // Interactive state classes
    const interactiveClasses = isInteractive ? 'cursor-pointer active:scale-[0.98]' : '';
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          hoverClasses,
          interactiveClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-tight tracking-tight",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export { Card };

export default Card;