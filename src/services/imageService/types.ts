
/**
 * Types and interfaces for image service
 */

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
