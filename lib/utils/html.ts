// Universal HTML sanitizer for CMS-rendered snippets
// Works on both server and client
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

  // Use browser DOMParser if available (client-side) or fallback to regex-based approach (server-side)
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    // Client-side implementation using DOMParser
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
  } else {
    // Server-side implementation using regex-based approach
    return sanitizeHtmlServer(input);
  }
}

// Server-side implementation using regex
function sanitizeHtmlServer(input: string): string {
  if (!input) return '';
  
  // Remove script tags and their content
  let result = input.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove on* event attributes
  result = result.replace(/\s(on\w+)=['"][^'"]*['"]/gi, '');
  
  // Remove javascript: links
  result = result.replace(/href=['"]javascript:[^'"]*['"]/gi, 'href="#"');
  
  // Whitelist allowed tags and clean attributes
  // Process opening tags
  result = result.replace(/<([a-zA-Z]+)([^>]*)>/g, (match, tag, attrs) => {
    const lowerTag = tag.toLowerCase();
    if (!allowedTags.has(lowerTag)) {
      return '';
    }
    
    // For <a> tags, only allow href and add security attributes
    if (lowerTag === 'a') {
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
      if (hrefMatch && hrefMatch[1] && !hrefMatch[1].toLowerCase().startsWith('javascript:')) {
        return `<a href="${hrefMatch[1]}" rel="noopener noreferrer" target="_blank">`;
      }
      return '<a>';
    }
    
    // For other tags, remove all attributes
    return `<${lowerTag}>`;
  });
  
  // Process closing tags
  result = result.replace(/<\/([a-zA-Z]+)>/g, (match, tag) => {
    const lowerTag = tag.toLowerCase();
    if (!allowedTags.has(lowerTag)) {
      return '';
    }
    return `</${lowerTag}>`;
  });
  
  return result;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


