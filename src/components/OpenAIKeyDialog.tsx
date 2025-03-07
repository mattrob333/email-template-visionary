import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveOpenAIKey, getOpenAIKey, clearOpenAIKey, hasOpenAIKey } from '../services/openai';
import { toast } from 'sonner';
import { Shield, ShieldAlert } from 'lucide-react';

interface OpenAIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OpenAIKeyDialog = ({ open, onOpenChange }: OpenAIKeyDialogProps) => {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    if (open) {
      setHasKey(hasOpenAIKey());
      // Only show placeholder stars if a key exists
      setApiKey(hasOpenAIKey() ? '••••••••••••••••••••••••••••••' : '');
    }
  }, [open]);

  const handleSave = () => {
    if (apiKey && apiKey !== '••••••••••••••••••••••••••••••') {
      saveOpenAIKey(apiKey);
      toast.success('API key saved successfully!');
      setHasKey(true);
      onOpenChange(false);
    } else if (!apiKey && hasKey) {
      // They cleared the field but had a key - keep the existing key
      onOpenChange(false);
    } else {
      toast.error('Please enter an API key');
    }
  };

  const handleRemove = () => {
    clearOpenAIKey();
    setApiKey('');
    setHasKey(false);
    toast.success('API key removed');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            OpenAI API Key
          </DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to enable AI chat functionality. Your key is stored locally in your browser and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="col-span-3"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Your API key will only be stored in your browser's local storage and not sent anywhere else.
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline ml-1"
              >
                Get your API key
              </a>
            </p>
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center">
          {hasKey && (
            <Button variant="destructive" onClick={handleRemove} type="button" size="sm">
              Remove Key
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancel
            </Button>
            <Button onClick={handleSave} type="submit">
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenAIKeyDialog;
