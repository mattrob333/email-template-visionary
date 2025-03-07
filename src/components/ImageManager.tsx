
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Image as ImageIcon, Link } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface ImageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageHtml: string) => void;
}

type ImageRatio = "original" | "1:1" | "4:3" | "16:9" | "banner";

interface ImageSizeOption {
  id: ImageRatio;
  name: string;
  width?: string;
  height?: string;
  class?: string;
}

const ImageManager = ({ isOpen, onClose, onInsert }: ImageManagerProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [uploadedImages, setUploadedImages] = useState<{ url: string, name: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<ImageRatio>("original");
  const [alignment, setAlignment] = useState("center");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const sizeOptions: ImageSizeOption[] = [
    { id: "original", name: "Original Size" },
    { id: "1:1", name: "Square (1:1)", class: "aspect-square" },
    { id: "4:3", name: "Standard (4:3)", class: "aspect-4/3" },
    { id: "16:9", name: "Widescreen (16:9)", class: "aspect-video" },
    { id: "banner", name: "Banner (Top)", width: "100%", height: "auto" }
  ];

  const handleInsert = () => {
    if (!imageUrl) {
      toast.error('Please enter an image URL or upload an image.');
      return;
    }

    const selectedOption = sizeOptions.find(option => option.id === selectedRatio);
    
    let styleAttr = '';
    let classAttr = '';
    
    if (selectedRatio === "original") {
      // Use custom dimensions if provided
      if (width || height) {
        styleAttr = `style="${width ? `width:${width}px;` : ''}${height ? `height:${height}px;` : ''}"`;
      }
    } else if (selectedOption) {
      if (selectedOption.class) {
        classAttr = `class="${selectedOption.class} ${alignment === 'left' ? 'float-left mr-4' : alignment === 'right' ? 'float-right ml-4' : 'mx-auto block'}"`;
      } else if (selectedOption.width || selectedOption.height) {
        styleAttr = `style="${selectedOption.width ? `width:${selectedOption.width};` : ''}${selectedOption.height ? `height:${selectedOption.height};` : ''}${alignment === 'left' ? 'float:left;margin-right:1rem;' : alignment === 'right' ? 'float:right;margin-left:1rem;' : 'display:block;margin:0 auto;'}"`;
      }
    }

    // Create a wrapper div for banner images with proper styling
    if (selectedRatio === "banner") {
      const imageHtml = `<div style="width:100%;margin-bottom:20px;text-align:center;">
  <img src="${imageUrl}" alt="${altText}" ${styleAttr} ${classAttr} />
</div>`;
      onInsert(imageHtml);
    } else {
      // Regular image insert
      const imageHtml = `<img src="${imageUrl}" alt="${altText}" ${styleAttr} ${classAttr} />`;
      onInsert(imageHtml);
    }
    
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    processUploadedFile(files[0]);
  };

  const processUploadedFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Convert to base64 to store locally
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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden animate-fade-in">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid gap-4">
              <div
                ref={dropZoneRef}
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragging ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="flex flex-col items-center justify-center gap-2 text-center cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">Drag & drop your image here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports JPEG, PNG, GIF, SVG</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </div>
              
              {isUploading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">Uploading...</span>
                </div>
              )}
              
              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your Images</Label>
                  <ScrollArea className="h-[150px] rounded-md border">
                    <div className="p-4 grid grid-cols-4 gap-2">
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
          
          <TabsContent value="url" className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="col-span-3" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="altText" className="text-right">
              Alt Text
            </Label>
            <Input id="altText" value={altText} onChange={(e) => setAltText(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Size Format
            </Label>
            <div className="col-span-3">
              <Select value={selectedRatio} onValueChange={(value) => setSelectedRatio(value as ImageRatio)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select image size" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedRatio === "original" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="width" className="text-right">
                  Width (px)
                </Label>
                <Input 
                  id="width" 
                  type="number"
                  value={width} 
                  onChange={(e) => setWidth(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Optional" 
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="height" className="text-right">
                  Height (px)
                </Label>
                <Input 
                  id="height" 
                  type="number"
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Optional" 
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Alignment
            </Label>
            <div className="col-span-3">
              <RadioGroup value={alignment} onValueChange={setAlignment} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="left" />
                  <Label htmlFor="left">Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="center" id="center" />
                  <Label htmlFor="center">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="right" />
                  <Label htmlFor="right">Right</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {imageUrl && (
          <div className="border rounded-md p-4 mt-2">
            <Label className="text-sm mb-2 block">Preview</Label>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded flex justify-center">
              <img 
                src={imageUrl} 
                alt={altText} 
                className={`max-w-full max-h-40 object-contain ${
                  selectedRatio === "1:1" ? "aspect-square" : 
                  selectedRatio === "4:3" ? "aspect-4/3" : 
                  selectedRatio === "16:9" ? "aspect-video" : ""
                }`} 
                style={{
                  width: selectedRatio === "banner" ? "100%" : width ? `${width}px` : "auto",
                  height: height ? `${height}px` : "auto"
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleInsert} disabled={!imageUrl}>Insert</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageManager;
