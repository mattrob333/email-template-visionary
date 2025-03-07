
import { supabase } from '@/integrations/supabase/client';

export interface EmailImage {
  id: string;
  name: string;
  description?: string;
  image_data: string;
  image_type: string;
  category: 'logo' | 'banner';
  width?: number;
  height?: number;
  created_at: string;
  updated_at: string;
}

export type NewEmailImage = Omit<EmailImage, 'id' | 'created_at' | 'updated_at'>;

/**
 * Saves an image to the email_images table in Supabase
 */
export const saveImage = async (image: NewEmailImage): Promise<EmailImage | null> => {
  try {
    console.log('Saving image to Supabase');
    
    const { data, error } = await supabase
      .from('email_images')
      .insert(image)
      .select()
      .single();

    if (error) {
      console.error('Error saving image:', error);
      throw error;
    }
    
    console.log('Image saved successfully');
    return data as EmailImage;
  } catch (error) {
    console.error('Failed to save image:', error);
    return null;
  }
};

/**
 * Gets all images from the email_images table in Supabase
 */
export const getImages = async (category?: 'logo' | 'banner'): Promise<EmailImage[]> => {
  try {
    let query = supabase
      .from('email_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
    
    return data as EmailImage[];
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return [];
  }
};

/**
 * Deletes an image from the email_images table in Supabase
 */
export const deleteImage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('email_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
};

/**
 * Gets an image by id from the email_images table in Supabase
 */
export const getImageById = async (id: string): Promise<EmailImage | null> => {
  try {
    const { data, error } = await supabase
      .from('email_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
    
    return data as EmailImage;
  } catch (error) {
    console.error('Failed to fetch image:', error);
    return null;
  }
};

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

/**
 * Generates an HTML img tag with embedded base64 data
 */
export const generateImgTag = (image: EmailImage): string => {
  return `<img src="${image.image_data}" alt="${image.name}" ${image.width ? `width="${image.width}"` : ''} ${image.height ? `height="${image.height}"` : ''} style="max-width:100%;height:auto;" />`;
};

/**
 * Generates a compact reference to an image using a specific pattern
 * that can be detected and expanded later
 */
export const generateImageReference = (image: EmailImage): string => {
  return `{{IMAGE:${image.id}}}`;
};

/**
 * Replaces all image references in the HTML with the actual base64 data
 * Ensures content has proper contrast for Gmail compatibility
 */
export const expandImageReferences = async (html: string): Promise<string> => {
  // Find all image references in the format {{IMAGE:id}}
  const regex = /\{\{IMAGE:([a-zA-Z0-9-]+)\}\}/g;
  let result = html;
  let match;

  const promises: Promise<void>[] = [];
  const replacements: { search: string; replace: string }[] = [];

  while ((match = regex.exec(html)) !== null) {
    const fullMatch = match[0];
    const imageId = match[1];
    
    const promise = getImageById(imageId).then(image => {
      if (image) {
        // Replace with proper img tag
        replacements.push({
          search: fullMatch,
          replace: generateImgTag(image)
        });
      }
    });
    
    promises.push(promise);
  }

  await Promise.all(promises);
  
  // Apply all replacements
  replacements.forEach(({search, replace}) => {
    result = result.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
  });
  
  // Make sure the content is readable in Gmail by modifying dark background styles
  // Improve text contrast for Gmail compatibility
  result = result
    // Change dark backgrounds to light colors
    .replace(/background-color:\s*#121212/g, 'background-color: #ffffff')
    .replace(/background-color:\s*#1e1e1e/g, 'background-color: #f8f9fa')
    .replace(/background-color:\s*#2a2a2a/g, 'background-color: #f1f1f1')
    // Change light text on dark backgrounds to dark text
    .replace(/color:\s*#e0e0e0/g, 'color: #333333')
    .replace(/color:\s*#ffffff/g, 'color: #222222')
    .replace(/color:\s*#9ca3af/g, 'color: #666666')
    // Fix button text color for contrast
    .replace(/(background-color:\s*#0beba2.*?color:\s*)#121212/g, '$1#000000')
    // Fix specific color combinations used in templates
    .replace(/color:\s*#6c757d/g, 'color: #595959');
  
  return result;
};
