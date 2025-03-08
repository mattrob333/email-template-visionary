
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

    // Check if base64 data has the correct format
    if (!image.image_data.startsWith('data:')) {
      console.warn('Image data does not have correct format, adding prefix:', image.id);
      image.image_data = `data:${image.image_type || 'image/png'};base64,${image.image_data}`;
    }

    return `<img 
      src="${image.image_data}" 
      alt="${image.name || ''}" 
      ${image.width ? `width="${image.width}"` : ''} 
      ${image.height ? `height="${image.height}"` : ''} 
      style="max-width:100%;height:auto;" 
      loading="lazy" 
      onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'%3E%3Crect width=\\'100\\' height=\\'100\\' fill=\\'%23f0f0f0\\'/%3E%3Ctext x=\\'50\\' y=\\'50\\' font-family=\\'Arial\\' font-size=\\'12\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' fill=\\'%23999\\'%3EFailed to load image%3C/text%3E%3C/svg%3E';"
    />`;
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
