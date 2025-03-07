
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { isPrintSafeColor } from '../utils/exportUtils';
import { Check, Copy, AlertTriangle, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  initialColor?: string;
  isPrintMode?: boolean;
}

interface ColorPalette {
  name: string;
  colors: string[];
}

const TAILWIND_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',  
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e'
];

const PRINT_SAFE_COLORS = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
  '#FFFFFF', '#004D40', '#006064', '#01579B', '#0D47A1',
  '#1B5E20', '#1A237E', '#311B92', '#4A148C', '#880E4F',
  '#B71C1C', '#3E2723', '#263238', '#BF360C'
];

const PASTEL_COLORS = [
  '#F9F9F9', '#F5F5F5', '#EEEEEE', '#E0E0E0', '#D6E4FF',
  '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9',
  '#BBDEFB', '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9',
  '#DCEDC8', '#F0F4C3', '#FFF9C4', '#FFECB3', '#FFE0B2',
  '#FFCCBC'
];

const COLOR_PALETTES: ColorPalette[] = [
  { name: 'Tailwind', colors: TAILWIND_COLORS },
  { name: 'Print Safe', colors: PRINT_SAFE_COLORS },
  { name: 'Pastel', colors: PASTEL_COLORS }
];

const ColorPicker = ({ isOpen, onClose, onSelectColor, initialColor = '#000000', isPrintMode = false }: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [activeTab, setActiveTab] = useState('Tailwind');
  const [isPrintSafe, setIsPrintSafe] = useState(true);
  
  useEffect(() => {
    setSelectedColor(initialColor);
  }, [initialColor, isOpen]);
  
  useEffect(() => {
    if (isPrintMode) {
      setIsPrintSafe(isPrintSafeColor(selectedColor));
    }
  }, [selectedColor, isPrintMode]);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };
  
  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
  };
  
  const confirmColor = () => {
    onSelectColor(selectedColor);
    onClose();
  };
  
  const copyColorToClipboard = () => {
    navigator.clipboard.writeText(selectedColor);
    toast.success('Color copied to clipboard');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Color Picker
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <div className="space-y-2">
              <Label htmlFor="color-hex">Color Value</Label>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-md overflow-hidden border border-border">
                  <Input
                    type="color"
                    value={selectedColor}
                    onChange={handleColorChange}
                    className="h-10 w-10 p-0 m-0 border-0"
                  />
                </div>
                <Input
                  id="color-hex"
                  value={selectedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" variant="outline" onClick={copyColorToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-end">
              <div 
                className="h-[90px] w-[90px] rounded-md border border-border overflow-hidden shadow-sm flex items-center justify-center"
                style={{ backgroundColor: selectedColor }}
              >
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                  <div 
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {isPrintMode && !isPrintSafe && (
            <div className="bg-amber-50 text-amber-900 p-3 rounded-md flex items-start space-x-2 text-sm border border-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Print Warning:</strong> This color may not reproduce well in print. 
                Consider choosing from the Print Safe palette for better results.
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex border-b">
              {COLOR_PALETTES.map(palette => (
                <button
                  key={palette.name}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    activeTab === palette.name 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                  onClick={() => setActiveTab(palette.name)}
                >
                  {palette.name}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-9 gap-2">
              {COLOR_PALETTES.find(p => p.name === activeTab)?.colors.map(color => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-md border transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    selectedColor.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleSelectColor(color)}
                >
                  {selectedColor.toLowerCase() === color.toLowerCase() && (
                    <Check className={`h-4 w-4 mx-auto ${parseInt(color.slice(1), 16) > 0x7FFFFF ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={confirmColor}>
            <Check className="mr-2 h-4 w-4" />
            Select Color
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorPicker;
