'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bold, Link, Unlink, X } from 'lucide-react';
import { markdownToHtml } from '@/lib/utils/markdown';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter text...", 
  rows = 3,
  className = ""
}: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to get selected text from textarea
  const getSelectedText = () => {
    const textarea = textareaRef.current;
    if (!textarea) return '';
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    return value.substring(start, end);
  };

  // Function to replace selected text
  const replaceSelectedText = (newText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  // Function to make selected text bold
  const makeBold = () => {
    const selected = getSelectedText();
    if (!selected) return;
    
    const boldText = `**${selected}**`;
    replaceSelectedText(boldText);
  };

  // Function to add link
  const addLink = () => {
    const selected = getSelectedText();
    if (!selected) return;
    
    setSelectedText(selected);
    setLinkText(selected);
    setLinkUrl('');
    setShowLinkDialog(true);
  };

  // Function to remove link
  const removeLink = () => {
    const selected = getSelectedText();
    if (!selected) return;
    
    // Remove markdown link syntax: [text](url)
    const linkRegex = /\[([^\]]+)\]\([^)]+\)/g;
    const newText = selected.replace(linkRegex, '$1');
    replaceSelectedText(newText);
  };

  // Function to confirm link
  const confirmLink = () => {
    if (!linkUrl.trim()) return;
    
    const linkMarkdown = `[${linkText}](${linkUrl})`;
    replaceSelectedText(linkMarkdown);
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  // Function to cancel link dialog
  const cancelLink = () => {
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  // Function to render text with markdown formatting
  const renderFormattedText = (text: string) => {
    return markdownToHtml(text);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-t-lg">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={makeBold}
          title="Make text bold (Ctrl+B)"
          className="h-8 px-2"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLink}
          title="Add link (Ctrl+K)"
          className="h-8 px-2"
        >
          <Link className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={removeLink}
          title="Remove link"
          className="h-8 px-2"
        >
          <Unlink className="w-4 h-4" />
        </Button>
        <div className="text-xs text-gray-500 ml-2">
          Use **text** for bold, [text](url) for links
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        onKeyDown={(e) => {
          // Keyboard shortcuts
          if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b') {
              e.preventDefault();
              makeBold();
            } else if (e.key === 'k') {
              e.preventDefault();
              addLink();
            }
          }
        }}
      />

      {/* Preview */}
      {value && (
        <div className="mt-2 p-3 bg-gray-50 border rounded-lg">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview:</Label>
          <div 
            className="text-sm text-gray-800 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderFormattedText(value) }}
          />
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Link</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={cancelLink}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Link Text</Label>
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link text"
                />
              </div>
              
              <div>
                <Label>URL</Label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelLink}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmLink}
                  disabled={!linkUrl.trim()}
                >
                  Add Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
