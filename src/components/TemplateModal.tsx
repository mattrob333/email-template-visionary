
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Search, Edit, Trash2, Plus } from "lucide-react";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Template {
  id: string;
  name: string;
  html: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const defaultTemplates: Template[] = [
  {
    id: "default-email-1",
    name: "Simple Newsletter",
    html: `<!DOCTYPE html><html><head><title>Simple Newsletter</title></head><body><h1>My Newsletter</h1><p>Welcome to my newsletter!</p></body></html>`,
    category: "email",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-email-2",
    name: "Product Announcement",
    html: `<!DOCTYPE html><html><head><title>Product Announcement</title></head><body><h1>New Product!</h1><p>Check out our latest product.</p></body></html>`,
    category: "email",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-print-1",
    name: "Business Letter",
    html: `<!DOCTYPE html><html><head><title>Business Letter</title></head><body><div style="font-family: serif;"><h1>Company Name</h1><p>Dear Sir/Madam,</p><p>Business letter content goes here.</p><p>Sincerely,</p><p>John Doe</p></div></body></html>`,
    category: "print",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-gmail-1",
    name: "Professional Signature",
    html: `<div style="font-family: Arial, sans-serif; font-size: 12px; color: #333;"><p>John Doe</p><p>Marketing Manager</p><p>Example Company</p><p>Phone: (555) 555-5555</p></div>`,
    category: "gmail",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
  currentHtml: string;
}

export const TemplateModal = ({ isOpen, onClose, onSelect, currentHtml }: TemplateModalProps) => {
  const [storedTemplates, setStoredTemplates] = useLocalStorage<Template[]>('email-templates', []);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('email');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Initialize with default templates if none exist
  useEffect(() => {
    if (storedTemplates.length === 0) {
      setStoredTemplates([...defaultTemplates]);
    }
  }, [storedTemplates.length, setStoredTemplates]);

  // Update templates when stored templates change or search term changes
  useEffect(() => {
    let filteredTemplates = [...storedTemplates];
    
    // Filter by search term
    if (searchTerm) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category tab
    if (activeTab !== 'all') {
      filteredTemplates = filteredTemplates.filter(template => 
        template.category === activeTab
      );
    }
    
    setTemplates(filteredTemplates);
  }, [storedTemplates, searchTerm, activeTab]);

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    const newTemplate: Template = {
      id: editingTemplate ? editingTemplate.id : Date.now().toString(),
      name: newTemplateName,
      html: editingTemplate ? editingTemplate.html : currentHtml,
      category: newTemplateCategory,
      createdAt: editingTemplate ? editingTemplate.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingTemplate) {
      // Update existing template
      const updatedTemplates = storedTemplates.map(template => 
        template.id === editingTemplate.id ? newTemplate : template
      );
      setStoredTemplates(updatedTemplates);
      toast.success('Template updated successfully');
    } else {
      // Create new template
      setStoredTemplates([...storedTemplates, newTemplate]);
      toast.success('Template saved successfully');
    }

    // Reset the form
    setNewTemplateName('');
    setNewTemplateCategory('email');
    setIsCreatingTemplate(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (template: Template, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Prevent deletion of default templates
    if (template.id.startsWith('default-')) {
      toast.error('Cannot delete default templates');
      return;
    }

    const updatedTemplates = storedTemplates.filter(t => t.id !== template.id);
    setStoredTemplates(updatedTemplates);
    toast.success('Template deleted successfully');
  };

  const handleEditTemplate = (template: Template, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingTemplate(template);
    setNewTemplateName(template.name);
    setNewTemplateCategory(template.category);
    setIsCreatingTemplate(true);
  };

  const handleDuplicateTemplate = (template: Template, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const duplicatedTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setStoredTemplates([...storedTemplates, duplicatedTemplate]);
    toast.success('Template duplicated successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] h-[80vh] max-h-[700px] animate-fade-in">
        {isCreatingTemplate ? (
          <>
            <DialogHeader>
              <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Enter a name for your template"
                  className="col-span-3"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="template-category">Category</Label>
                <Select value={newTemplateCategory} onValueChange={setNewTemplateCategory}>
                  <SelectTrigger id="template-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="print">Print Document</SelectItem>
                    <SelectItem value="gmail">Gmail Signature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsCreatingTemplate(false);
                setEditingTemplate(null);
                setNewTemplateName('');
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>
                {editingTemplate ? 'Update Template' : 'Save Template'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl flex justify-between items-center">
                <span>Your Templates</span>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search templates..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => setIsCreatingTemplate(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Template
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="print">Print</TabsTrigger>
                <TabsTrigger value="gmail">Gmail Signature</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[500px] mt-4">
                {templates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                    <p className="text-muted-foreground mb-4">No templates found.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatingTemplate(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first template
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                    {templates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md ${
                          template.id.startsWith('default-') ? 'border-blue-200' : ''
                        }`}
                        onClick={() => onSelect(template)}
                      >
                        <div className="relative p-4 border-b bg-muted/50">
                          <div className="h-24 overflow-hidden text-xs opacity-70">
                            {template.html.substring(0, 200)}...
                          </div>
                          {template.id.startsWith('default-') && (
                            <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Default
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {new Date(template.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => handleDuplicateTemplate(template, e)}
                              className="h-8 w-8"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {!template.id.startsWith('default-') && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => handleEditTemplate(template, e)}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => handleDeleteTemplate(template, e)}
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
