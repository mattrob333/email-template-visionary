import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { sanitizeHtml } from '../utils/exportUtils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PreviewProps {
  htmlContent: string;
  previewMode: 'email' | 'print';
  paperSize: 'letter' | 'a4';
  orientation: 'portrait' | 'landscape';
  showGuides: boolean;
}

export interface PreviewRef {
  getIframeRef: () => React.RefObject<HTMLIFrameElement>;
  capturePreviewAsImage: () => string | null;
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
    getIframeRef: () => iframeRef,
    capturePreviewAsImage: () => {
      try {
        if (!iframeRef.current) return null;
        
        const iframe = iframeRef.current;
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (!iframeDocument) return null;

        const canvas = document.createElement('canvas');
        
        const scale = 0.3;
        const width = iframe.offsetWidth * scale;
        const height = iframe.offsetHeight * scale;
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        const html = iframeDocument.documentElement.outerHTML;
        
        ctx.font = '10px Arial';
        ctx.fillStyle = '#333333';
        ctx.fillText('Template Preview', width / 2 - 40, height / 2);
        
        const dataUrl = canvas.toDataURL('image/png');
        console.log('Thumbnail generated successfully');
        return dataUrl;
      } catch (err) {
        console.error('Error capturing preview as image:', err);
        
        try {
          const canvas = document.createElement('canvas');
          
          canvas.width = 300;
          canvas.height = 200;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return null;
          
          ctx.fillStyle = '#f5f5f5';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#333';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Template Preview', canvas.width / 2, canvas.height / 2);
          
          return canvas.toDataURL('image/png');
        } catch (fallbackErr) {
          console.error('Fallback thumbnail generation failed:', fallbackErr);
          return null;
        }
      }
    }
  }));

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const document = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (document) {
        document.open();
        
        let styledHtml = sanitizeHtml(htmlContent);
        
        if (previewMode === 'print') {
          const dimensions = getPaperDimensions(paperSize, orientation);
          
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
          
          styledHtml = styledHtml.replace(/<head>/, `<head>${printStyles}`);
        }
        
        document.write(styledHtml);
        document.close();
      }
    }
  }, [htmlContent, previewMode, paperSize, orientation, showGuides]);

  const getPaperDimensions = (size: string, orient: string) => {
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

  const previewContainerClass = previewMode === 'print' 
    ? 'w-full h-full bg-gray-100 p-6 flex justify-center'
    : 'w-full h-full';

  const iframeStyle = previewMode === 'print' 
    ? {
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transform: 'scale(0.8)',
        transformOrigin: 'top center',
        width: getPaperDimensions(paperSize, orientation).width + 'px',
        height: getPaperDimensions(paperSize, orientation).height + 'px'
      }
    : { width: '100%', height: '100%' };

  return (
    <div className={`w-full h-full overflow-hidden rounded-md border border-border/50 bg-white ${previewContainerClass}`}>
      <iframe 
        ref={iframeRef} 
        title="Content Preview" 
        className="border-0 animate-fade-in"
        sandbox="allow-same-origin"
        style={iframeStyle}
      />
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
