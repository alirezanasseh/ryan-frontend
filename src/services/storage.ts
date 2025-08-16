import type {Project} from '../types';

const STORAGE_KEY = 'ryan_projects';

export class StorageService {
    static saveProject(project: Project): void {
        const projects = this.getProjects();
        const existingIndex = projects.findIndex(p => p.id === project.id);

        if (existingIndex >= 0) {
            projects[existingIndex] = {...project, updatedAt: new Date()};
        } else {
            projects.push(project);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }

    static getProjects(): Project[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static getProject(id: string): Project | null {
        const projects = this.getProjects();
        return projects.find(p => p.id === id) || null;
    }

    static deleteProject(id: string): void {
        const projects = this.getProjects().filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
}