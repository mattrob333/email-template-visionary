
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { toast } from 'sonner';
import { Image, Upload, Crop, Trash, QrCode, Copy } from 'lucide-react';
import ReactCrop, { Crop as CropType } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { QRCodeSVG } from 'qrcode.react';

export interface ImageItem {
  id: string;
  name: string;
  url: string;
  altText: string;
  type: 'header' | 'logo' | 'product' | 'qrcode' | 'other';
  width: number;
  height: number;
  createdAt: string;
}

interface ImageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (imageHtml: string) => void;
}

const ImageManager = ({ isOpen, onClose, onInsertImage }: ImageManagerProps) => {
  const [images, setImages] = useLocalStorage<ImageItem[]>('email-editor-images', []);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [newImageAlt, setNewImageAlt] = useState('');
  const [imageType, setImageType] = useState<'header' | 'logo' | 'product' | 'qrcode' | 'other'>('other');
  
  // For image cropping
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // For QR code generation
  const [qrCodeValue, setQrCodeValue] = useState('https://example.com');
  const [qrCodeSize, setQrCodeSize] = useState(300);
  const [qrCodeColor, setQrCodeColor] = useState('#000000');
  const [qrCodeBgColor, setQrCodeBgColor] = useState('#ffffff');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleCrop = () => {
    if (!imageRef.current || !crop.width || !crop.height) return;
    
    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    
    const base64Image = canvas.toDataURL('image/jpeg', 0.9);
    
    // Create image object
    const newImage: ImageItem = {
      id: Date.now().toString(),
      name: `Image ${images.length + 1}`,
      url: base64Image,
      altText: newImageAlt || `Image ${images.length + 1}`,
      type: imageType,
      width: Math.round(crop.width * scaleX),
      height: Math.round(crop.height * scaleY),
      createdAt: new Date().toISOString()
    };
    
    setImages([...images, newImage]);
    toast.success('Image added successfully');
    resetUploadState();
  };
  
  const handleGenerateQRCode = () => {
    if (!qrCodeValue.trim()) {
      toast.error('Please enter a value for the QR code');
      return;
    }
    
    // Create QR code canvas and convert to data URL
    const qrCodeElement = document.getElementById('qr-code-preview');
    if (!qrCodeElement) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = qrCodeSize;
    canvas.height = qrCodeSize;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // First fill with background color
    ctx.fillStyle = qrCodeBgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Then draw the QR code SVG
    const svgData = new XMLSerializer().serializeToString(qrCodeElement.querySelector('svg') as SVGElement);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Save the QR code as an image
      const qrCodeImage: ImageItem = {
        id: Date.now().toString(),
        name: `QR Code: ${qrCodeValue.substring(0, 20)}${qrCodeValue.length > 20 ? '...' : ''}`,
        url: canvas.toDataURL('image/png'),
        altText: `QR Code for ${qrCodeValue}`,
        type: 'qrcode',
        width: qrCodeSize,
        height: qrCodeSize,
        createdAt: new Date().toISOString()
      };
      
      setImages([...images, qrCodeImage]);
      toast.success('QR code added to image library');
      setQrCodeValue('https://example.com');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };
  
  const resetUploadState = () => {
    setUploadedImage(null);
    setNewImageAlt('');
    setCrop({
      unit: '%',
      width: 80,
      height: 80,
      x: 10,
      y: 10
    });
  };
  
  const insertSelectedImage = () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }
    
    // Generate image HTML with appropriate size attributes based on type
    let imageHtml = `<img src="${selectedImage.url}" alt="${selectedImage.altText}" `;
    
    // Set appropriate size based on image type
    if (selectedImage.type === 'header') {
      imageHtml += `width="600" style="width: 100%; max-width: 600px; height: auto;"`;
    } else if (selectedImage.type === 'logo') {
      imageHtml += `width="200" style="width: 200px; height: auto;"`;
    } else if (selectedImage.type === 'qrcode') {
      imageHtml += `width="300" height="300" style="width: 300px; height: 300px;"`;
    } else if (selectedImage.type === 'product') {
      imageHtml += `width="400" height="400" style="width: 400px; height: 400px;"`;
    } else {
      // Use original dimensions
      imageHtml += `width="${selectedImage.width}" height="${selectedImage.height}" style="width: auto; height: auto; max-width: 100%;"`;
    }
    
    imageHtml += ' />';
    
    onInsertImage(imageHtml);
    onClose();
    setSelectedImage(null);
  };
  
  const deleteImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
    
    toast.success('Image deleted successfully');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Image className="h-5 w-5" />
            Image Manager
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload & Crop
              </TabsTrigger>
              <TabsTrigger value="library">
                <Image className="h-4 w-4 mr-2" />
                Image Library
              </TabsTrigger>
              <TabsTrigger value="qrcode">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code Generator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="flex-1 overflow-auto">
              <div className="space-y-4">
                {!uploadedImage ? (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-md">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">Upload an image to crop and add to your library</p>
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                        Select Image
                      </div>
                      <Input 
                        id="image-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                      />
                    </Label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-md overflow-auto p-2">
                      <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        aspect={imageType === 'header' ? 3/1 : 
                                imageType === 'logo' ? 2/1 : 
                                imageType === 'product' || imageType === 'qrcode' ? 1/1 : 
                                undefined}
                      >
                        <img 
                          ref={imageRef}
                          src={uploadedImage} 
                          alt="Upload preview" 
                          className="max-w-full h-auto"
                        />
                      </ReactCrop>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="image-alt">Alt Text (for accessibility)</Label>
                        <Input 
                          id="image-alt" 
                          placeholder="Describe this image"
                          value={newImageAlt}
                          onChange={e => setNewImageAlt(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="image-type">Image Type</Label>
                        <select
                          id="image-type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                          value={imageType}
                          onChange={e => setImageType(e.target.value as any)}
                        >
                          <option value="header">Header Image (600px width)</option>
                          <option value="logo">Logo (200px width)</option>
                          <option value="product">Product Image (400×400px)</option>
                          <option value="qrcode">QR Code (300×300px)</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={resetUploadState}>
                        Cancel
                      </Button>
                      <Button onClick={handleCrop}>
                        <Crop className="h-4 w-4 mr-2" />
                        Crop & Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="library" className="flex-1">
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1">
                  {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Image className="h-12 w-12 mb-2 opacity-30" />
                      <p>Your image library is empty</p>
                      <Button variant="link" onClick={() => setActiveTab('upload')}>
                        Upload your first image
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 p-1">
                      {images.map((img) => (
                        <Card 
                          key={img.id}
                          className={`cursor-pointer overflow-hidden transition-all hover:ring-1 hover:ring-primary/50 ${
                            selectedImage?.id === img.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedImage(img)}
                        >
                          <CardContent className="p-2">
                            <div className="aspect-square bg-muted relative overflow-hidden rounded-sm">
                              <img 
                                src={img.url} 
                                alt={img.altText}
                                className="object-cover w-full h-full"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteImage(img.id);
                                }}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="mt-1 text-xs truncate">
                              {img.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {img.width}×{img.height}px
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                
                <div className="flex justify-between items-center mt-4 pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    {images.length} images in your library
                  </div>
                  <Button 
                    onClick={insertSelectedImage}
                    disabled={!selectedImage}
                  >
                    Insert Selected Image
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="qrcode" className="flex-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qr-value">QR Code Content</Label>
                    <Input 
                      id="qr-value" 
                      placeholder="URL or text"
                      value={qrCodeValue}
                      onChange={e => setQrCodeValue(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="qr-size">Size (pixels)</Label>
                    <Input 
                      id="qr-size" 
                      type="number"
                      min="100"
                      max="800"
                      value={qrCodeSize}
                      onChange={e => setQrCodeSize(parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="qr-color">QR Color</Label>
                      <div className="flex">
                        <Input 
                          id="qr-color" 
                          type="color"
                          value={qrCodeColor}
                          onChange={e => setQrCodeColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text"
                          value={qrCodeColor}
                          onChange={e => setQrCodeColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="qr-bg-color">Background</Label>
                      <div className="flex">
                        <Input 
                          id="qr-bg-color" 
                          type="color"
                          value={qrCodeBgColor}
                          onChange={e => setQrCodeBgColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text"
                          value={qrCodeBgColor}
                          onChange={e => setQrCodeBgColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleGenerateQRCode}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    <p>Tips for best QR code readability:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Use high contrast colors</li>
                      <li>Min 300×300px for print</li>
                      <li>Keep content short for best scanability</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md p-4">
                  <div className="bg-white p-4 rounded-md shadow-sm" id="qr-code-preview">
                    <QRCodeSVG 
                      value={qrCodeValue || 'https://example.com'}
                      size={qrCodeSize}
                      level="M"
                      fgColor={qrCodeColor}
                      bgColor={qrCodeBgColor}
                    />
                  </div>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    QR Code Preview
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageManager;
