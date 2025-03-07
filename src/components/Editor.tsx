
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { TemplateModal, Template } from './TemplateModal';
import TemplateSelector from './TemplateSelector';
import { toast } from 'sonner';
import { Save, FileDown, FileUp, Code, Layout } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

export const Editor = ({ value, onChange, isDarkMode }: EditorProps) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSaveClick = () => {
    setIsTemplateModalOpen(true);
  };

  const handleTemplateSelect = (template: Template) => {
    onChange(template.html);
    toast.success('Template loaded successfully');
  };

  const handleExportHtml = () => {
    const blob = new Blob([value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('HTML exported successfully');
  };

  const handleImportHtml = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange(content);
        toast.success('HTML imported successfully');
      };
      reader.readAsText(file);
    }
  };

  const handleViewSource = () => {
    const formatted = value.replace(/></g, '>\n<');
    console.log(formatted);
    toast.success('HTML source code logged to console');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTemplateSelectorOpen(true)}
          >
            <Layout className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveClick}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportHtml}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export HTML
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".html"
              onChange={handleImportHtml}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              variant="outline"
              size="sm"
            >
              <FileUp className="h-4 w-4 mr-2" />
              Import HTML
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewSource}
          >
            <Code className="h-4 w-4 mr-2" />
            View Source
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 ${
            isDarkMode ? 'bg-card text-foreground' : 'bg-white text-black'
          }`}
          spellCheck="false"
        />
      </div>

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleTemplateSelect}
        currentHtml={value}
      />

      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        onSelect={(template) => {
          if (typeof template === 'string') {
            onChange(template);
          } else if (typeof template === 'object' && 'html' in template) {
            onChange(template.html);
          }
          toast.success('Template loaded successfully');
        }}
      />
    </div>
  );
};

export default Editor;
