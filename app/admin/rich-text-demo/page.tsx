'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import RichTextEditor from '@/components/RichTextEditor';
import FormattedText from '@/components/FormattedText';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bold, Link, Eye, Code } from 'lucide-react';

export default function RichTextDemoPage() {
  const [content, setContent] = useState('This is a **demo** of the rich text editor. You can make text [bold](https://example.com) and add [links](https://google.com) easily!');
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Rich Text Editor Demo</h1>
            <p className="text-lg text-gray-600 mb-6">
              Test the rich text editing capabilities with bold text and hyperlinks
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-blue-100 text-blue-800">
                <Bold className="w-4 h-4 mr-1" />
                Bold Text
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                <Link className="w-4 h-4 mr-1" />
                Hyperlinks
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                <Code className="w-4 h-4 mr-1" />
                Markdown
              </Badge>
            </div>
          </div>

          {/* Editor Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Rich Text Editor
              </CardTitle>
              <CardDescription>
                Use the toolbar buttons or keyboard shortcuts (Ctrl+B for bold, Ctrl+K for link)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Start typing here... Use **bold** and [links](url)"
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
              <CardDescription>
                See how your formatted text will appear on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="p-4 bg-white border rounded-lg">
                  <FormattedText text={content} />
                </div>
              ) : (
                <div className="p-4 bg-gray-100 border rounded-lg text-gray-500 text-center">
                  Preview hidden
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Bold Text</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Select text and click the <Bold className="w-4 h-4 inline" /> button</li>
                    <li>• Or use keyboard shortcut: <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+B</kbd></li>
                    <li>• Or type manually: <code className="px-2 py-1 bg-gray-200 rounded text-xs">**text**</code></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Hyperlinks</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Select text and click the <Link className="w-4 h-4 inline" /> button</li>
                    <li>• Or use keyboard shortcut: <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+K</kbd></li>
                    <li>• Or type manually: <code className="px-2 py-1 bg-gray-200 rounded text-xs">[text](url)</code></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p>Input: <code>This is **bold text** with a [link](https://example.com)</code></p>
                    <p>Output: This is <strong>bold text</strong> with a <a href="https://example.com" className="text-blue-600 underline">link</a></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Info */}
          <Card>
            <CardHeader>
              <CardTitle>Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                This rich text editor is now integrated into the Pages Editor. All textarea fields 
                have been replaced with rich text editors that support:
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✅ <strong>Bold formatting</strong> for emphasis</li>
                <li>✅ <strong>Hyperlinks</strong> for navigation</li>
                <li>✅ <strong>Live preview</strong> of formatted content</li>
                <li>✅ <strong>Keyboard shortcuts</strong> for quick editing</li>
                <li>✅ <strong>Markdown syntax</strong> for advanced users</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
