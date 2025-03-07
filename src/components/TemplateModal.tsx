
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash, Edit, Plus, Copy, FileIcon } from "lucide-react";
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Template {
  id: string;
  name: string;
  html: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
  currentHtml?: string;
}

// Default templates to pre-populate the library
const defaultTemplates: Template[] = [
  {
    id: 'default-email-1',
    name: 'Simple Newsletter',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Simple Newsletter</title></head><body><div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;"><div style="background-color: #f5f5f5; padding: 20px; text-align: center;"><h1>Newsletter Title</h1></div><div style="padding: 20px;"><p>Hello,</p><p>This is a simple newsletter template you can customize.</p></div></div></body></html>`,
    category: 'email',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true
  },
  {
    id: 'default-print-1',
    name: 'Business Letter',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Business Letter</title></head><body style="font-family: 'Times New Roman', serif; margin: 1in;"><div style="text-align: right;"><p>Your Name<br>Your Address<br>City, State ZIP</p><p>Date: ${new Date().toLocaleDateString()}</p></div><div style="margin-top: 1in;"><p>Recipient Name<br>Recipient Address<br>City, State ZIP</p><p>Dear Recipient,</p><div style="margin: 1em 0;"><p>This is a formal business letter template you can customize for your needs.</p></div><p>Sincerely,</p><p>Your Name</p></div></body></html>`,
    category: 'print',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true
  },
  {
    id: 'default-gmail-1',
    name: 'Professional Signature',
    html: `<div style="font-family: Arial, sans-serif; font-size: 12px; color: #333333; border-top: 1px solid #dddddd; padding-top: 10px; margin-top: 10px;"><p style="margin: 0;"><strong>Your Name</strong><br>Your Title | Your Company<br>Email: your.email@example.com<br>Phone: (123) 456-7890</p></div>`,
    category: 'gmail',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true
  }
];

export const TemplateModal = ({ isOpen, onClose, onSelect, currentHtml }: TemplateModalProps) => {
  const [templates, setTemplates] = useLocalStorage<Template[]>('email-templates', defaultTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState<string>('email');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setEditingTemplate(null);
      setTemplateName('');
      setIsCreatingNew(false);
      setTemplateCategory('email');
    }
  }, [isOpen]);

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = (template: Template) => {
    onSelect(template);
    onClose();
  };

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent deletion of default templates
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      toast.error('Default templates cannot be deleted');
      return;
    }
    
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    toast.success('Template deleted');
  };

  const handleEditClick = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateCategory(template.category);
  };

  const handleDuplicateTemplate = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newTemplate: Template = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false
    };
    
    setTemplates([...templates, newTemplate]);
    toast.success('Template duplicated');
  };

  const saveTemplateEdit = () => {
    if (!editingTemplate) return;
    
    if (!templateName.trim()) {
      toast.error('Template name cannot be empty');
      return;
    }
    
    const updatedTemplates = templates.map(t => 
      t.id === editingTemplate.id 
        ? { ...t, name: templateName, category: templateCategory, updatedAt: new Date().toISOString() } 
        : t
    );
    
    setTemplates(updatedTemplates);
    setEditingTemplate(null);
    setTemplateName('');
    toast.success('Template updated');
  };

  const createNewTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    
    if (!currentHtml) {
      toast.error('No content to save');
      return;
    }
    
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: templateName,
      html: currentHtml,
      category: templateCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTemplates([...templates, newTemplate]);
    setIsCreatingNew(false);
    setTemplateName('');
    toast.success('Template saved');
  };

  const cancelEdit = () => {
    setEditingTemplate(null);
    setTemplateName('');
  };

  const cancelCreate = () => {
    setIsCreatingNew(false);
    setTemplateName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl">Email Templates</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="transition-all-fast"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreatingNew(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Save current
            </Button>
          </div>
          
          {isCreatingNew && (
            <Card className="p-3">
              <CardContent className="p-0 py-3">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="new-template-name">Template Name</Label>
                    <Input
                      id="new-template-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Enter template name"
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-template-category">Category</Label>
                    <Select
                      value={templateCategory}
                      onValueChange={setTemplateCategory}
                    >
                      <SelectTrigger id="new-template-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="print">Print</SelectItem>
                        <SelectItem value="gmail">Gmail Signature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 p-3 pt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={cancelCreate}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={createNewTemplate}
                >
                  Save Template
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <ScrollArea className="h-[300px] rounded-md border p-2">
            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                <p>No templates found</p>
                <Button variant="link" className="mt-2" onClick={() => setIsCreatingNew(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create a new template
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer hover:bg-muted/50 transition-all-fast ${
                      editingTemplate?.id === template.id ? 'ring-1 ring-primary' : ''
                    } ${template.isDefault ? 'border-primary/20' : ''}`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-3">
                      {editingTemplate?.id === template.id ? (
                        <div className="flex flex-col space-y-2">
                          <div>
                            <Label htmlFor="template-name">Template Name</Label>
                            <Input
                              id="template-name"
                              value={templateName}
                              onChange={(e) => setTemplateName(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          </div>
                          <div>
                            <Label htmlFor="template-category">Category</Label>
                            <Select
                              value={templateCategory}
                              onValueChange={setTemplateCategory}
                              onOpenChange={(e) => e && e.stopPropagation()}
                            >
                              <SelectTrigger 
                                id="template-category"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="print">Print</SelectItem>
                                <SelectItem value="gmail">Gmail Signature</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <FileIcon className="h-4 w-4 text-muted-foreground" />
                              <h3 className="font-medium">
                                {template.name}
                                {template.isDefault && (
                                  <span className="ml-2 text-xs text-primary">(Default)</span>
                                )}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs capitalize px-2 py-0.5 bg-muted rounded-full">
                                {template.category}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Updated {new Date(template.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => handleDuplicateTemplate(template, e)}
                              title="Duplicate"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => handleEditClick(template, e)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => handleDeleteTemplate(template.id, e)}
                              disabled={template.isDefault}
                              title={template.isDefault ? "Default templates cannot be deleted" : "Delete"}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    {editingTemplate?.id === template.id && (
                      <CardFooter className="flex justify-end space-x-2 p-3 pt-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEdit();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveTemplateEdit();
                          }}
                        >
                          Save
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
