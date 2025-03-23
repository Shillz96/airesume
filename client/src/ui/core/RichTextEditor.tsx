import React, { useState } from 'react';
import { Bold, Italic, List, Link, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
  label?: string;
}

/**
 * Rich text editor component with formatting options
 * 
 * Uses theme variables for consistent styling across the application
 */
export function RichTextEditor({
  value,
  onChange,
  className,
  placeholder = 'Start typing...',
  rows = 5,
  label
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const applyFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let replacement = '';

    switch (format) {
      case 'bold':
        replacement = `**${selectedText}**`;
        break;
      case 'italic':
        replacement = `*${selectedText}*`;
        break;
      case 'link':
        // For links, prompt for URL if text is selected
        const url = window.prompt('Enter URL:', 'https://');
        if (url) {
          replacement = `[${selectedText || 'Link text'}](${url})`;
        } else {
          return; // User cancelled the prompt
        }
        break;
      case 'list':
        // Convert each line to list item
        if (selectedText.includes('\n')) {
          replacement = selectedText
            .split('\n')
            .map(line => line.trim() ? `- ${line}` : line)
            .join('\n');
        } else {
          replacement = `- ${selectedText}`;
        }
        break;
      case 'align-left':
      case 'align-center':
      case 'align-right':
        // We'll just add a comment for now as actual alignment would require HTML rendering
        const align = format.replace('align-', '');
        replacement = `<${align}>${selectedText}</${align}>`;
        break;
      default:
        return;
    }

    // Replace the text
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Set the selection to after the inserted formatting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className={cn("rich-text-editor-container space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
      )}
      
      <div className={cn(
        "border rounded-md overflow-hidden transition-all duration-200",
        isFocused ? "border-primary/60 ring-1 ring-primary/20" : "border-border",
      )}>
        <div className="rich-text-toolbar bg-background/50 border-b border-border px-2 py-1 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('bold')}
            type="button"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('italic')}
            type="button"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('link')}
            type="button"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('list')}
            type="button"
            title="Bulleted List"
          >
            <List className="w-4 h-4" />
          </Button>
          
          <div className="mx-1 h-5 border-l border-border"></div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('align-left')}
            type="button"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('align-center')}
            type="button"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('align-right')}
            type="button"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
        
        <textarea
          ref={textareaRef}
          className={cn(
            "w-full px-3 py-2 outline-none text-foreground bg-background resize-none",
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
        />
      </div>
      
      <div className="text-xs text-muted-foreground">
        Formatting: **bold**, *italic*, [link](url), - for lists
      </div>
    </div>
  );
}

export default RichTextEditor;