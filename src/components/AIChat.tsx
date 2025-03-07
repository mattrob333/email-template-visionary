import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCcw, Shield, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { ChatMessage, getChatCompletion, hasOpenAIKey } from '../services/openai';
import OpenAIKeyDialog from './OpenAIKeyDialog';

interface AIChatProps {
  htmlContent: string;
  onUpdateHtml: (newHtml: string) => void;
}

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const AIChat = ({ htmlContent, onUpdateHtml }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you write and edit your email template. You can ask me to modify your HTML or suggest improvements.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    if (!hasOpenAIKey()) {
      setIsKeyDialogOpen(true);
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    
    try {
      // Prepare messages for OpenAI API
      const apiMessages: ChatMessage[] = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role,
          content: m.content
        }));
      
      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: userMessage.content
      });
      
      // Get response from OpenAI
      const response = await getChatCompletion(apiMessages, htmlContent);
      
      if (response) {
        const aiResponse: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error('AI response error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([{
      role: 'assistant',
      content: 'Conversation cleared. How can I help with your email template?',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-border/40 bg-black/10 flex justify-between items-center">
        <h2 className="text-sm font-semibold flex items-center">
          <Bot className="mr-2 h-4 w-4" />
          AI Assistant
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={() => setIsKeyDialogOpen(true)}
          title="Configure OpenAI API Key"
        >
          <Shield className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <Tabs defaultValue="chat" className="flex flex-col flex-1">
        <TabsList className="mx-2 my-1 h-8">
          <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
          <TabsTrigger value="variables" className="text-xs">Variables</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] px-2 py-1 rounded-lg text-xs ${
                      message.role === 'user' 
                        ? 'bg-primary/10 text-primary-foreground/90 rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1 text-xs opacity-70">
                      {message.role === 'user' ? 
                        <><span>You</span><User className="h-3 w-3" /></> : 
                        <><Bot className="h-3 w-3" /><span>Assistant</span></>
                      }
                    </div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-50 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-2 border-t border-border/40 bg-black/5">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={clearConversation}
                title="Clear conversation"
                className="h-8 w-8"
              >
                <RefreshCcw className="h-3 w-3" />
              </Button>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasOpenAIKey() ? "Ask about your email template..." : "Add OpenAI API key to start chatting..."}
                disabled={loading}
                className="flex-1 h-8 text-sm"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={loading || !inputValue.trim()}
                size="icon"
                className="h-8 w-8"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="variables" className="flex-1 flex flex-col">
          <VariableManager htmlContent={htmlContent} onUpdateHtml={onUpdateHtml} />
        </TabsContent>
      </Tabs>

      <OpenAIKeyDialog 
        open={isKeyDialogOpen} 
        onOpenChange={setIsKeyDialogOpen} 
      />
    </div>
  );
};

// Template Variable Manager Component
const VariableManager = ({ htmlContent, onUpdateHtml }: AIChatProps) => {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [previewHtml, setPreviewHtml] = useState(htmlContent);
  
  // Extract variables from HTML on component mount and when HTML changes
  useEffect(() => {
    const extractedVars: Record<string, string> = {};
    const regex = /\{\{([^}]+)\}\}/g;
    let match;
    
    while ((match = regex.exec(htmlContent)) !== null) {
      const varName = match[1].trim();
      if (!extractedVars[varName]) {
        extractedVars[varName] = '';
      }
    }
    
    setVariables(extractedVars);
    // Reset preview HTML when source changes
    setPreviewHtml(htmlContent);
  }, [htmlContent]);
  
  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyVariables = () => {
    let updatedHtml = htmlContent;
    
    // Replace all variables in the HTML
    Object.entries(variables).forEach(([name, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${name}\\s*\\}\\}`, 'g');
      updatedHtml = updatedHtml.replace(regex, value);
    });
    
    // Update the preview
    setPreviewHtml(updatedHtml);
  };
  
  const saveWithVariables = () => {
    let updatedHtml = htmlContent;
    
    // Replace all variables in the HTML
    Object.entries(variables).forEach(([name, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${name}\\s*\\}\\}`, 'g');
      updatedHtml = updatedHtml.replace(regex, value);
    });
    
    // Update the actual HTML content
    onUpdateHtml(updatedHtml);
    toast.success('Template updated with your variables');
  };
  
  const insertVariableIntoTemplate = (name: string) => {
    // Insert {{variableName}} at cursor position or at the end
    const updatedHtml = htmlContent + `\n<!-- Example usage: -->\n<p>{{${name}}}</p>`;
    onUpdateHtml(updatedHtml);
    toast.success(`Variable {{${name}}} added to template`);
  };
  
  const addNewVariable = () => {
    const newVarName = `variable${Object.keys(variables).length + 1}`;
    setVariables(prev => ({
      ...prev,
      [newVarName]: ''
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {Object.keys(variables).length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Fill in the values for variables found in your template:
            </p>
            {Object.entries(variables).map(([name, value]) => (
              <div key={name} className="space-y-2">
                <label className="text-sm font-medium">{name}:</label>
                <Input
                  value={value}
                  onChange={(e) => handleVariableChange(name, e.target.value)}
                  placeholder={`Enter value for ${name}`}
                />
              </div>
            ))}
            <div className="flex space-x-2 pt-2">
              <Button onClick={applyVariables} variant="secondary" size="sm">
                Preview Changes
              </Button>
              <Button onClick={saveWithVariables} size="sm">
                Apply to Template
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
            <div className="text-muted-foreground">
              <p>No variables found in your template.</p>
              <p className="text-sm mt-2">Use double curly braces to create variables:</p>
              <pre className="bg-muted p-2 rounded mt-2 text-xs">{"{{name}}, {{email}}, {{company}}"}</pre>
            </div>
            <Button onClick={() => insertVariableIntoTemplate("name")} variant="outline" size="sm">
              Insert Example Variable
            </Button>
          </div>
        )}
      </ScrollArea>
      
      {Object.keys(variables).length > 0 && (
        <div className="p-4 border-t border-border/40">
          <Button onClick={addNewVariable} variant="outline" size="sm" className="w-full">
            Add Custom Variable
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIChat;
