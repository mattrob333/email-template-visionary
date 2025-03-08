
import { forwardRef, useRef, useImperativeHandle } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import PreviewCore from './preview/PreviewCore';
import { capturePreviewAsImage } from './preview/PreviewCapture';

interface PreviewProps {
  htmlContent: string;
  previewMode: 'email' | 'print';
  paperSize: 'letter' | 'a4';
  orientation: 'portrait' | 'landscape';
  showGuides: boolean;
}

export interface PreviewRef {
  getIframeRef: () => React.RefObject<HTMLIFrameElement>;
  capturePreviewAsImage: () => Promise<string | null>;
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
    capturePreviewAsImage: async () => {
      return capturePreviewAsImage(iframeRef);
    }
  }));

  return (
    <PreviewCore
      htmlContent={htmlContent}
      previewMode={previewMode}
      paperSize={paperSize}
      orientation={orientation}
      showGuides={showGuides}
      iframeRef={iframeRef}
    />
  );
});

Preview.displayName = 'Preview';

export default Preview;
