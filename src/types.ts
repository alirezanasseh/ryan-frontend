export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    currentSystem: SystemType;
    messages: Record<SystemType, Message[]>;
    data: {
        analysis?: any;
        plan?: any;
        wireframes?: any;
        code?: any;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface AnthropicResponse {
    content: {
        text: string;
        type: string;
    }[];
    id: string;
    model: string;
    role: string;
    stop_reason: string | null;
    stop_sequence: string | null;
    type: string;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

export type SystemType = 'analyzer' | 'planner' | 'wireframe' | 'developer';