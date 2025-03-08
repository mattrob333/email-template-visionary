
import html2canvas from 'html2canvas';

/**
 * Utilities for capturing the preview as an image
 */
export const capturePreviewAsImage = async (
  iframeRef: React.RefObject<HTMLIFrameElement>
): Promise<string | null> => {
  try {
    if (!iframeRef.current) {
      console.error('No iframe reference available for capture');
      return generateFallbackThumbnail();
    }
    
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDocument || !iframeDocument.body) {
      console.error('No document or body found in iframe for capture');
      return generateFallbackThumbnail();
    }
    
    // Wait a moment to ensure content is fully rendered
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Wait for all images to load
    const images = Array.from(iframeDocument.querySelectorAll('img'));
    if (images.length > 0) {
      console.log(`Waiting for ${images.length} images to load before capture`);
      try {
        await Promise.all(
          images.map(img => 
            new Promise((resolve, reject) => {
              if (img.complete) {
                resolve(true);
              } else {
                img.onload = () => resolve(true);
                img.onerror = () => {
                  console.warn('Image failed to load, continuing with capture');
                  resolve(false);
                };
                // Set a timeout for image loading
                setTimeout(() => {
                  console.warn('Image load timeout, continuing with capture');
                  resolve(false);
                }, 2000);
              }
            })
          )
        );
      } catch (err) {
        console.warn('Error waiting for images to load:', err);
      }
    }
    
    // Create a canvas from the iframe content
    const canvas = await html2canvas(iframeDocument.body, {
      scale: 0.3,
      logging: false,
      backgroundColor: null,
      allowTaint: true,
      useCORS: true,
      onclone: (clonedDoc) => {
        // Ensure images are loaded in cloned document
        const clonedImages = clonedDoc.getElementsByTagName('img');
        if (clonedImages.length > 0) {
          console.log(`Processing ${clonedImages.length} images for capture`);
          
          // Add placeholders for broken images
          Array.from(clonedImages).forEach(img => {
            if (!img.complete || img.naturalWidth === 0) {
              img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50\' y=\'50\' font-family=\'Arial\' font-size=\'12\' text-anchor=\'middle\' dominant-baseline=\'middle\' fill=\'%23999\'%3EImage%3C/text%3E%3C/svg%3E';
            }
          });
        }
      }
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
    if (!ctx) {
      console.error('Could not get canvas context for fallback thumbnail');
      return null;
    }
    
    // Create a more visually appealing fallback
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f5f5f5');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some visual elements
    ctx.fillStyle = '#ddd';
    ctx.fillRect(50, 50, canvas.width - 100, 30);
    ctx.fillRect(70, 100, canvas.width - 140, 20);
    ctx.fillRect(90, 130, canvas.width - 180, 20);
    
    // Add text
    ctx.fillStyle = '#666';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Template Preview', canvas.width / 2, canvas.height / 2 - 15);
    
    ctx.font = '12px Arial';
    ctx.fillText('(Image capture failed)', canvas.width / 2, canvas.height / 2 + 15);
    
    return canvas.toDataURL('image/png');
  } catch (fallbackErr) {
    console.error('Fallback thumbnail generation failed:', fallbackErr);
    return null;
  }
};
