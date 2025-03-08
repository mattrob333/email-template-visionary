
import { useEffect, useState, useCallback } from 'react';
import { sanitizeHtml } from '../../utils/exportUtils';
import { expandImageReferences } from '../../services/imageService';
import { applyStylesToHtml, getPaperDimensions, handleIframeError } from './PreviewUtils';
import { toast } from 'sonner';

interface PreviewCoreProps {
  htmlContent: string;
  previewMode: 'email' | 'print';
  paperSize: 'letter' | 'a4';
  orientation: 'portrait' | 'landscape';
  showGuides: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

const PreviewCore = ({
  htmlContent,
  previewMode,
  paperSize,
  orientation,
  showGuides,
  iframeRef
}: PreviewCoreProps) => {
  const [processedHtml, setProcessedHtml] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<Error | null>(null);

  // Processed HTML content with expanded image references
  const processHtml = useCallback(async () => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      console.log("[Preview] Starting image reference expansion");
      
      // Process the HTML content to expand image references
      const expandedHtml = await expandImageReferences(htmlContent);
      
      // Sanitize and style the expanded HTML
      const sanitizedHtml = sanitizeHtml(expandedHtml);
      const styledHtml = applyStylesToHtml(sanitizedHtml, previewMode, paperSize, orientation, showGuides);
      
      setProcessedHtml(styledHtml);
    } catch (error) {
      console.error("[Preview] Error processing HTML:", error);
      setProcessingError(error instanceof Error ? error : new Error('Unknown error processing HTML'));
      
      // Fall back to the original HTML content if expansion fails
      const sanitizedHtml = sanitizeHtml(htmlContent);
      const styledHtml = applyStylesToHtml(sanitizedHtml, previewMode, paperSize, orientation, showGuides);
      
      setProcessedHtml(styledHtml);
      handleIframeError(error, htmlContent);
    } finally {
      setIsProcessing(false);
    }
  }, [htmlContent, previewMode, paperSize, orientation, showGuides]);

  // Process HTML whenever inputs change
  useEffect(() => {
    processHtml();
  }, [processHtml]);

  // Update iframe content when processedHtml changes
  useEffect(() => {
    if (!iframeRef.current || !processedHtml || isProcessing) return;
    
    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!document) return;
    
    try {
      document.open();
      document.write(processedHtml);
      document.close();
      
      // Add event listeners to all images in the iframe to handle load errors
      const images = document.querySelectorAll('img');
      let imagesLoaded = 0;
      const totalImages = images.length;
      
      // If there are no images, consider it fully loaded
      if (totalImages === 0) {
        console.log("[Preview] Preview updated with processed HTML (no images)");
        return;
      }
      
      images.forEach(img => {
        // Handle image load
        img.addEventListener('load', () => {
          imagesLoaded++;
          if (imagesLoaded === totalImages) {
            console.log("[Preview] All images loaded successfully");
          }
        });
        
        // Handle image load errors
        img.addEventListener('error', (e) => {
          console.error('[Preview] Image failed to load:', e);
          imagesLoaded++;
          // The onerror attribute in the img tag will handle the display of a placeholder
        });
      });
      
      console.log("[Preview] Preview updated with processed HTML");
    } catch (error) {
      console.error("[Preview] Error writing to iframe:", error);
      toast.error("Error rendering preview");
    }
  }, [processedHtml, iframeRef, isProcessing]);

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
      {isProcessing && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
          <div className="bg-background p-4 rounded-md shadow-lg">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Processing images...</p>
          </div>
        </div>
      )}
      
      <iframe 
        ref={iframeRef} 
        title="Content Preview" 
        className="border-0 animate-fade-in"
        sandbox="allow-same-origin"
        style={iframeStyle}
      />
      
      {processingError && (
        <div className="absolute bottom-4 right-4">
          <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm shadow-lg">
            Error processing template
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewCore;
