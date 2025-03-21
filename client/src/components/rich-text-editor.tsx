import React, { useState, useEffect } from "react";
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
  AlignRight,
  Type
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
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
  const [fontSize, setFontSize] = useState<string>("medium");
  const [fontFamily, setFontFamily] = useState<string>("default");

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
  
  // Apply font size to selected text
  const applyFontSize = (size: string) => {
    const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement;
    if (!textarea) return;
    
    setFontSize(size);
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (start === end) return; // No text selected
    
    let sizeClass = "";
    switch(size) {
      case "small":
        sizeClass = "text-sm";
        break;
      case "medium":
        sizeClass = "text-base";
        break;
      case "large":
        sizeClass = "text-lg";
        break;
      case "xlarge":
        sizeClass = "text-xl";
        break;
      default:
        sizeClass = "text-base";
    }
    
    const formattedText = `<span class="${sizeClass}">${selectedText}</span>`;
    const newText = value.substring(0, start) + formattedText + value.substring(end);
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
  
  // Apply font family to selected text
  const applyFontFamily = (font: string) => {
    const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement;
    if (!textarea) return;
    
    setFontFamily(font);
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (start === end) return; // No text selected
    
    let fontStyle = "";
    switch(font) {
      case "default":
        fontStyle = "font-sans";
        break;
      case "serif":
        fontStyle = "font-serif";
        break;
      case "mono":
        fontStyle = "font-mono";
        break;
      default:
        fontStyle = "font-sans";
    }
    
    const formattedText = `<span class="${fontStyle}">${selectedText}</span>`;
    const newText = value.substring(0, start) + formattedText + value.substring(end);
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
          
          {/* Font Family & Size Controls */}
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-xs">
                  <Type className="h-4 w-4 mr-1" />
                  {fontFamily === "default" ? "Sans" : fontFamily === "serif" ? "Serif" : "Mono"}
                  <span className="sr-only">Font Family</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" side="bottom">
                <div className="grid gap-1">
                  <Button 
                    variant={fontFamily === "default" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start font-sans"
                    onClick={() => applyFontFamily("default")}
                  >
                    Sans-serif
                  </Button>
                  <Button 
                    variant={fontFamily === "serif" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start font-serif"
                    onClick={() => applyFontFamily("serif")}
                  >
                    Serif
                  </Button>
                  <Button 
                    variant={fontFamily === "mono" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start font-mono"
                    onClick={() => applyFontFamily("mono")}
                  >
                    Monospace
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Separator orientation="vertical" className="h-4" />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-xs">
                  {fontSize === "small" ? "Small" : fontSize === "medium" ? "Medium" : fontSize === "large" ? "Large" : "X-Large"}
                  <span className="sr-only">Font Size</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2" side="bottom">
                <div className="grid gap-1">
                  <Button 
                    variant={fontSize === "small" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start text-sm"
                    onClick={() => applyFontSize("small")}
                  >
                    Small
                  </Button>
                  <Button 
                    variant={fontSize === "medium" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start text-base"
                    onClick={() => applyFontSize("medium")}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={fontSize === "large" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start text-lg"
                    onClick={() => applyFontSize("large")}
                  >
                    Large
                  </Button>
                  <Button 
                    variant={fontSize === "xlarge" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start text-xl"
                    onClick={() => applyFontSize("xlarge")}
                  >
                    X-Large
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
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
      
      {/* Live Preview */}
      {value && value.includes("<") && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Formatted Preview:</div>
          <div className="p-3 border rounded-md bg-white shadow-sm">
            <div dangerouslySetInnerHTML={parseHtml(value)} />
          </div>
        </div>
      )}
    </div>
  );
}