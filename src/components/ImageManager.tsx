import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Image as ImageIcon, Link, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { getImages, saveImage, EmailImage, processImageFile } from '../services/imageService';

export interface ImageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageHtml: string) => void;
}

type ImageRatio = "original" | "1:1" | "4:3" | "16:9" | "banner";
type ImagePosition = "header" | "inline" | "footer";

interface ImageSizeOption {
  id: ImageRatio;
  name: string;
  width?: string;
  height?: string;
  class?: string;
}

const ImageManager = ({
  isOpen,
  onClose,
  onInsert
}: ImageManagerProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [uploadedImages, setUploadedImages] = useState<EmailImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<ImageRatio>("banner");
  const [alignment, setAlignment] = useState("center");
  const [position, setPosition] = useState<ImagePosition>("header");
  const [imageScale, setImageScale] = useState([100]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [imageName, setImageName] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [imageCategory, setImageCategory] = useState<'logo' | 'banner'>('banner');
  const [tabsCategory, setTabsCategory] = useState<'all' | 'logo' | 'banner'>('all');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const sizeOptions: ImageSizeOption[] = [{
    id: "original",
    name: "Original Size"
  }, {
    id: "1:1",
    name: "Square (1:1)",
    class: "aspect-square"
  }, {
    id: "4:3",
    name: "Standard (4:3)",
    class: "aspect-4/3"
  }, {
    id: "16:9",
    name: "Widescreen (16:9)",
    class: "aspect-video"
  }, {
    id: "banner",
    name: "Banner (Full Width)",
    width: "100%",
    height: "auto"
  }];

  useEffect(() => {
    if (isOpen) {
      loadImagesFromSupabase();
    }
  }, [isOpen, tabsCategory]);

  const loadImagesFromSupabase = async () => {
    setIsLoading(true);
    try {
      const category = tabsCategory !== 'all' ? tabsCategory : undefined;
      const images = await getImages(category as 'logo' | 'banner' | undefined);
      setUploadedImages(images);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (!imageUrl) {
      toast.error('Please enter an image URL or upload an image.');
      return;
    }

    const selectedOption = sizeOptions.find(option => option.id === selectedRatio);
    let styleAttr = '';
    let classAttr = '';
    const scale = imageScale[0] / 100;

    if (selectedRatio === "original") {
      if (width || height) {
        styleAttr = `style="${width ? `width:${Math.round(parseInt(width) * scale)}px;` : ''}${height ? `height:${Math.round(parseInt(height) * scale)}px;` : ''}max-width:100%;"`;
      } else {
        styleAttr = `style="max-width:100%;height:auto;${scale !== 1 ? `transform:scale(${scale});transform-origin:top left;` : ''}"`;
      }
    } else if (selectedOption) {
      if (selectedOption.class) {
        classAttr = `class="${selectedOption.class} ${alignment === 'left' ? 'float-left mr-4' : alignment === 'right' ? 'float-right ml-4' : 'mx-auto block'}"`;
        styleAttr = `style="max-width:100%;${scale !== 1 ? `transform:scale(${scale});transform-origin:top left;` : ''}"`;
      } else if (selectedOption.width || selectedOption.height) {
        styleAttr = `style="${selectedOption.width ? `width:${selectedOption.width};` : ''}${selectedOption.height ? `height:${selectedOption.height};` : ''}${alignment === 'left' ? 'float:left;margin-right:1rem;' : alignment === 'right' ? 'float:right;margin-left:1rem;' : 'display:block;margin:0 auto;'}max-width:100%;"`;
      }
    }

    let imageHtml = '';
    
    if (position === "header") {
      imageHtml = `<!-- Header Image -->
<div style="width:100%;text-align:center;margin-bottom:20px;">
  <img src="${imageUrl}" alt="${altText}" ${styleAttr} ${classAttr} />
</div>`;
    } else if (position === "footer") {
      imageHtml = `<!-- Footer Image -->
<div style="width:100%;text-align:center;margin-top:20px;">
  <img src="${imageUrl}" alt="${altText}" ${styleAttr} ${classAttr} />
</div>`;
    } else {
      if (selectedRatio === "banner") {
        imageHtml = `<!-- Full Width Image -->
<div style="width:100%;margin:15px 0;text-align:${alignment};">
  <img src="${imageUrl}" alt="${altText}" style="width:100%;max-width:100%;height:auto;" />
</div>`;
      } else {
        imageHtml = `<!-- Inline Image -->
<div style="margin:15px 0;text-align:${alignment};">
  <img src="${imageUrl}" alt="${altText}" ${styleAttr} ${classAttr} />
</div>`;
      }
    }

    onInsert(imageHtml);
    onClose();
    toast.success(`Image inserted as ${position === "header" ? "banner at top" : position === "footer" ? "banner at bottom" : "inline content"}`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processUploadedFile(files[0]);
  };

  const processUploadedFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    
    setIsUploading(true);
    try {
      const { base64, mimeType, width, height } = await processImageFile(file);
      setImageUrl(base64);
      setWidth(width.toString());
      setHeight(height.toString());
      if (!altText) {
        setAltText(file.name.split('.')[0]);
      }
      setIsUploading(false);
      toast.success('Image processed successfully');
      setActiveTab('library');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to process image');
      setIsUploading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!imageUrl || !imageName) {
      toast.error('Please provide an image and name');
      return;
    }

    setIsUploading(true);
    try {
      const savedImage = await saveImage({
        name: imageName,
        description: imageDescription || undefined,
        image_data: imageUrl,
        image_type: imageUrl.split(';')[0].split(':')[1],
        category: imageCategory,
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined
      });

      if (savedImage) {
        setUploadedImages(prev => [savedImage, ...prev]);
        toast.success('Image saved successfully');
        setImageName('');
        setImageDescription('');
      } else {
        toast.error('Failed to save image');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save image');
    } finally {
      setIsUploading(false);
    }
  };

  const selectUploadedImage = (image: EmailImage) => {
    setImageUrl(image.image_data);
    setAltText(image.name);
    if (image.width) setWidth(image.width.toString());
    if (image.height) setHeight(image.height.toString());
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
          <DialogDescription>
            Upload or select an existing image and customize how it appears in your email
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="library">Image Library</TabsTrigger>
            <TabsTrigger value="url">External URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid gap-4">
              <div 
                ref={dropZoneRef} 
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`} 
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
                  <span className="ml-2 text-sm text-muted-foreground">Processing image...</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="library" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Tabs value={tabsCategory} onValueChange={(v) => setTabsCategory(v as any)} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="logo">Logos</TabsTrigger>
                  <TabsTrigger value="banner">Banners</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadImagesFromSupabase}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {imageUrl && !uploadedImages.some(img => img.image_data === imageUrl) && (
              <div className="border rounded-md p-4 mb-4">
                <h3 className="text-sm font-medium mb-2">Save Current Image</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="image-name" className="text-right text-xs">Name</Label>
                    <Input 
                      id="image-name" 
                      value={imageName} 
                      onChange={e => setImageName(e.target.value)} 
                      className="col-span-3 h-8 text-sm" 
                      placeholder="Image name (required)"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="image-description" className="text-right text-xs">Description</Label>
                    <Input 
                      id="image-description" 
                      value={imageDescription} 
                      onChange={e => setImageDescription(e.target.value)} 
                      className="col-span-3 h-8 text-sm" 
                      placeholder="Optional description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="image-category" className="text-right text-xs">Category</Label>
                    <Select 
                      value={imageCategory} 
                      onValueChange={(v) => setImageCategory(v as 'logo' | 'banner')}
                    >
                      <SelectTrigger id="image-category" className="col-span-3 h-8 text-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="logo">Logo</SelectItem>
                        <SelectItem value="banner">Banner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={handleSaveImage} 
                      disabled={!imageName || isUploading}
                    >
                      Save to Library
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading images...</span>
              </div>
            ) : uploadedImages.length > 0 ? (
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4 grid grid-cols-3 gap-2">
                  {uploadedImages.map((image) => (
                    <div 
                      key={image.id} 
                      className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${imageUrl === image.image_data ? 'border-primary' : 'border-transparent'}`} 
                      onClick={() => selectUploadedImage(image)}
                    >
                      <img src={image.image_data} alt={image.name} className="w-full h-20 object-cover" />
                      {imageUrl === image.image_data && (
                        <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                        <p className="text-white text-xs truncate">
                          {image.name}
                          <span className="ml-1 text-xs text-gray-300">({image.category})</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No images found in your library.</p>
                <p className="text-xs text-muted-foreground mt-1">Upload an image and save it to your library.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input 
                id="imageUrl" 
                value={imageUrl} 
                onChange={e => setImageUrl(e.target.value)} 
                className="col-span-3" 
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="altText" className="text-right">
              Alt Text
            </Label>
            <Input 
              id="altText" 
              value={altText} 
              onChange={e => setAltText(e.target.value)} 
              className="col-span-3" 
              placeholder="Image description for accessibility"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Placement
            </Label>
            <div className="col-span-3">
              <RadioGroup value={position} onValueChange={setPosition as any} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="header" id="header" />
                  <Label htmlFor="header">Top Banner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inline" id="inline" />
                  <Label htmlFor="inline">Inline</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="footer" id="footer" />
                  <Label htmlFor="footer">Bottom Banner</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {position === "inline" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Size Format
              </Label>
              <div className="col-span-3">
                <Select value={selectedRatio} onValueChange={value => setSelectedRatio(value as ImageRatio)}>
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
          )}

          {position === "inline" && selectedRatio === "original" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="width" className="text-right">
                  Width (px)
                </Label>
                <Input 
                  id="width" 
                  type="number" 
                  value={width} 
                  onChange={e => setWidth(e.target.value)} 
                  placeholder="Optional" 
                  className="col-span-3" 
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
                  onChange={e => setHeight(e.target.value)} 
                  placeholder="Optional" 
                  className="col-span-3" 
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Image Scale
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Slider 
                  value={imageScale} 
                  onValueChange={setImageScale} 
                  max={100} 
                  min={10} 
                  step={5}
                />
                <span className="min-w-[40px] text-sm">{imageScale[0]}%</span>
              </div>
            </div>
          </div>

          {position === "inline" && (
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
          )}
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
                  width: position === "header" || position === "footer" || selectedRatio === "banner" 
                    ? "100%" 
                    : width ? `${width}px` : "auto",
                  height: height ? `${height}px` : "auto",
                  transform: `scale(${imageScale[0]/100})`,
                  transformOrigin: "top left"
                }} 
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleInsert} disabled={!imageUrl}>
            Insert {position === "header" ? "at Top" : position === "footer" ? "at Bottom" : "Inline"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageManager;
