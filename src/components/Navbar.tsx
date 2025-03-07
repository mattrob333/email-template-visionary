
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Copy,
  Mail,
  Save,
  LayoutGrid,
  Sun,
  Moon,
  FileDown,
  Image,
  Paintbrush,
  Printer,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { copyToClipboard, copyRenderedContent, exportAsPdf } from '../utils/exportUtils';
import { toast } from 'sonner';
import { TemplateModal, Template } from './TemplateModal';
import PrintOptions, { PrintSettings } from './PrintOptions';
import TemplateSelector from './TemplateSelector';
import ImageManager from './ImageManager';
import ColorPicker from './ColorPicker';

interface NavbarProps {
  htmlContent: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSaveTemplate: () => void;
  onLoadTemplate: () => void;
  onLoadNewTemplate: (html: string) => void;
  onInsertImage: (imageHtml: string) => void;
  previewRef: React.RefObject<any>;
  previewMode: 'email' | 'print';
  togglePreviewMode: () => void;
  onExportPdf: (options: PrintSettings) => void;
  onColorSelect: (color: string) => void;
}

const Navbar = ({ 
  htmlContent, 
  isDarkMode, 
  toggleDarkMode, 
  onSaveTemplate, 
  onLoadTemplate,
  onLoadNewTemplate,
  onInsertImage,
  previewRef,
  previewMode,
  togglePreviewMode,
  onExportPdf,
  onColorSelect
}: NavbarProps) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isPrintOptionsOpen, setIsPrintOptionsOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleCopyForGmail = async () => {
    if (!previewRef.current) {
      toast.error('Preview not available');
      return;
    }
    
    const success = await copyRenderedContent(previewRef.current.getIframeRef());
    if (success) {
      toast.success('Content copied for Gmail! Paste into your compose window');
    } else {
      toast.error('Failed to copy content');
    }
  };

  const handleExportPdf = () => {
    setIsPrintOptionsOpen(true);
  };

  return (
    <>
      <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-blur:bg-background/60 z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">
              HTML {previewMode === 'email' ? 'Email' : 'Flyer'} Designer
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="transition-all-fast"
              onClick={togglePreviewMode}
            >
              {previewMode === 'email' ? (
                <>
                  <Printer className="mr-2 h-4 w-4" />
                  Switch to Print Mode
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Switch to Email Mode
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="transition-all-fast"
              onClick={() => setIsTemplateSelectorOpen(true)}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Templates
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="transition-all-fast"
              onClick={() => setIsImageManagerOpen(true)}
            >
              <Image className="mr-2 h-4 w-4" />
              Images
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="transition-all-fast"
              onClick={() => setIsColorPickerOpen(true)}
            >
              <Paintbrush className="mr-2 h-4 w-4" />
              Colors
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="transition-all-fast"
              onClick={onSaveTemplate}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            
            {previewMode === 'email' ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="transition-all-fast"
                onClick={handleCopyForGmail}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy for Gmail
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="transition-all-fast"
                onClick={handleExportPdf}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            )}
            
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full transition-all-fast"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle dark mode</span>
            </Button>
          </div>
        </div>
      </header>
      
      <TemplateModal 
        isOpen={isTemplateModalOpen} 
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={onLoadTemplate}
      />
      
      <PrintOptions
        isOpen={isPrintOptionsOpen}
        onClose={() => setIsPrintOptionsOpen(false)}
        onExport={onExportPdf}
      />
      
      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        onSelect={onLoadNewTemplate}
      />
      
      <ImageManager
        isOpen={isImageManagerOpen}
        onClose={() => setIsImageManagerOpen(false)}
        onInsertImage={onInsertImage}
      />
      
      <ColorPicker
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        onSelectColor={onColorSelect}
        initialColor="#3b82f6"
        isPrintMode={previewMode === 'print'}
      />
    </>
  );
};

export default Navbar;
