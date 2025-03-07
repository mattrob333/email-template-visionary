
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { sanitizeHtml } from '../utils/exportUtils';

interface PreviewProps {
  htmlContent: string;
  previewMode: 'email' | 'print';
  paperSize: 'letter' | 'a4';
  orientation: 'portrait' | 'landscape';
  showGuides: boolean;
}

export interface PreviewRef {
  getIframeRef: () => React.RefObject<HTMLIFrameElement>;
}

const Preview = forwardRef<PreviewRef, PreviewProps>(({
  htmlContent, 
  previewMode = 'email',
  paperSize = 'letter',
  orientation = 'portrait',
  showGuides = false
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useImperativeHandle(ref, () => ({
    getIframeRef: () => iframeRef
  }));

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const document = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (document) {
        document.open();
        
        // Add print-specific styles if in print mode
        let styledHtml = sanitizeHtml(htmlContent);
        
        if (previewMode === 'print') {
          // Get dimensions in pixels (approximation)
          const dimensions = getPaperDimensions(paperSize, orientation);
          
          // Insert print-specific styles
          const printStyles = `
            <style>
              @page {
                size: ${paperSize} ${orientation};
                margin: 0;
              }
              body {
                margin: 0;
                padding: 15mm; /* Print margin */
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
          
          // Insert styles right after the <head> tag
          styledHtml = styledHtml.replace(/<head>/, `<head>${printStyles}`);
        }
        
        document.write(styledHtml);
        document.close();
      }
    }
  }, [htmlContent, previewMode, paperSize, orientation, showGuides]);

  // Get paper dimensions (approximation in pixels)
  const getPaperDimensions = (size: string, orient: string) => {
    // Pixels per inch (approximate for display)
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

  // Apply container style based on preview mode
  const containerStyle = previewMode === 'print' 
    ? {
        overflow: 'auto',
        backgroundColor: '#f0f0f0',
        padding: '2rem',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }
    : {};

  // Apply iframe style based on preview mode
  const iframeStyle = previewMode === 'print' 
    ? {
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transform: 'scale(0.8)',
        transformOrigin: 'top center',
        width: getPaperDimensions(paperSize, orientation).width + 'px',
        height: getPaperDimensions(paperSize, orientation).height + 'px'
      }
    : {};

  return (
    <div 
      className={`w-full h-full overflow-hidden rounded-md border border-border/50 email-preview bg-white`}
      style={containerStyle}
    >
      <iframe 
        ref={iframeRef} 
        title="Content Preview" 
        className="w-full h-full animate-fade-in"
        sandbox="allow-same-origin"
        style={iframeStyle}
      />
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
