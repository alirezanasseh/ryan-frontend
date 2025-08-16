import {useState, useEffect} from 'react';
import type {Project, SystemType, Message} from '../types';
import {StorageService} from '../services/storage';

export const useProject = (projectId: string | null) => {
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (projectId) {
            const stored = StorageService.getProject(projectId);
            setProject(stored);
        }
    }, [projectId]);

    const updateProject = (updates: Partial<Project>) => {
        if (!project) return;

        const updated = {...project, ...updates, updatedAt: new Date()};
        setProject(updated);
        StorageService.saveProject(updated);
    };

    const addMessage = (system: SystemType, message: Omit<Message, 'id'>) => {
        if (!project) return;

        const newMessage: Message = {
            ...message,
            id: Date.now().toString(),
        };

        const updatedMessages = {
            ...project.messages,
            [system]: [...(project.messages[system] || []), newMessage],
        };

        updateProject({messages: updatedMessages});
    };

    const switchSystem = (system: SystemType) => {
        updateProject({currentSystem: system});
    };

    return {
        project,
        updateProject,
        addMessage,
        switchSystem,
    };
};