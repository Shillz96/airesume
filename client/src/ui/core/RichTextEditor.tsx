import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Underline, AlignLeft, AlignCenter, AlignRight, Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getThemeVar, getCosmicColor } from '@/lib/theme-utils';

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
export default function RichTextEditor({
  value,
  onChange,
  className,
  placeholder = 'Type here...',
  rows = 3,
  label
}: RichTextEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  
  const handleFormatClick = (e: React.MouseEvent, formatType: string) => {
    e.preventDefault();
    
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = value;
    let newCursorPos = end;
    
    switch (formatType) {
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
        newCursorPos = end + 2;
        break;
      case 'underline':
        newText = value.substring(0, start) + `_${selectedText}_` + value.substring(end);
        newCursorPos = end + 2;
        break;
      case 'unordered-list':
        // Add newline if not at the start of text
        const prefix = start > 0 && value[start - 1] !== '\n' ? '\n' : '';
        newText = value.substring(0, start) + `${prefix}- ${selectedText}` + value.substring(end);
        newCursorPos = end + 3 + prefix.length;
        break;
      case 'ordered-list':
        const olPrefix = start > 0 && value[start - 1] !== '\n' ? '\n' : '';
        newText = value.substring(0, start) + `${olPrefix}1. ${selectedText}` + value.substring(end);
        newCursorPos = end + 4 + olPrefix.length;
        break;
      case 'align-left':
        newText = value.substring(0, start) + `<div style="text-align: left">${selectedText}</div>` + value.substring(end);
        newCursorPos = end + 34;
        break;
      case 'align-center':
        newText = value.substring(0, start) + `<div style="text-align: center">${selectedText}</div>` + value.substring(end);
        newCursorPos = end + 36;
        break;
      case 'align-right':
        newText = value.substring(0, start) + `<div style="text-align: right">${selectedText}</div>` + value.substring(end);
        newCursorPos = end + 35;
        break;
      case 'link':
        setLinkText(selectedText);
        setIsLinkModalOpen(true);
        return;
    }
    
    onChange(newText);
    
    // After state update, set the cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
      }
    }, 0);
  };
  
  const insertLink = () => {
    if (!textareaRef.current || !linkUrl) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const displayText = linkText || linkUrl;
    
    const markdownLink = `[${displayText}](${linkUrl})`;
    const newText = value.substring(0, start) + markdownLink + value.substring(end);
    
    onChange(newText);
    setIsLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
    
    // Set cursor after the inserted link
    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = start + markdownLink.length;
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
      }
    }, 0);
  };

  return (
    <div className={cn("rich-text-editor", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
      )}
      
      <div className="border border-border rounded-md overflow-hidden">
        <div className="flex flex-wrap gap-1 p-1 border-b border-border bg-muted">
          <button
            className="p-1 rounded hover:bg-background"
            onClick={(e) => handleFormatClick(e, 'bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            className="p-1 rounded hover:bg-background"
            onClick={(e) => handleFormatClick(e, 'italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            className="p-1 rounded hover:bg-background"
            onClick={(e) => handleFormatClick(e, 'underline')}
            title="Underline"
          >
            <Underline className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="mx-1 text-muted-foreground">|</span>
          <button
            className="p-1 rounded hover:bg-background"
            onClick={(e) => handleFormatClick(e, 'unordered-list')}
            title="Bulleted list"
          >
            <List className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            className="p-1 rounded hover:bg-background"
            onClick={(e) => handleFormatClick(e, 'ordered-list')}
            title="Numbered list"
          >
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="mx-1 text-muted-foreground">|</span>
          <button
            className="p-1 rounded hover:bg-background"
            onClick={(e) => handleFormatClick(e, 'link')}
            title="Insert link"
          >
            <Link className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="mx-1 text-muted-foreground">|</span>
          <button
            className="p-1 rounded hover:bg-background"
            onClick={(e) => handleFormatClick(e, 'align-left')}
            title="Align left"
          >
            <AlignLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            className="p-1 rounded hover:bg-background"
            onClick={(e) => handleFormatClick(e, 'align-center')}
            title="Align center"
          >
            <AlignCenter className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            className="p-1 rounded hover:bg-background"
            onClick={(e) => handleFormatClick(e, 'align-right')}
            title="Align right"
          >
            <AlignRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full p-3 bg-background text-foreground border-none focus:outline-none resize-y"
        />
      </div>
      
      {/* Simple link modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-4 w-full max-w-md">
            <h3 className="font-medium mb-4">Insert Link</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Text to display
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background"
                  placeholder="Display text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={insertLink}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  disabled={!linkUrl}
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}