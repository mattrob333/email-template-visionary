
import { supabase } from '@/integrations/supabase/client';
import { Template } from '../components/TemplateModal';

export interface SupabaseTemplate {
  id: string;
  user_id?: string;
  name: string;
  html: string;
  category: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export const saveTemplate = async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template | null> => {
  try {
    console.log('Saving template to Supabase:', template);
    
    const { data, error } = await supabase
      .from('templates')
      .insert({
        name: template.name,
        html: template.html,
        category: template.category,
        thumbnail: template.thumbnail || null
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error when saving template:', error);
      throw error;
    }
    
    console.log('Template saved successfully:', data);
    
    return data ? {
      id: data.id,
      name: data.name,
      html: data.html,
      category: data.category,
      thumbnail: data.thumbnail || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } : null;
  } catch (error) {
    console.error('Error saving template:', error);
    return null;
  }
};

export const getTemplates = async (): Promise<Template[]> => {
  try {
    console.log('Fetching templates from Supabase');
    
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error when fetching templates:', error);
      throw error;
    }

    console.log('Templates fetched successfully:', data);

    return data ? data.map((item: any) => ({
      id: item.id,
      name: item.name,
      html: item.html,
      category: item.category,
      thumbnail: item.thumbnail || undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) : [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};

export const updateTemplate = async (template: Template): Promise<Template | null> => {
  try {
    console.log('Updating template in Supabase:', template);
    
    const { data, error } = await supabase
      .from('templates')
      .update({
        name: template.name,
        html: template.html,
        category: template.category,
        thumbnail: template.thumbnail || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', template.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error when updating template:', error);
      throw error;
    }
    
    console.log('Template updated successfully:', data);
    
    return data ? {
      id: data.id,
      name: data.name,
      html: data.html,
      category: data.category,
      thumbnail: data.thumbnail || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } : null;
  } catch (error) {
    console.error('Error updating template:', error);
    return null;
  }
};

export const deleteTemplate = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting template from Supabase, id:', id);
    
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error when deleting template:', error);
      throw error;
    }
    
    console.log('Template deleted successfully');
    
    return true;
  } catch (error) {
    console.error('Error deleting template:', error);
    return false;
  }
};
