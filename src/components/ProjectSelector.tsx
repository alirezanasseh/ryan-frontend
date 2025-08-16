import React, {useState, useEffect} from 'react';
import type {Project} from '../types';
import {StorageService} from '../services/storage';

interface ProjectSelectorProps {
    currentProject: string | null;
    onProjectSelect: (projectId: string | null) => void;
    onProjectCreate: (name: string, description: string) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
                                                                    currentProject,
                                                                    onProjectSelect,
                                                                    onProjectCreate
                                                                }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');

    useEffect(() => {
        setProjects(StorageService.getProjects());
    }, [currentProject]);

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            onProjectCreate(newProjectName.trim(), newProjectDesc.trim());
            setNewProjectName('');
            setNewProjectDesc('');
            setShowCreateForm(false);
            setProjects(StorageService.getProjects());
        }
    };

    return (
        <div style={{
            padding: '1rem',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#fff'
        }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <select
                    value={currentProject || ''}
                    onChange={(e) => onProjectSelect(e.target.value || null)}
                    style={{
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        flex: 1
                    }}
                >
                    <option value="">Select a project...</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => setShowCreateForm(true)}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    New Project
                </button>
            </div>

            {showCreateForm && (
                <form onSubmit={handleCreateProject} style={{
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                }}>
                    <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                            Project Name:
                        </label>
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}
                            placeholder="Enter project name..."
                            required
                        />
                    </div>

                    <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                            Description:
                        </label>
                        <textarea
                            value={newProjectDesc}
                            onChange={(e) => setNewProjectDesc(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                minHeight: '80px',
                                resize: 'vertical'
                            }}
                            placeholder="Describe your project..."
                        />
                    </div>

                    <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button
                            type="submit"
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCreateForm(false);
                                setNewProjectName('');
                                setNewProjectDesc('');
                            }}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};