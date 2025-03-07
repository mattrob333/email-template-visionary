
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash, EditIcon, Plus } from "lucide-react";
import { toast } from 'sonner';

export interface Template {
  id: string;
  name: string;
  html: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

export const TemplateModal = ({ isOpen, onClose, onSelect }: TemplateModalProps) => {
  const [templates, setTemplates] = useLocalStorage<Template[]>('email-templates', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateName, setTemplateName] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setEditingTemplate(null);
      setTemplateName('');
    }
  }, [isOpen]);

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = (template: Template) => {
    onSelect(template);
    onClose();
  };

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    toast.success('Template deleted');
  };

  const handleEditClick = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTemplate(template);
    setTemplateName(template.name);
  };

  const saveTemplateEdit = () => {
    if (!editingTemplate) return;
    
    const updatedTemplates = templates.map(t => 
      t.id === editingTemplate.id 
        ? { ...t, name: templateName, updatedAt: new Date().toISOString() } 
        : t
    );
    
    setTemplates(updatedTemplates);
    setEditingTemplate(null);
    setTemplateName('');
    toast.success('Template updated');
  };

  const cancelEdit = () => {
    setEditingTemplate(null);
    setTemplateName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl">Email Templates</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="transition-all-fast"
            />
          </div>
          
          <ScrollArea className="h-[300px] rounded-md border p-2">
            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                <p>No templates found</p>
                <Button variant="link" className="mt-2">
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
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-3">
                      {editingTemplate?.id === template.id ? (
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="template-name">Template Name</Label>
                          <Input
                            id="template-name"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              Updated {new Date(template.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => handleEditClick(template, e)}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => handleDeleteTemplate(template.id, e)}
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
