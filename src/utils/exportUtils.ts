
/**
 * Copies the HTML code to clipboard
 */
export const copyToClipboard = async (html: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(html);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

/**
 * Opens Gmail compose with the HTML embedded
 * (Note: Gmail doesn't fully support pasting HTML directly, 
 * but this opens a new compose window)
 */
export const openInGmail = (html: string) => {
  // Gmail has a size limit for URLs, so this is a basic implementation
  // For more complex templates, users will need to copy and paste
  const subject = encodeURIComponent('HTML Email Template');
  const body = encodeURIComponent(html);
  
  // Open Gmail compose in a new tab
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
};

/**
 * Sanitizes HTML to prevent XSS attacks when rendering in the preview
 */
export const sanitizeHtml = (html: string): string => {
  // This is a very basic sanitizer
  // In a production app, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '');
};
