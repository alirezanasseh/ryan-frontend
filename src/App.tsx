import {useState} from 'react';
import type {Project, SystemType} from './types';
import {StorageService} from './services/storage';
import {ClaudeService} from './services/claude';
import {useProject} from './hooks/useProject';
import {ProjectSelector} from './components/ProjectSelector';
import {SystemSelector} from './components/SystemSelector';
import {ChatPanel} from './components/ChatPanel';
import {DisplayPanel} from './components/DisplayPanel';

const claudeService = new ClaudeService();

function App() {
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {project, updateProject, addMessage, switchSystem} = useProject(currentProjectId);

    const createProject = (name: string, description: string) => {
        const newProject: Project = {
            id: Date.now().toString(),
            name,
            description,
            currentSystem: 'analyzer',
            messages: {
                analyzer: [],
                planner: [],
                wireframe: [],
                developer: []
            },
            data: {},
            createdAt: new Date(),
            updatedAt: new Date()
        };

        StorageService.saveProject(newProject);
        setCurrentProjectId(newProject.id);
    };

    const getSystemPrompt = (system: SystemType): string => {
        const prompts = {
            analyzer: `You are the Project Analyzer (PAS) component of Ryan, an AI software development agent. Your role is to break down software projects into manageable sub-systems and components through iterative analysis.

Key responsibilities:
- Break down projects from whole to parts recursively
- Create mind map visualizations using Mermaid.js syntax
- Ask clarifying questions to ensure proper understanding
- Analyze user feedback to determine if requirements belong in current or future levels

When responding, if you create a mind map, format it as:
\`\`\`mermaid
mindmap
  root)Project Name(
    Component 1
      Sub-component 1.1
      Sub-component 1.2
    Component 2
      Sub-component 2.1
\`\`\`

Always ask follow-up questions to better understand requirements and validate your analysis.`,

            planner: `You are the Project Planner (PPS) component of Ryan. Your role is to create implementation plans based on the project analysis.

Key responsibilities:
- Plan project implementation phases
- Create MVPs for complex projects
- Generate user stories and detailed tasks
- Create planning charts using Mermaid.js

For planning charts, use Gantt charts or flowcharts:
\`\`\`mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    User Stories    :2024-01-01, 7d
    Development     :7d
    Testing         :3d
\`\`\`

Focus on breaking complex projects into manageable phases with clear deliverables.`,

            wireframe: `You are the Wireframe Designer (WDS) component of Ryan. Your role is to create simple HTML wireframes to visualize the user interface.

Key responsibilities:
- Create basic HTML wireframes with minimal CSS
- Focus on layout and functionality, not styling
- Ask for user feedback and iterate
- Help clarify UI requirements

When creating wireframes, provide clean HTML with basic styling for layout purposes. Focus on structure and user flow rather than visual design.`,

            developer: `You are the Developer (DVS) component of Ryan. Your role is to implement features based on project requirements, wireframes, and plans.

Key responsibilities:
- Write clean, well-documented code
- Follow best practices for the target technology stack
- Create both implementation code and tests
- Support multiple development types (frontend, backend, API, etc.)

Always provide complete, functional code examples and explain your implementation decisions.`
        };

        return prompts[system];
    };

    const handleSendMessage = async (content: string) => {
        if (!project) return;

        const currentSystem = project.currentSystem;
        const currentMessages = project.messages[currentSystem] || [];

        // Add user message
        addMessage(currentSystem, {
            role: 'user',
            content,
            timestamp: new Date()
        });

        setIsLoading(true);

        try {
            // Prepare messages for Claude
            const claudeMessages = currentMessages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            claudeMessages.push({role: 'user', content});

            const response = await claudeService.sendMessage(
                claudeMessages,
                getSystemPrompt(currentSystem)
            );

            // Add assistant response
            addMessage(currentSystem, {
                role: 'assistant',
                content: response,
                timestamp: new Date()
            });

            // Extract mermaid charts and other data from response
            const mermaidMatch = response.match(/```mermaid\n([\s\S]*?)\n```/);
            const codeMatch = response.match(/```(?:typescript|javascript|html|css)\n([\s\S]*?)\n```/);

            if (mermaidMatch || codeMatch) {
                const data = {...project.data};
                if (mermaidMatch) {
                    data[currentSystem] = {
                        ...data[currentSystem],
                        mermaid: mermaidMatch[1],
                        text: response.replace(/```mermaid\n[\s\S]*?\n```/, '').trim()
                    };
                }
                if (codeMatch) {
                    data[currentSystem] = {
                        ...data[currentSystem],
                        code: codeMatch[1],
                        text: response.replace(/```(?:typescript|javascript|html|css)\n[\s\S]*?\n```/, '').trim()
                    };
                }

                updateProject({data});
            }

        } catch (error) {
            console.error('Error sending message:', error);
            addMessage(currentSystem, {
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request. Please try again.',
                timestamp: new Date()
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
            {/* Header */}
            <header style={{
                padding: '1rem 2rem',
                backgroundColor: '#343a40',
                color: 'white',
                borderBottom: '1px solid #dee2e6'
            }}>
                <h1 style={{margin: 0, fontSize: '1.5rem'}}>Ryan - AI Development Agent</h1>
            </header>

            {/* Project Selector */}
            <ProjectSelector
                currentProject={currentProjectId}
                onProjectSelect={setCurrentProjectId}
                onProjectCreate={createProject}
            />

            {project && (
                <>
                    {/* System Selector */}
                    <SystemSelector
                        currentSystem={project.currentSystem}
                        onSystemChange={switchSystem}
                    />

                    {/* Main Content */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        minHeight: 0
                    }}>
                        {/* Chat Panel - Left (30%) */}
                        <div style={{width: '30%', minWidth: '300px'}}>
                            <ChatPanel
                                messages={project.messages[project.currentSystem] || []}
                                onSendMessage={handleSendMessage}
                                isLoading={isLoading}
                                system={project.currentSystem}
                            />
                        </div>

                        {/* Display Panel - Right (70%) */}
                        <div style={{flex: 1, minWidth: 0}}>
                            <DisplayPanel
                                system={project.currentSystem}
                                content={project.data[project.currentSystem]}
                            />
                        </div>
                    </div>
                </>
            )}

            {!project && (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontSize: '1.2rem'
                }}>
                    Select or create a project to get started
                </div>
            )}
        </div>
    );
}

export default App;
