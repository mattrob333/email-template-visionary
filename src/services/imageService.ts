
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
