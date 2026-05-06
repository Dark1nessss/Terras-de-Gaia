export function decodeHtml(html: string): string {
  // Only decode specific safe HTML entities - prevents XSS via numeric entities
  const entities: { [key: string]: string } = {
    '&#8211;': '–',      // en dash-dash
    '&#8212;': '—',      // em dash-dash
    '&#8217;': "'",      // right single quote
    '&#8216;': "'",      // left single quote
    '&#8220;': '"',      // left double quote
    '&#8221;': '"',      // right double quote
    '&#8230;': '…',      // ellipsis
    '&#169;': '©',       // copyright
    '&#174;': '®',       // registered trademark
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };

  let decoded = html;
  Object.entries(entities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  });

  return decoded;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function cleanText(text: string): string {
  return stripHtml(decodeHtml(text));
}

export function truncateBreadcrumbTitle(text: string, maxLength: number = 60): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // If last space is reasonably close, truncate there instead
  if (lastSpaceIndex > maxLength * 0.65) {
    return truncated.slice(0, lastSpaceIndex) + '…';
  }
  
  return truncated + '…';
}
