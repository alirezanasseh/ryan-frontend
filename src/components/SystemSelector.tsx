import React from 'react';
import type {SystemType} from '../types';

interface SystemSelectorProps {
    currentSystem: SystemType;
    onSystemChange: (system: SystemType) => void;
}

const systems = [
    {id: 'analyzer' as SystemType, name: 'Project Analyzer', description: 'Break down requirements'},
    {id: 'planner' as SystemType, name: 'Project Planner', description: 'Create implementation plan'},
    {id: 'wireframe' as SystemType, name: 'Wireframe Designer', description: 'Design UI wireframes'},
    {id: 'developer' as SystemType, name: 'Developer', description: 'Generate code'},
];

export const SystemSelector: React.FC<SystemSelectorProps> = ({currentSystem, onSystemChange}) => {
    return (
        <div style={{
            padding: '1rem',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                {systems.map(system => (
                    <button
                        key={system.id}
                        onClick={() => onSystemChange(system.id)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: currentSystem === system.id ? '#007bff' : 'white',
                            color: currentSystem === system.id ? 'white' : 'black',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                        title={system.description}
                    >
                        {system.name}
                    </button>
                ))}
            </div>
        </div>
    );
};