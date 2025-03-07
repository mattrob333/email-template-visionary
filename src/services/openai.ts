
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
    content: `You are an HTML code editor assistant. Your task is to modify HTML email templates based on user requests.

IMPORTANT RULES:
1. ONLY respond with the complete, modified HTML code and nothing else.
2. Do not include explanations, comments about what you changed, or any text outside the HTML code.
3. Preserve the structure, classes, and styling of the original template unless explicitly asked to change them.
4. Always return the full HTML document (including doctype, html, head, and body tags).
5. Make sure the HTML is valid and properly formatted.

Here is the current HTML content the user is working with:

\`\`\`html
${htmlContent}
\`\`\`

Remember: Your response should ONLY be the modified HTML code, nothing else.`
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
