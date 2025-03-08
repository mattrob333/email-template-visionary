
import { NewEmailImage } from './types';

/**
 * Processes a file into a base64 encoded string
 */
export const processImageFile = (file: File): Promise<{
  base64: string;
  mimeType: string;
  width: number;
  height: number;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }
      
      const base64 = event.target.result.toString();
      
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        resolve({
          base64,
          mimeType: file.type,
          width: img.width,
          height: img.height
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for dimension calculation'));
      };
      
      img.src = base64;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};
