const allowedTags = new Set(['P', 'BR', 'H2', 'H3', 'STRONG', 'B', 'EM', 'I', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A']);

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

export function sanitizeRichText(html: string): string {
  if (typeof DOMParser === 'undefined') return escapeHtml(html);
  const document = new DOMParser().parseFromString(html, 'text/html');
  const sanitizeNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent || '');
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const element = node as HTMLElement;
    const content = Array.from(element.childNodes).map(sanitizeNode).join('');
    if (!allowedTags.has(element.tagName)) return content;
    const tag = element.tagName === 'B' ? 'strong' : element.tagName === 'I' ? 'em' : element.tagName.toLowerCase();
    if (tag === 'br') return '<br>';
    if (tag === 'a') {
      const href = element.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) return content;
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }
    return `<${tag}>${content}</${tag}>`;
  };
  return Array.from(document.body.childNodes).map(sanitizeNode).join('');
}
