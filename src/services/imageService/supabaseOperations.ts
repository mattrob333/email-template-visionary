
import { supabase } from '@/integrations/supabase/client';
import { EmailImage, NewEmailImage } from './types';

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
