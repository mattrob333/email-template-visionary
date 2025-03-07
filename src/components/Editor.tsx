import { useState, useRef, useEffect } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { Button } from "@/components/ui/button";
import { TemplateModal, Template } from './TemplateModal';
import { TemplateSelector } from './TemplateSelector';
import { toast } from 'sonner';
import { Save, FileDown, FileUp, Code, Layout } from 'lucide-react';

export const Editor = () => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const getCurrentHtml = (): string => {
    return editorContent;
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSaveClick = () => {
    setIsTemplateModalOpen(true);
  };

  const handleTemplateSelect = (template: Template) => {
    if (editorRef.current) {
      editorRef.current.setContent(template.html);
      toast.success('Template loaded successfully');
    }
  };

  const handleExportHtml = () => {
    const content = editorContent;
    const blob = new Blob([content], { type: 'text/html' });
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
        if (editorRef.current) {
          editorRef.current.setContent(content);
          toast.success('HTML imported successfully');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleViewSource = () => {
    const content = editorContent;
    const formatted = content.replace(/></g, '>\n<');
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

      <div className="flex-1 min-h-0">
        <TinyMCEEditor
          ref={editorRef}
          init={{
            height: '100%',
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
          onEditorChange={handleEditorChange}
        />
      </div>

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleTemplateSelect}
        currentHtml={getCurrentHtml()}
      />

      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        onSelect={handleTemplateSelect}
      />
    </div>
  );
};
