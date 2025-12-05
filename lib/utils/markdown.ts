/**
 * Simple markdown to HTML converter for basic formatting
 * Supports bold (**text**) and links ([text](url))
 */

export function markdownToHtml(text: string): string {
  if (!text) return '';
  
  let html = text;
  
  // Convert bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert links: [text](url) -> <a href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
  
  // Convert line breaks to <br> tags
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

/**
 * Convert HTML back to markdown (for editing)
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  
  let markdown = html;
  
  // Convert <strong> tags back to **text**
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
  
  // Convert <a> tags back to [text](url)
  markdown = markdown.replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');
  
  // Convert <br> tags back to line breaks
  markdown = markdown.replace(/<br\s*\/?>/g, '\n');
  
  return markdown;
}
