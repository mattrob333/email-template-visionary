import { EmailImage } from './types';

/**
 * Generates an HTML img tag with embedded base64 data
 */
export const generateImgTag = (image: EmailImage): string => {
  try {
    // Ensure image_data is valid
    if (!image.image_data) {
      console.error('Invalid image data for image:', image.id);
      return `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EInvalid Image%3C/text%3E%3C/svg%3E" alt="${image.name || 'Image'}" style="max-width:100%;height:auto;" />`;
    }

    // Clean up the base64 data if it contains any whitespace or newlines
    const cleanedData = image.image_data.replace(/\s/g, '');
    
    // Check if base64 data has the correct format with data URI prefix
    let imageData = cleanedData;
    if (!cleanedData.startsWith('data:')) {
      const mimeType = image.image_type || 'image/png';
      imageData = `data:${mimeType};base64,${cleanedData}`;
      console.log(`[generateImgTag] Added missing data URI prefix for image: ${image.id}`);
    }
    
    // Keep alt text simple and ensure it doesn't contain quotes that could break HTML
    const altText = (image.name || 'Image').replace(/"/g, '&quot;');
    
    // Generate a properly structured HTML img tag with error handling
    const imgTag = `<img 
      src="${imageData}" 
      alt="${altText}" 
      ${image.width ? `width="${image.width}"` : ''} 
      ${image.height ? `height="${image.height}"` : ''} 
      style="max-width:100%;height:auto;" 
      loading="lazy" 
      onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'%3E%3Crect width=\\'100\\' height=\\'100\\' fill=\\'%23f0f0f0\\'/%3E%3Ctext x=\\'50\\' y=\\'50\\' font-family=\\'Arial\\' font-size=\\'12\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' fill=\\'%23999\\'%3EFailed to load image%3C/text%3E%3C/svg%3E';"
    />`;
    
    return imgTag;
  } catch (error) {
    console.error('Error generating img tag:', error);
    return `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EError%3C/text%3E%3C/svg%3E" alt="Error" style="max-width:100%;height:auto;" />`;
  }
};

/**
 * Generates a compact reference to an image using a specific pattern
 * that can be detected and expanded later
 */
export const generateImageReference = (image: EmailImage): string => {
  return `{{IMAGE:${image.id}}}`;
};
