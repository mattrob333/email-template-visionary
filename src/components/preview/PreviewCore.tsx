
import { useRef, useEffect } from 'react';
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
  useEffect(() => {
    const updateIframeContent = async () => {
      if (!iframeRef.current) return;
      
      const iframe = iframeRef.current;
      const document = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (!document) return;
      
      document.open();
      
      try {
        console.log("[Preview] Starting image reference expansion");
        
        const expandedHtml = await expandImageReferences(htmlContent);
        let styledHtml = sanitizeHtml(expandedHtml);
        
        styledHtml = applyStylesToHtml(styledHtml, previewMode, paperSize, orientation, showGuides);
        
        document.write(styledHtml);
        document.close();
        
        console.log("[Preview] Preview updated with expanded images");
      } catch (error) {
        let styledHtml = sanitizeHtml(htmlContent);
        styledHtml = applyStylesToHtml(styledHtml, previewMode, paperSize, orientation, showGuides);
        
        document.write(styledHtml);
        document.close();
        
        handleIframeError(error, htmlContent);
      }
    };
    
    updateIframeContent();
  }, [htmlContent, previewMode, paperSize, orientation, showGuides, iframeRef]);

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
