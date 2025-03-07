
import { useRef } from 'react';
import { TemplateModal, Template } from './TemplateModal';
import TemplateSelector from './TemplateSelector';
import { toast } from 'sonner';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

export const Editor = ({ value, onChange, isDarkMode }: EditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    </div>
  );
};

export default Editor;
