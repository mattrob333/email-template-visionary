
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Image as ImageIcon, Link } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ImageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageHtml: string) => void;
}

const ImageManager = ({ isOpen, onClose, onInsert }: ImageManagerProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [uploadedImages, setUploadedImages] = useState<{ url: string, name: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleInsert = () => {
    if (!imageUrl) {
      toast.error('Please enter an image URL or upload an image.');
      return;
    }

    const imageHtml = `<img src="${imageUrl}" alt="${altText}" ${width ? `width="${width}"` : ''} ${height ? `height="${height}"` : ''} />`;
    onInsert(imageHtml);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Convert to base64 to store locally
      // In a production app, you'd upload to a server
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const base64Image = event.target.result.toString();
          
          // Add to uploaded images
          const newImage = {
            url: base64Image,
            name: file.name
          };
          
          setUploadedImages(prev => [...prev, newImage]);
          
          // Auto-select this image
          setImageUrl(base64Image);
          setAltText(file.name.split('.')[0]); // Use filename as alt text
          
          toast.success('Image uploaded successfully');
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read file');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setIsUploading(false);
    }
  };

  const selectUploadedImage = (image: { url: string, name: string }) => {
    setImageUrl(image.url);
    setAltText(image.name.split('.')[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] animate-fade-in">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Image URL</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="col-span-3" />
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid gap-4">
              <Label className="text-sm font-medium">Upload Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                  disabled={isUploading}
                />
                {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
              </div>
              
              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Uploaded Images</Label>
                  <ScrollArea className="h-[120px] rounded-md border">
                    <div className="p-4 grid grid-cols-3 gap-2">
                      {uploadedImages.map((image, index) => (
                        <div 
                          key={index} 
                          className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${imageUrl === image.url ? 'border-primary' : 'border-transparent'}`}
                          onClick={() => selectUploadedImage(image)}
                        >
                          <img src={image.url} alt={image.name} className="w-full h-20 object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                            <p className="text-white text-xs truncate">{image.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="altText" className="text-right">
              Alt Text
            </Label>
            <Input id="altText" value={altText} onChange={(e) => setAltText(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="width" className="text-right">
              Width
            </Label>
            <Input id="width" value={width} onChange={(e) => setWidth(e.target.value)} className="col-span-3" placeholder="Optional" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">
              Height
            </Label>
            <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} className="col-span-3" placeholder="Optional" />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleInsert} disabled={!imageUrl}>Insert</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageManager;
