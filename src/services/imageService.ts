
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
    console.log('Fetching image with ID:', id);
    const { data, error } = await supabase
      .from('email_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
    
    console.log('Image fetched successfully:', data ? 'Found' : 'Not found');
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
 * 
 * FIXED: This function now properly processes and replaces image references
 */
export const expandImageReferences = async (html: string): Promise<string> => {
  // Find all image references in the format {{IMAGE:id}}
  const regex = /\{\{IMAGE:([a-zA-Z0-9-]+)\}\}/g;
  
  try {
    console.log('[expandImageReferences] Starting processing');
    
    // If no references, return original HTML immediately
    if (!html.includes('{{IMAGE:')) {
      console.log('[expandImageReferences] No image references found');
      return html;
    }
    
    // Get all matches as an array
    const matches = Array.from(html.matchAll(regex));
    
    if (matches.length === 0) {
      console.log('[expandImageReferences] No image references detected via regex');
      return html;
    }
    
    console.log(`[expandImageReferences] Found ${matches.length} image references`);
    
    // Create a copy of the original HTML to work with
    let resultHTML = html;
    
    // Process each match sequentially
    for (const match of matches) {
      const fullMatch = match[0]; // The full {{IMAGE:id}} string
      const imageId = match[1];   // Just the ID part
      
      console.log(`[expandImageReferences] Processing reference: ${fullMatch} for ID: ${imageId}`);
      
      try {
        // Fetch image data from Supabase
        const image = await getImageById(imageId);
        
        if (!image) {
          console.error(`[expandImageReferences] Image with ID ${imageId} not found`);
          continue; // Skip this image and continue with others
        }
        
        console.log(`[expandImageReferences] Successfully fetched image: ${image.name}`);
        
        // Generate proper img tag with base64 data
        const imgTag = generateImgTag(image);
        
        // Replace all occurrences of this image reference
        console.log(`[expandImageReferences] Replacing ${fullMatch} with img tag`);
        
        // Use direct string replacement which is more reliable
        resultHTML = resultHTML.split(fullMatch).join(imgTag);
        
        console.log(`[expandImageReferences] Replacement completed for ${imageId}`);
      } catch (err) {
        console.error(`[expandImageReferences] Error processing image ${imageId}:`, err);
        // Continue with other images even if one fails
      }
    }
    
    console.log('[expandImageReferences] All replacements completed');
    return resultHTML;
  } catch (error) {
    console.error('[expandImageReferences] Fatal error during processing:', error);
    // Return the original HTML if there's a fatal error
    return html;
  }
};
