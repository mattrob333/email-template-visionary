
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Copy,
  Mail,
  Save,
  LayoutGrid,
  Sun,
  Moon,
  Settings,
} from "lucide-react";
import { copyToClipboard, openInGmail } from '../utils/exportUtils';
import { toast } from 'sonner';
import { TemplateModal } from './TemplateModal';

interface NavbarProps {
  htmlContent: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSaveTemplate: () => void;
  onLoadTemplate: () => void;
}

const Navbar = ({ 
  htmlContent, 
  isDarkMode, 
  toggleDarkMode, 
  onSaveTemplate, 
  onLoadTemplate 
}: NavbarProps) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(htmlContent);
    if (success) {
      toast.success('HTML copied to clipboard!');
    } else {
      toast.error('Failed to copy HTML');
    }
  };

  const handleOpenInGmail = () => {
    openInGmail(htmlContent);
    toast.success('Opening Gmail compose window...');
  };

  return (
    <>
      <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-blur:bg-background/60 z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">
              HTML Email Editor
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="transition-all-fast"
              onClick={() => setIsTemplateModalOpen(true)}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Templates
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
            
            <Button 
              variant="outline" 
              size="sm" 
              className="transition-all-fast"
              onClick={handleCopyToClipboard}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy HTML
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="transition-all-fast"
              onClick={handleOpenInGmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              Gmail
            </Button>
            
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
    </>
  );
};

export default Navbar;
