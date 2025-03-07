import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Upload, PencilLine, Link2, Plus, X } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';

interface ImageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (imageHtml: string) => void;
}

interface UploadedImage {
  id: string;
  src: string;
  alt: string;
}

const ImageManager = ({ isOpen, onClose, onInsertImage }: ImageManagerProps) => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: UploadedImage = {
          id: Date.now().toString(),
          src: reader.result as string,
          alt: file.name,
        };
        setUploadedImages(prev => [...prev, newImage]);
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertUploadedImage = (image: UploadedImage) => {
    const imageHtml = `<img src="${image.src}" alt="${image.alt}" />`;
    onInsertImage(imageHtml);
    onClose();
  };

  const handleInsertImageUrl = () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" />`;
    onInsertImage(imageHtml);
    onClose();
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages(prev => prev.filter(image => image.id !== id));
    toast.success('Image removed');
  };

  const copyImageToClipboard = async (imageSrc: string) => {
    try {
      // Use writeText instead of ClipboardItem
      await navigator.clipboard.writeText(`<img src="${imageSrc}" alt="Image" />`);
      toast.success('Image HTML copied to clipboard');
      return true;
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      toast.error('Failed to copy image to clipboard');
      return false;
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[70vh] overflow-hidden flex flex-col animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Image className="h-5 w-5" />
            Image Manager
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center">
              <Link2 className="h-4 w-4 mr-2" />
              From URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <ScrollArea className="h-[350px]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                {uploadedImages.map((image) => (
                  <div 
                    key={image.id}
                    className="border rounded-lg overflow-hidden hover:border-primary transition-all cursor-pointer hover:shadow-md"
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-32 object-cover" 
                      onClick={() => handleInsertUploadedImage(image)}
                    />
                    <div className="flex items-center justify-between p-2 bg-muted">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyImageToClipboard(image.src)}
                        className="rounded-full"
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveImage(image.id)}
                        className="rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <Button onClick={handleFileInputClick}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-alt">Image Alt Text</Label>
                <Input
                  id="image-alt"
                  placeholder="Enter alt text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
              <Button onClick={handleInsertImageUrl}>Insert Image</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageManager;
