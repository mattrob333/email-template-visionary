import { useState } from 'react';
import { Moon, Sun, Save, FileCode, Image, FileText, Menu, Copy, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TemplateModal } from './TemplateModal';
import TemplateSelector from './TemplateSelector';
import ImageManager from './ImageManager';
import { toast } from 'sonner';
import { copyRenderedContent } from '../utils/exportUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  htmlContent: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSaveTemplate: () => void;
  onLoadTemplate: (template: any) => void;
  onLoadNewTemplate: (html: string) => void;
  onInsertImage: (imageHtml: string) => void;
  previewRef: any;
  previewMode: 'email' | 'print';
  onExportPdf: () => void;
  isExporting: boolean;
  showAIChat?: boolean;
  toggleAIChat?: () => void;
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
  onExportPdf,
  isExporting,
  showAIChat = false,
  toggleAIChat = () => {},
}: NavbarProps) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSelectTemplateOpen, setIsSelectTemplateOpen] = useState(false);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  
  const handleInsertImageFromModal = (imageHtml: string) => {
    onInsertImage(imageHtml);
  };

  const handleCopyForGmail = async () => {
    if (!previewRef.current) {
      toast.error('Preview not available');
      return;
    }
    
    setIsCopying(true);
    
    try {
      const success = await copyRenderedContent(previewRef.current.getIframeRef());
      
      if (success) {
        toast.success('Formatted content copied to clipboard. Ready to paste into Gmail!');
      } else {
        toast.error('Failed to copy content');
      }
    } catch (error) {
      toast.error('An error occurred while copying content');
      console.error('Copy error:', error);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <header className="bg-background border-b border-border/40 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold lg:text-xl">Email Designer</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="hidden md:flex"
              onClick={() => setIsTemplateModalOpen(true)}
            >
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex" 
              onClick={() => setIsSelectTemplateOpen(true)}
            >
              <FileCode className="h-4 w-4 mr-1" /> Templates
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="hidden md:flex"
              onClick={() => setIsImageManagerOpen(true)}
            >
              <Image className="h-4 w-4 mr-1" /> Images
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex"
              onClick={handleCopyForGmail}
              disabled={isCopying}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy for Gmail
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex"
              onClick={onExportPdf}
              disabled={isExporting}
            >
              <FileText className="h-4 w-4 mr-1" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            
            <Button
              variant={showAIChat ? "default" : "outline"}
              size="sm"
              className="hidden md:flex"
              onClick={toggleAIChat}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              AI Assistant
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={toggleDarkMode}
              className="hidden md:flex"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsTemplateModalOpen(true)}>
                  <Save className="h-4 w-4 mr-2" /> Save Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSelectTemplateOpen(true)}>
                  <FileCode className="h-4 w-4 mr-2" /> Load Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsImageManagerOpen(true)}>
                  <Image className="h-4 w-4 mr-2" /> Insert Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyForGmail} disabled={isCopying}>
                  <Copy className="h-4 w-4 mr-2" /> Copy for Gmail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportPdf} disabled={isExporting}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleAIChat}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {showAIChat ? 'Edit Code' : 'AI Assistant'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleDarkMode}>
                  {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <TemplateModal 
        isOpen={isTemplateModalOpen} 
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={onLoadTemplate}
        currentHtml={htmlContent}
        previewRef={previewRef}
      />
      
      <TemplateSelector
        isOpen={isSelectTemplateOpen}
        onClose={() => setIsSelectTemplateOpen(false)}
        onSelect={onLoadNewTemplate}
      />
      
      <ImageManager
        isOpen={isImageManagerOpen}
        onClose={() => setIsImageManagerOpen(false)}
        onInsert={onInsertImage}
      />
    </header>
  );
};

export default Navbar;
