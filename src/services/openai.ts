
import { toast } from 'sonner';

const STORAGE_KEY = 'openai-api-key';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const getOpenAIKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const saveOpenAIKey = (key: string): void => {
  localStorage.setItem(STORAGE_KEY, key);
};

export const clearOpenAIKey = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasOpenAIKey = (): boolean => {
  return !!getOpenAIKey();
};

export const getChatCompletion = async (
  messages: ChatMessage[],
  htmlContent: string,
): Promise<string | null> => {
  const apiKey = getOpenAIKey();
  
  if (!apiKey) {
    toast.error('OpenAI API key is not set');
    return null;
  }

  // Include the HTML content as context in a system message
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `You are an AI assistant helping with HTML email templates. Here is the current HTML content the user is working with:\n\n\`\`\`html\n${htmlContent}\n\`\`\`\n\nProvide helpful, concise responses about the template. You can suggest improvements, help with HTML issues, or respond to questions about the template. If the user asks you to modify the HTML, explain what changes you would make.`
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [systemMessage, ...messages],
        max_tokens: 1000,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Error calling OpenAI API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to connect to OpenAI'}`);
    return null;
  }
};
