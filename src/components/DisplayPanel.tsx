import React, {useEffect, useRef} from 'react';
import type {SystemType} from '../types';
import mermaid from 'mermaid';

interface DisplayPanelProps {
    system: SystemType;
    content: any;
}

export const DisplayPanel: React.FC<DisplayPanelProps> = ({system, content}) => {
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({startOnLoad: true, theme: 'default'});
    }, []);

    useEffect(() => {
        if (content?.mermaid && mermaidRef.current) {
            mermaidRef.current.innerHTML = '';
            const element = document.createElement('div');
            element.className = 'mermaid';
            element.textContent = content.mermaid;
            mermaidRef.current.appendChild(element);

            mermaid.init(undefined, element);
        }
    }, [content]);

    const getDefaultContent = (system: SystemType) => {
        const defaults = {
            analyzer: {
                title: 'Project Analysis',
                description: 'Break down your project into manageable components',
                example: 'Start by describing your project requirements...'
            },
            planner: {
                title: 'Project Planning',
                description: 'Create implementation roadmap and user stories',
                example: 'Based on your analysis, I\'ll create a development plan...'
            },
            wireframe: {
                title: 'Wireframe Design',
                description: 'Design basic UI wireframes',
                example: 'I\'ll create simple wireframes for your interfaces...'
            },
            developer: {
                title: 'Code Generation',
                description: 'Generate code based on your requirements',
                example: 'Ready to generate code for your project...'
            }
        };
        return defaults[system];
    };

    const defaultContent = getDefaultContent(system);

    return (
        <div style={{
            height: '100%',
            padding: '1rem',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            overflow: 'auto'
        }}>
            <div style={{marginBottom: '1.5rem'}}>
                <h2 style={{margin: '0 0 0.5rem 0', color: '#333'}}>{defaultContent.title}</h2>
                <p style={{margin: 0, color: '#666'}}>{defaultContent.description}</p>
            </div>

            {content?.mermaid ? (
                <div ref={mermaidRef} style={{marginBottom: '1rem'}}/>
            ) : (
                <div style={{
                    color: '#999',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    marginTop: '3rem'
                }}>
                    {defaultContent.example}
                </div>
            )}

            {content?.text && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.9rem'
                }}>
                    {content.text}
                </div>
            )}

            {content?.code && (
                <div style={{marginTop: '1rem'}}>
                    <h4 style={{margin: '0 0 0.5rem 0'}}>Generated Code:</h4>
                    <pre style={{
                        backgroundColor: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '0.8rem'
                    }}>
            <code>{content.code}</code>
          </pre>
                </div>
            )}
        </div>
    );
};