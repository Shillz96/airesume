import React, { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onBulletPoint?: () => void;
}

export function EnhancedTextarea({ 
  className, 
  onBulletPoint,
  ...props 
}: EnhancedTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertBulletPoint = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const currentValue = textarea.value;
    
    // Check if we're at the start of a line or if the previous character is a newline
    const isStartOfLine = selectionStart === 0 || currentValue[selectionStart - 1] === '\n';
    
    // Insert bullet point
    const bulletPoint = isStartOfLine ? "• " : "\n• ";
    const newValue = 
      currentValue.substring(0, selectionStart) + 
      bulletPoint + 
      currentValue.substring(selectionEnd);
    
    // Update the textarea value
    const event = {
      target: {
        value: newValue
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    // Call the onChange handler with our synthetic event
    if (props.onChange) {
      props.onChange(event);
    }
    
    // Set cursor position after the inserted bullet point
    const newCursorPosition = selectionStart + bulletPoint.length;
    
    // Delayed focus and cursor position setting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  return (
    <div className="relative">
      <Textarea 
        ref={textareaRef}
        className={cn("pr-10", className)} 
        {...props} 
      />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 p-0"
        onClick={() => {
          insertBulletPoint();
          if (onBulletPoint) onBulletPoint();
        }}
        title="Insert bullet point"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
}