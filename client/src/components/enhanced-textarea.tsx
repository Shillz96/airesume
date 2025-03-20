import React, { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onBulletPoint?: () => void;
}

export function EnhancedTextarea({ 
  onBulletPoint,
  ...props
}: EnhancedTextareaProps) {
  const handleBulletPoint = () => {
    const textarea = document.getElementById(props.id as string) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      const beforeText = text.substring(0, start);
      const afterText = text.substring(end);
      
      // Check if we're at the beginning of a line
      const isLineStart = start === 0 || text[start - 1] === '\n';
      
      // Format text properly depending on cursor position
      let newText;
      if (isLineStart) {
        newText = beforeText + "• " + afterText;
      } else if (beforeText.endsWith('\n')) {
        newText = beforeText + "• " + afterText;
      } else {
        newText = beforeText + "\n• " + afterText;
      }
      
      // Update the textarea value
      textarea.value = newText;
      
      // Set cursor position after the bullet
      const newPosition = isLineStart || beforeText.endsWith('\n') 
        ? start + 2 
        : start + 3;
      
      textarea.selectionStart = newPosition;
      textarea.selectionEnd = newPosition;
      
      // Focus the textarea
      textarea.focus();
      
      // Trigger the change event
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
      
      // Call the callback if provided
      if (onBulletPoint) {
        onBulletPoint();
      }
    }
  };
  
  return (
    <div className="relative">
      <Textarea {...props} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 rounded-md"
        onClick={handleBulletPoint}
        title="Add bullet point"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}