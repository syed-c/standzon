import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  disableRichTools?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, disableRichTools, onChange, value, defaultValue, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);
    const [showPreview, setShowPreview] = React.useState(false);

    const getCurrentValue = () => (value !== undefined ? String(value) : (innerRef.current?.value ?? String(defaultValue ?? '')));

    const applyWrap = (before: string, after: string = before) => {
      const el = innerRef.current;
      if (!el) return;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const current = getCurrentValue();
      const selected = current.slice(start, end) || '';
      const next = current.slice(0, start) + before + selected + after + current.slice(end);

      if (onChange) {
        const syntheticEvent = {
          target: { value: next },
          currentTarget: { value: next },
        } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
      } else if (el) {
        el.value = next;
      }

      const cursor = start + before.length + selected.length + after.length;
      requestAnimationFrame(() => {
        el.focus();
        try { el.setSelectionRange(cursor, cursor); } catch {}
      });
    };

    const onBold = () => applyWrap('<strong>', '</strong>');
    const onLink = () => {
      const url = window.prompt('Enter URL (https://...)');
      if (!url) return;
      applyWrap('<a href="' + url + '" target="_blank" rel="noopener">', '</a>');
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onBold();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onLink();
      }
    };

    return (
      <div className="w-full">
        {!disableRichTools && (
          <div className="mb-1 flex items-center gap-2">
            <button type="button" onClick={onBold} className="px-2 py-1 text-xs rounded-button border-2 border-gray-300 hover:bg-gray-100 bg-white text-gray-700 hover:border-gray-400">Bold</button>
            <button type="button" onClick={onLink} className="px-2 py-1 text-xs rounded-button border-2 border-gray-300 hover:bg-gray-100 bg-white text-gray-700 hover:border-gray-400">Link</button>
            <div className="ml-auto flex items-center gap-2 text-xs">
              <button type="button" onClick={() => setShowPreview((v)=>!v)} className="px-2 py-1 rounded-button border-2 border-gray-300 hover:bg-gray-100 bg-white text-gray-700 hover:border-gray-400">{showPreview ? 'Edit' : 'Preview'}</button>
              <span className="hidden sm:inline">Ctrl+B • Ctrl+K</span>
            </div>
          </div>
        )}

        {!showPreview ? (
          <textarea
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] touch-enlarge',
              className
            )}
            ref={innerRef}
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
            onKeyDown={onKeyDown}
            {...props}
          />
        ) : (
          <div className={cn('min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm prose max-w-none touch-enlarge', className)}
               dangerouslySetInnerHTML={{ __html: getCurrentValue() }} />
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
