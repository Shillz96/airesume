import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  className,
  placeholder,
  rows = 4,
  label
}: RichTextEditorProps) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<string>("left");

  // Parse HTML content from the textarea
  const parseHtml = (text: string) => {
    return { __html: text };
  };

  // Apply formatting to selected text
  const applyFormatting = (format: 'bold' | 'italic' | 'underline' | 'align') => {
    const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (start === end) {
      // No text selected, toggle state for next typing
      if (format === 'bold') setIsBold(!isBold);
      if (format === 'italic') setIsItalic(!isItalic);
      if (format === 'underline') setIsUnderline(!isUnderline);
      return;
    }
    
    let newText = value;
    
    if (format === 'bold') {
      const formattedText = `<strong>${selectedText}</strong>`;
      newText = value.substring(0, start) + formattedText + value.substring(end);
    } else if (format === 'italic') {
      const formattedText = `<em>${selectedText}</em>`;
      newText = value.substring(0, start) + formattedText + value.substring(end);
    } else if (format === 'underline') {
      const formattedText = `<u>${selectedText}</u>`;
      newText = value.substring(0, start) + formattedText + value.substring(end);
    }
    
    onChange(newText);
    
    // Reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start,
        end + (newText.length - value.length)
      );
    }, 0);
  };

  const handleAlignmentChange = (value: string) => {
    if (!value) return;
    setAlignment(value);
    
    const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Apply alignment to paragraph or selected text
    if (start !== end) {
      const formattedText = `<div style="text-align: ${value};">${selectedText}</div>`;
      const newText = value.substring(0, start) + formattedText + value.substring(end);
      onChange(newText);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-xs text-gray-500 block mb-1">{label}</label>
      )}
      
      <div className="border rounded-md bg-white">
        <div className="flex p-1 border-b">
          <div className="flex gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("h-8 w-8 p-0", isBold && "bg-slate-100")}
              onClick={() => applyFormatting('bold')}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("h-8 w-8 p-0", isItalic && "bg-slate-100")}
              onClick={() => applyFormatting('italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("h-8 w-8 p-0", isUnderline && "bg-slate-100")}
              onClick={() => applyFormatting('underline')}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-6 mx-2 border-l border-gray-200"></div>
          
          <ToggleGroup type="single" value={alignment} onValueChange={handleAlignmentChange}>
            <ToggleGroupItem value="left" aria-label="Left align">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Center align">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Right align">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <div className="h-6 mx-2 border-l border-gray-200"></div>
          
          <div className="flex gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement;
                if (!textarea) return;
                
                const start = textarea.selectionStart;
                const bulletList = "\n• ";
                const newText = value.substring(0, start) + bulletList + value.substring(start);
                onChange(newText);
                
                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(start + bulletList.length, start + bulletList.length);
                }, 0);
              }}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement;
                if (!textarea) return;
                
                const start = textarea.selectionStart;
                const numberedList = "\n1. ";
                const newText = value.substring(0, start) + numberedList + value.substring(start);
                onChange(newText);
                
                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(start + numberedList.length, start + numberedList.length);
                }, 0);
              }}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Textarea
          id="rich-text-area"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white text-sm"
          placeholder={placeholder}
          rows={rows}
        />
      </div>
      
      {/* Preview (for development purposes) */}
      {/*
      <div className="p-3 border rounded-md bg-white">
        <div dangerouslySetInnerHTML={parseHtml(value)} />
      </div>
      */}
    </div>
  );
}