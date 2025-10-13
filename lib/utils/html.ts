'use client';

// Minimal HTML sanitizer for CMS-rendered snippets
// Allows a safe subset of inline tags and basic formatting
const allowedTags = new Set([
  'b','strong','i','em','u','br','span','p','ul','ol','li','a','h1','h2','h3','h4','h5','h6'
]);
const allowedAttrs: Record<string, Set<string>> = {
  a: new Set(['href','title','target','rel'])
};

export function sanitizeHtml(input: string | undefined | null): string {
  if (!input) return '';
  // Fast path for plain text: if no angle bracket, return escaped
  if (!/[<>]/.test(input)) return escapeHtml(input);

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${input}</div>`, 'text/html');
  const container = doc.body.firstElementChild as HTMLElement | null;
  if (!container) return '';

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (!allowedTags.has(tag)) {
        // Replace disallowed element with its text content
        const text = doc.createTextNode(el.textContent || '');
        el.replaceWith(text);
        return; // children already removed with element
      }
      // Filter attributes
      [...el.attributes].forEach(attr => {
        const name = attr.name.toLowerCase();
        const value = attr.value;
        const tagAllowed = allowedAttrs[tag];
        const permitted = tagAllowed?.has(name) ?? false;
        if (!permitted) {
          el.removeAttribute(attr.name);
          return;
        }
        // Extra safety for links: prevent javascript: URLs
        if (tag === 'a' && name === 'href') {
          const trimmed = value.trim();
          if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) {
            el.removeAttribute('href');
          }
        }
        if (tag === 'a' && name === 'target') {
          // Enforce rel when target=_blank
          if (value === '_blank' && !el.getAttribute('rel')) {
            el.setAttribute('rel', 'noopener noreferrer');
          }
        }
      });
    }
    // Recurse children (use slice to avoid live collection issues)
    const children = Array.from(node.childNodes);
    for (const child of children) sanitizeNode(child);
  };

  sanitizeNode(container);
  return container.innerHTML;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


