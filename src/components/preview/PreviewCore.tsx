
import { useEffect, useState } from 'react';
import { sanitizeHtml } from '../../utils/exportUtils';
import { expandImageReferences } from '../../services/imageService';
import { applyStylesToHtml, getPaperDimensions, handleIframeError } from './PreviewUtils';

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

  useEffect(() => {
    const processHtml = async () => {
      setIsProcessing(true);
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
        
        // Fall back to the original HTML content if expansion fails
        const sanitizedHtml = sanitizeHtml(htmlContent);
        const styledHtml = applyStylesToHtml(sanitizedHtml, previewMode, paperSize, orientation, showGuides);
        
        setProcessedHtml(styledHtml);
        handleIframeError(error, htmlContent);
      } finally {
        setIsProcessing(false);
      }
    };
    
    processHtml();
  }, [htmlContent, previewMode, paperSize, orientation, showGuides]);

  // Update iframe content when processedHtml changes
  useEffect(() => {
    if (!iframeRef.current || !processedHtml || isProcessing) return;
    
    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!document) return;
    
    document.open();
    document.write(processedHtml);
    document.close();
    
    console.log("[Preview] Preview updated with processed HTML");
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
      <iframe 
        ref={iframeRef} 
        title="Content Preview" 
        className="border-0 animate-fade-in"
        sandbox="allow-same-origin"
        style={iframeStyle}
      />
    </div>
  );
};

export default PreviewCore;
