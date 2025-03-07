
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
    content: `You are an HTML email editor assistant. Your job is to take user requests and modify the HTML code accurately.
Here is the current HTML that needs to be modified:
\`\`\`html
${htmlContent}
\`\`\`
CRITICAL INSTRUCTIONS:
1. Your response must ONLY contain the complete, updated HTML code with NO additional text.
2. Do not include any markdown formatting, backticks, code tags, or commentary.
3. Do not include tags like <userStyle> or any other non-standard HTML tags.
4. Do not add any explanations before or after the HTML.
5. The first character of your response must be "<" (the opening of the DOCTYPE or html tag).
6. The last characters should be the closing HTML tags.
7. Ensure the updated HTML remains valid and properly formatted for email clients.
8. Apply the user's requested changes while preserving the overall structure and styling.

Remember: Return NOTHING but the raw HTML code itself.`
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
