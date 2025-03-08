
import html2canvas from 'html2canvas';

/**
 * Utilities for capturing the preview as an image
 */
export const capturePreviewAsImage = async (
  iframeRef: React.RefObject<HTMLIFrameElement>
): Promise<string | null> => {
  try {
    if (!iframeRef.current) return null;
    
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDocument || !iframeDocument.body) return null;
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(iframeDocument.body, {
      scale: 0.3,
      logging: false,
      backgroundColor: null,
      allowTaint: true,
      useCORS: true
    });
    
    const dataUrl = canvas.toDataURL('image/png');
    console.log('Thumbnail generated successfully');
    return dataUrl;
  } catch (err) {
    console.error('Error capturing preview as image:', err);
    return generateFallbackThumbnail();
  }
};

export const generateFallbackThumbnail = (): string | null => {
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
};
