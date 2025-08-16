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

export type SystemType = 'analyzer' | 'planner' | 'wireframe' | 'developer';