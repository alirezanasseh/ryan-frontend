import type {AnthropicResponse} from "../types.ts";

interface ClaudeRequest {
    messages: { role: 'user' | 'assistant'; content: string }[];
    systemPrompt?: string;
}

export class ClaudeService {
    private baseUrl = 'http://localhost:3001/api/claude';

    async sendMessage(messages: {
        role: 'user' | 'assistant';
        content: string
    }[], systemPrompt?: string): Promise<AnthropicResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages,
                    systemPrompt
                } as ClaudeRequest),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to get response from Claude');
            }

            return data.response;
        } catch (error) {
            console.error('Claude API error:', error);
            throw error;
        }
    }
}