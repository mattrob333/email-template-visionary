import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Editor } from '../components/Editor';
import Preview, { PreviewRef } from '../components/Preview';
import AIChat from '../components/AIChat';
import { Template } from '../components/TemplateModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportAsPdf } from '../utils/exportUtils';
import { saveTemplate as saveTemplateToSupabase } from '../services/templateService';

const initialTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #dee2e6;
    }
    .logo {
      max-width: 100%;
      height: auto;
      margin-bottom: 15px;
    }
    .content {
      padding: 20px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      margin-top: 10px;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Banner Image Area - Add your logo or banner here -->
    <div style="width:100%;text-align:center;margin-bottom:20px;">
      <!-- Image will go here -->
    </div>
    
    <div class="header">
      <h1>Welcome to Our Newsletter</h1>
    </div>
    <div class="content">
      <h2>Hello {{name}}!</h2>
      <p>Thank you for subscribing to our newsletter. We're excited to share the latest updates with you.</p>
      <p>Here are some highlights from {{company}}:</p>
      <ul>
        <li>New product launch coming soon</li>
        <li>Exclusive discounts for subscribers</li>
        <li>Tips and tricks from our experts</li>
      </ul>
      <p>Don't miss out on our upcoming events!</p>
      <a href="#" class="button">Learn More</a>
    </div>
    <div class="footer">
      <p>© 2023 {{company}}. All rights reserved.</p>
      <p>You're receiving this email because you signed up for our newsletter.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">View in browser</a></p>
    </div>
  </div>
</body>
</html>`;

const Index = () => {
  const [htmlContent, setHtmlContent] = useState(initialTemplate);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('email');
  const [templateThumbnail, setTemplateThumbnail] = useState('');
  const [templates, setTemplates] = useLocalStorage<Template[]>('email-templates', []);
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [previewMode, setPreviewMode] = useState<'email' | 'print'>('email');
  const [paperSize, setPaperSize] = useState<'letter' | 'a4'>('letter');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showGuides, setShowGuides] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAIChat, setShowAIChat] = useState(true); // Always show AI chat now

  const containerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<PreviewRef>(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSaveTemplate = () => {
    if (previewRef.current) {
      const thumbnail = previewRef.current.capturePreviewAsImage() || '';
      setTemplateThumbnail(thumbnail);
    }
    setIsDialogOpen(true);
  };

  const saveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    const newTemplate: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
      name: templateName,
      html: htmlContent,
      category: templateCategory,
      thumbnail: templateThumbnail,
    };
    
    try {
      const savedTemplate = await saveTemplateToSupabase(newTemplate);
      
      if (savedTemplate) {
        setTemplates([...templates, savedTemplate]);
        toast.success('Template saved to cloud successfully!');
      } else {
        const localTemplate: Template = {
          id: Date.now().toString(),
          ...newTemplate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTemplates([...templates, localTemplate]);
        toast.warning('Template saved locally only. Could not save to cloud.');
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      toast.warning('Template saved locally only. Could not save to cloud.');
    }
    
    setIsDialogOpen(false);
    setTemplateName('');
    setTemplateCategory('email');
    setTemplateThumbnail('');
  };

  const loadTemplate = (template: Template) => {
    setHtmlContent(template.html);
    toast.success(`Loaded template: ${template.name}`);
  };

  const handleInsertImage = (imageHtml: string) => {
    setHtmlContent(prev => prev + imageHtml);
    toast.success('Image inserted into template');
  };

  const handleLoadNewTemplate = (html: string) => {
    setHtmlContent(html);
    toast.success('Template loaded');
  };

  const handleExportPdf = () => {
    if (!previewRef.current) {
      toast.error('Preview not available');
      return;
    }
    
    setIsExporting(true);
    
    exportAsPdf(previewRef.current.getIframeRef(), {
      pageSize: 'letter',
      orientation: 'portrait',
      filename: 'document.pdf'
    }).then(success => {
      setIsExporting(false);
      if (success) {
        toast.success('PDF exported successfully!');
      } else {
        toast.error('Failed to export PDF');
      }
    }).catch(() => {
      setIsExporting(false);
      toast.error('Failed to export PDF');
    });
  };

  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    const container = containerRef.current;
    
    if (!resizeHandle || !container) return;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isResizingRef.current = true;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      const constrainedWidth = Math.max(20, Math.min(80, newWidth));
      setEditorWidth(constrainedWidth);
    };

    const onMouseUp = () => {
      isResizingRef.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    resizeHandle.addEventListener('mousedown', onMouseDown);

    return () => {
      resizeHandle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Navbar 
        htmlContent={htmlContent}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onSaveTemplate={handleSaveTemplate}
        onLoadTemplate={loadTemplate}
        onLoadNewTemplate={handleLoadNewTemplate}
        onInsertImage={handleInsertImage}
        previewRef={previewRef}
        previewMode={previewMode}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
      />
      
      <main className="flex-1 container mx-auto p-4 xl:max-w-[1600px] 2xl:max-w-[1800px] overflow-hidden">
        <div className="h-full rounded-lg overflow-hidden glass-panel" ref={containerRef}>
          <div className="flex h-full">
            <div 
              className="h-full transition-all-medium editor-preview-layout" 
              style={{ width: `${editorWidth}%` }}
            >
              <div className="overflow-auto">
                <Editor 
                  value={htmlContent} 
                  onChange={setHtmlContent} 
                  isDarkMode={isDarkMode}
                />
              </div>
              
              <div className="ai-chat-area">
                <AIChat 
                  htmlContent={htmlContent} 
                  onUpdateHtml={setHtmlContent} 
                />
              </div>
            </div>
            
            <div 
              ref={resizeHandleRef}
              className="resize-handle h-full transition-colors" 
            />
            
            <div 
              className="h-full transition-all-medium" 
              style={{ width: `${100 - editorWidth}%` }}
            >
              <Preview 
                ref={previewRef}
                htmlContent={htmlContent} 
                previewMode={previewMode}
                paperSize={paperSize}
                orientation={orientation}
                showGuides={showGuides}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] animate-fade-in">
          <DialogHeader>
            <DialogTitle>Save Template</DialogTitle>
            <DialogDescription>Enter a name and select a category for your template.</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="preview-container border rounded-md p-4 bg-gray-50 dark:bg-gray-800 overflow-hidden" style={{ height: "200px" }}>
              {templateThumbnail ? (
                <img 
                  src={templateThumbnail} 
                  alt="Template Preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Preview not available
                </div>
              )}
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter a name for your template"
                  className="col-span-3"
                  autoFocus
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="template-category">Category</Label>
                <Select value={templateCategory} onValueChange={setTemplateCategory}>
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
