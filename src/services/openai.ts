
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
    content: `You are an HTML email editor assistant. Your job is to take user requests and modify the HTML code accordingly.

Here is the current HTML that needs to be modified:

\`\`\`html
${htmlContent}
\`\`\`

IMPORTANT INSTRUCTIONS:
1. Take the user's request and modify the HTML code to implement it.
2. Respond ONLY with the complete updated HTML code.
3. Do not include any explanations, comments, markdown formatting or extra text.
4. When adding images, make sure to use proper HTML <img> tags.
5. Preserve the overall structure and style unless specifically asked to change it.
6. Return clean, valid HTML that can be directly used as an email template.`
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
        max_tokens: 2000,
        temperature: 0.3,
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
