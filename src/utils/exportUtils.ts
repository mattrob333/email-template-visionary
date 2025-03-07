
import React from 'react';
import { expandImageReferences } from '../services/imageService';

/**
 * Copies the HTML code to clipboard
 */
export const copyToClipboard = async (html: string): Promise<boolean> => {
  try {
    // Process HTML to ensure Gmail compatibility
    const processedHtml = await expandImageReferences(html);
    await navigator.clipboard.writeText(processedHtml);
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

/**
 * Copies the rendered HTML content for Gmail with proper formatting
 */
export const copyRenderedContent = async (iframeRef: React.RefObject<HTMLIFrameElement>): Promise<boolean> => {
  try {
    if (!iframeRef.current) return false;
    
    const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!iframeDocument) return false;
    
    // Create a temporary textarea to hold the HTML content
    const tempTextArea = document.createElement('textarea');
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-9999px';
    tempTextArea.style.top = '-9999px';
    document.body.appendChild(tempTextArea);
    
    // For Gmail, we need to use the clipboard API with HTML format
    let formattedContent = iframeDocument.documentElement.innerHTML;
    
    // Process HTML to ensure Gmail compatibility with dark templates
    formattedContent = await expandImageReferences(formattedContent);
    
    // Create a Clipboard item with HTML format
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([formattedContent], { type: 'text/html' }),
      'text/plain': new Blob([formattedContent], { type: 'text/plain' })
    });
    
    // Use the Clipboard API to write with HTML format preserved
    await navigator.clipboard.write([clipboardItem]);
    
    // Clean up temporary element
    document.body.removeChild(tempTextArea);
    
    return true;
  } catch (err) {
    console.error('Failed to copy rendered content: ', err);
    
    // Fallback for browsers that don't support clipboard.write()
    try {
      if (!iframeRef.current) return false;
      
      const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!iframeDocument) return false;
      
      // Select all content in the iframe
      const range = iframeDocument.createRange();
      range.selectNodeContents(iframeDocument.body);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Execute copy command
        const successful = document.execCommand('copy');
        selection.removeAllRanges();
        
        return successful;
      }
      return false;
    } catch (fallbackErr) {
      console.error('Fallback copy method failed: ', fallbackErr);
      return false;
    }
  }
};

/**
 * Export HTML content as PDF
 */
export const exportAsPdf = async (
  iframeRef: React.RefObject<HTMLIFrameElement>, 
  options: {
    pageSize: 'letter' | 'a4',
    orientation: 'portrait' | 'landscape',
    filename: string
  }
): Promise<boolean> => {
  try {
    if (!iframeRef.current) return false;
    
    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!document) return false;
    
    // Import html2pdf dynamically
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Configure pdf options
    const opts = {
      margin: 10,
      filename: options.filename || 'email-template.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: 'mm',
        format: options.pageSize || 'letter',
        orientation: options.orientation || 'portrait'
      }
    };
    
    // Generate PDF from document body
    await html2pdf().from(document.body).set(opts).save();
    return true;
  } catch (err) {
    console.error('Failed to export as PDF: ', err);
    return false;
  }
};

/**
 * Generate a QR code data URL
 * Using qrcode.react directly instead of the qrcode library
 */
export const generateQRCode = async (text: string, size = 300): Promise<string> => {
  try {
    // Create a temporary container for the QR code
    const tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    
    // Dynamically import QRCodeSVG from qrcode.react
    const { QRCodeSVG } = await import('qrcode.react');
    
    // Render the QR code to get its SVG content
    const ReactDOM = await import('react-dom/client');
    const root = ReactDOM.createRoot(tempContainer);
    
    // Create a promise to capture when the QR code is rendered
    return new Promise((resolve) => {
      root.render(
        React.createElement(QRCodeSVG, {
          value: text,
          size: size,
          level: "M",
          fgColor: "#000000",
          bgColor: "#ffffff",
          ref: (node) => {
            if (node) {
              // Convert the SVG to a data URL
              const svgString = new XMLSerializer().serializeToString(node);
              const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
              
              // Clean up
              root.unmount();
              document.body.removeChild(tempContainer);
              
              resolve(dataUrl);
            }
          }
        })
      );
      
      // Fallback in case the ref callback doesn't fire
      setTimeout(() => {
        if (tempContainer.parentNode) {
          root.unmount();
          document.body.removeChild(tempContainer);
          resolve('');
        }
      }, 1000);
    });
  } catch (err) {
    console.error('Failed to generate QR code: ', err);
    return '';
  }
};

/**
 * Basic color validation for print
 */
export const isPrintSafeColor = (hex: string): boolean => {
  // Basic check for CMYK-safe colors (simplified)
  // In reality, this would be more complex with proper CMYK conversion
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Colors that are too saturated might not print well
  const isTooSaturated = 
    (r > 240 && g < 50 && b < 50) || // Very bright red
    (r < 50 && g > 240 && b < 50) || // Very bright green
    (r < 50 && g < 50 && b > 240);   // Very bright blue
    
  return !isTooSaturated;
};
