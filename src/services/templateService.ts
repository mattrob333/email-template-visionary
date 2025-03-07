
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

    if (error) throw error;
    
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
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data ? data.map(item => ({
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

    if (error) throw error;
    
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
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting template:', error);
    return false;
  }
};
