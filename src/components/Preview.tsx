
import { useRef, useEffect } from 'react';
import { sanitizeHtml } from '../utils/exportUtils';

interface PreviewProps {
  htmlContent: string;
}

const Preview = ({ htmlContent }: PreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const document = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (document) {
        document.open();
        document.write(sanitizeHtml(htmlContent));
        document.close();
      }
    }
  }, [htmlContent]);

  return (
    <div className="w-full h-full overflow-hidden rounded-md border border-border/50 email-preview bg-white">
      <iframe 
        ref={iframeRef} 
        title="Email Preview" 
        className="w-full h-full animate-fade-in"
        sandbox="allow-same-origin"
      />
    </div>
  );
};

export default Preview;
