
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Printer, SquareStackIcon, Maximize, FileDown } from 'lucide-react';

interface PrintOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: PrintSettings) => void;
}

export interface PrintSettings {
  pageSize: 'letter' | 'a4';
  orientation: 'portrait' | 'landscape';
  showGuides: boolean;
  filename: string;
}

const PrintOptions = ({ isOpen, onClose, onExport }: PrintOptionsProps) => {
  const [settings, setSettings] = useState<PrintSettings>({
    pageSize: 'letter',
    orientation: 'portrait',
    showGuides: true,
    filename: 'flyer.pdf'
  });
  
  const handleChange = (key: keyof PrintSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleExport = () => {
    onExport(settings);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Print Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label>Paper Size</Label>
            <RadioGroup 
              value={settings.pageSize} 
              onValueChange={(v) => handleChange('pageSize', v)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="letter" id="page-letter" />
                <Label htmlFor="page-letter" className="cursor-pointer">
                  US Letter (8.5 × 11")
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="a4" id="page-a4" />
                <Label htmlFor="page-a4" className="cursor-pointer">
                  A4 (210 × 297mm)
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Orientation</Label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-muted ${
                  settings.orientation === 'portrait' ? 'bg-muted ring-1 ring-primary' : ''
                }`}
                onClick={() => handleChange('orientation', 'portrait')}
              >
                <div className="h-24 w-20 bg-primary/10 border border-primary/30 rounded shadow-sm mb-2"></div>
                <span className="text-sm font-medium">Portrait</span>
              </div>
              
              <div 
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-muted ${
                  settings.orientation === 'landscape' ? 'bg-muted ring-1 ring-primary' : ''
                }`}
                onClick={() => handleChange('orientation', 'landscape')}
              >
                <div className="h-16 w-24 bg-primary/10 border border-primary/30 rounded shadow-sm mb-2"></div>
                <span className="text-sm font-medium">Landscape</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-guides">Show Guides & Grid</Label>
                <div className="text-sm text-muted-foreground">
                  Visible in editor only, not in final PDF
                </div>
              </div>
              <Switch
                id="show-guides"
                checked={settings.showGuides}
                onCheckedChange={(v) => handleChange('showGuides', v)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filename">Filename</Label>
              <div className="flex">
                <input
                  id="filename"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={settings.filename}
                  onChange={(e) => handleChange('filename', e.target.value)}
                />
                <span className="flex items-center px-3 text-muted-foreground bg-muted rounded-r-md border border-l-0 border-input">
                  .pdf
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintOptions;
