
import { toast } from 'sonner';

/**
 * Utility functions for the preview component
 */

export const getPaperDimensions = (size: string, orient: string) => {
  const PPI = 96;
  
  let width, height;
  if (size === 'letter') {
    width = 8.5 * PPI;
    height = 11 * PPI;
  } else { // A4
    width = 8.27 * PPI;
    height = 11.69 * PPI;
  }
  
  return orient === 'landscape' 
    ? { width: height, height: width }
    : { width, height };
};

export const generatePrintStyles = (
  paperSize: 'letter' | 'a4', 
  orientation: 'portrait' | 'landscape',
  showGuides: boolean
) => {
  const dimensions = getPaperDimensions(paperSize, orientation);
  
  return `
    <style>
      @page {
        size: ${paperSize} ${orientation};
        margin: 0;
      }
      body {
        margin: 0;
        padding: 15mm;
        box-sizing: border-box;
        width: ${dimensions.width}px;
        height: ${dimensions.height}px;
        position: relative;
      }
      ${showGuides ? `
      /* Guides and markers */
      body::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px dashed #aaa;
        pointer-events: none;
        z-index: 9999;
      }
      /* Grid lines */
      body::after {
        content: '';
        position: absolute;
        top: 15mm;
        left: 15mm;
        right: 15mm;
        bottom: 15mm;
        background-image: linear-gradient(#eee 1px, transparent 1px), 
                          linear-gradient(90deg, #eee 1px, transparent 1px);
        background-size: 25mm 25mm;
        pointer-events: none;
        z-index: 9998;
      }
      ` : ''}
    </style>
  `;
};

export const applyStylesToHtml = (
  html: string, 
  previewMode: 'email' | 'print', 
  paperSize: 'letter' | 'a4', 
  orientation: 'portrait' | 'landscape', 
  showGuides: boolean
) => {
  let styledHtml = html;
  
  if (previewMode === 'print') {
    const printStyles = generatePrintStyles(paperSize, orientation, showGuides);
    styledHtml = styledHtml.replace(/<head>/, `<head>${printStyles}`);
  } else {
    styledHtml = styledHtml.replace(/@page\s*{[^}]*}/g, '');
  }
  
  return styledHtml;
};

export const handleIframeError = (error: unknown, htmlContent: string) => {
  console.error("[Preview] Error processing HTML for preview:", error);
  toast.error("Failed to render images in preview");
  return htmlContent;
};
