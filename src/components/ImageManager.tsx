import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const handleInsert = () => {
    if (!imageUrl) {
      alert('Please enter an image URL.');
      return;
    }

    const imageHtml = `<img src="${imageUrl}" alt="${altText}" width="${width}" height="${height}" />`;
    onInsert(imageHtml);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] animate-fade-in">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="col-span-3" />
          </div>

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
            <Input id="width" value={width} onChange={(e) => setWidth(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">
              Height
            </Label>
            <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} className="col-span-3" />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleInsert}>Insert</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageManager;
