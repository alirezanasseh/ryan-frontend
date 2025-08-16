import React, {useState, useRef, useEffect} from 'react';
import type {Message, SystemType} from '../types';

interface ChatPanelProps {
    messages: Message[];
    onSendMessage: (content: string) => void;
    isLoading: boolean;
    system: SystemType;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
                                                        messages,
                                                        onSendMessage,
                                                        isLoading,
                                                        system
                                                    }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const getSystemTitle = (system: SystemType) => {
        const titles = {
            analyzer: 'Project Analyzer',
            planner: 'Project Planner',
            wireframe: 'Wireframe Designer',
            developer: 'Developer'
        };
        return titles[system];
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0'
        }}>
            <div style={{
                padding: '1rem',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#f8f9fa'
            }}>
                <h3 style={{margin: 0, fontSize: '1.1rem'}}>{getSystemTitle(system)}</h3>
            </div>

            <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {messages.length === 0 && (
                    <div style={{
                        color: '#666',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        marginTop: '2rem'
                    }}>
                        Start chatting with {getSystemTitle(system)}...
                    </div>
                )}

                {messages.map(message => (
                    <div
                        key={message.id}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        <div style={{fontSize: '0.9rem'}}>{message.content}</div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: '#666',
                            marginTop: '0.25rem'
                        }}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5',
                        alignSelf: 'flex-start',
                        maxWidth: '80%'
                    }}>
                        <div style={{fontSize: '0.9rem'}}>Thinking...</div>
                    </div>
                )}

                <div ref={messagesEndRef}/>
            </div>

            <form onSubmit={handleSubmit} style={{
                padding: '1rem',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: '0.5rem'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
};