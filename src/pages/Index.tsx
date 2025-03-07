import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Editor } from '../components/Editor';
import Preview, { PreviewRef } from '../components/Preview';
import { Template } from '../components/TemplateModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportAsPdf } from '../utils/exportUtils';

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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Our Newsletter</h1>
    </div>
    <div class="content">
      <h2>Hello there!</h2>
      <p>Thank you for subscribing to our newsletter. We're excited to share the latest updates with you.</p>
      <p>Here are some highlights from this week:</p>
      <ul>
        <li>New product launch coming soon</li>
        <li>Exclusive discounts for subscribers</li>
        <li>Tips and tricks from our experts</li>
      </ul>
      <p>Don't miss out on our upcoming events!</p>
      <a href="#" class="button">Learn More</a>
    </div>
    <div class="footer">
      <p>© 2023 Your Company. All rights reserved.</p>
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
  const [templates, setTemplates] = useLocalStorage<Template[]>('email-templates', []);
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [previewMode, setPreviewMode] = useState<'email' | 'print'>('email');
  const [paperSize, setPaperSize] = useState<'letter' | 'a4'>('letter');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showGuides, setShowGuides] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
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
    setIsDialogOpen(true);
  };

  const saveTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: templateName,
      html: htmlContent,
      category: 'email',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates([...templates, newTemplate]);
    setIsDialogOpen(false);
    setTemplateName('');
    toast.success('Template saved successfully!');
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
    
    // Always use US Letter size for PDF export
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
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
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
      
      <main className="flex-1 container mx-auto p-4 pt-6">
        <div className="editor-container rounded-lg overflow-hidden glass-panel" ref={containerRef}>
          <div className="flex h-full">
            <div 
              className="h-full transition-all-medium" 
              style={{ width: `${editorWidth}%` }}
            >
              <Editor 
                value={htmlContent} 
                onChange={setHtmlContent} 
                isDarkMode={isDarkMode}
              />
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
        <DialogContent className="sm:max-w-[425px] animate-fade-in">
          <DialogHeader>
            <DialogTitle>Save Email Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter a name for your template"
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTemplate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
