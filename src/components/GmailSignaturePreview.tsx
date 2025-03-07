
import React from 'react';
import { GmailTemplate } from './GmailTemplates';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface GmailSignaturePreviewProps {
  template: GmailTemplate;
  onSelect: (template: GmailTemplate) => void;
}

const GmailSignaturePreview = ({ template, onSelect }: GmailSignaturePreviewProps) => {
  const copyToClipboard = (e: React.MouseEvent, html: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(html)
      .then(() => {
        toast.success("Gmail signature copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md rounded-md border border-border/50 bg-card">
      <div 
        className="relative pb-[150%] overflow-hidden bg-muted"
        onClick={() => onSelect(template)}
      >
        <div 
          className="absolute inset-0 hover:scale-105 transition-transform duration-200"
          style={{
            backgroundImage: `url(${template.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
      <div className="p-3 flex justify-between items-center">
        <h3 className="font-medium text-card-foreground">{template.name}</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => copyToClipboard(e, template.html)}
          className="text-xs"
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy
        </Button>
      </div>
    </div>
  );
};

export default GmailSignaturePreview;
