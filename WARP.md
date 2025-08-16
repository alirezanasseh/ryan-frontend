# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Table of Contents
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Component Structure](#component-structure)
- [Services & API Integration](#services--api-integration)
- [State Management](#state-management)
- [Type Definitions](#type-definitions)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Common Commands
```bash
# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Dependencies
- **React 19** - Latest React with new features
- **TypeScript** - Type safety and enhanced development
- **Vite** - Fast development server and build tool
- **Mermaid** - Diagram and visualization rendering
- **ESLint** - Code linting with React hooks and TypeScript rules

## Architecture Overview

**Ryan** is an AI-powered software development agent with a React frontend that communicates with a Claude API backend. The application uses a multi-system approach where different AI "systems" handle specific development tasks.

### Core Systems
1. **Analyzer (PAS)** - Project analysis and requirement breakdown
2. **Planner (PPS)** - Implementation planning and task creation
3. **Wireframe Designer (WDS)** - UI wireframe generation
4. **Developer (DVS)** - Code implementation

### Frontend Stack
- **UI Framework**: React 19 with TypeScript
- **Build Tool**: Vite with fast HMR
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Storage**: localStorage via StorageService
- **Visualization**: Mermaid.js for diagrams
- **Styling**: Inline styles (minimal CSS framework)

### Application Structure
```
src/
├── components/          # React components
│   ├── ChatPanel.tsx   # Chat interface for each system
│   ├── DisplayPanel.tsx # Visualization area
│   ├── ProjectSelector.tsx # Project management UI
│   └── SystemSelector.tsx  # System switcher
├── hooks/
│   └── useProject.ts   # Custom hook for project state
├── services/
│   ├── claude.ts       # Claude API communication
│   └── storage.ts      # localStorage abstraction
├── types.ts            # TypeScript definitions
└── App.tsx             # Main application container
```

## Component Structure

### App.tsx
Main application container that orchestrates:
- Project creation and selection
- System switching
- Message handling with Claude API
- State management coordination
- Layout and routing logic

### ChatPanel.tsx
Chat interface for interacting with AI systems:
- Displays message history per system
- Handles user input and message submission
- Shows loading states during API calls
- Auto-scrolls to latest messages

### DisplayPanel.tsx
Visualization area that renders:
- Mermaid diagrams (mind maps, Gantt charts, flowcharts)
- Generated code with syntax highlighting
- System-specific content and instructions
- Default states when no content is available

### ProjectSelector.tsx
Project management interface:
- Lists existing projects from localStorage
- Create new project form with name and description
- Project selection dropdown
- Real-time project list updates

### SystemSelector.tsx
System navigation tabs:
- Switch between analyzer, planner, wireframe, and developer systems
- Visual indication of active system
- System descriptions on hover

## Services & API Integration

### ClaudeService (`src/services/claude.ts`)
Handles communication with the backend Claude API:

```typescript
// Endpoint: http://localhost:3001/api/claude/chat
await claudeService.sendMessage(messages, systemPrompt)
```

**Request Format:**
```typescript
{
  messages: Array<{ role: 'user' | 'assistant', content: string }>,
  systemPrompt?: string
}
```

**Response Format:**
```typescript
{
  success: boolean,
  response?: string,
  error?: string
}
```

### StorageService (`src/services/storage.ts`)
localStorage abstraction for project persistence:
- `saveProject(project)` - Save/update project
- `getProjects()` - Retrieve all projects
- `getProject(id)` - Get specific project
- `deleteProject(id)` - Remove project

**Storage Key:** `ryan_projects`

## State Management

### useProject Hook (`src/hooks/useProject.ts`)
Custom hook managing project-level state:

```typescript
const { project, updateProject, addMessage, switchSystem } = useProject(projectId);
```

**Key Functions:**
- `updateProject(updates)` - Partial updates with timestamp
- `addMessage(system, message)` - Add message to specific system
- `switchSystem(system)` - Change active system type

### State Flow
1. Project selection triggers `useProject` hook
2. Hook loads project from localStorage via `StorageService`
3. Message sending triggers API call to `ClaudeService`
4. Response is processed and stored in project state
5. Mermaid diagrams and code are extracted and stored separately
6. UI updates automatically through React state changes

## Type Definitions

### Core Types (`src/types.ts`)

```typescript
type SystemType = 'analyzer' | 'planner' | 'wireframe' | 'developer'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Project {
  id: string
  name: string
  description: string
  currentSystem: SystemType
  messages: Record<SystemType, Message[]>
  data: {
    analysis?: any
    plan?: any
    wireframes?: any
    code?: any
  }
  createdAt: Date
  updatedAt: Date
}
```

## Development Workflow

### Adding New System Types
1. Update `SystemType` union in `src/types.ts`
2. Add system definition to `systems` array in `SystemSelector.tsx`
3. Create system prompt in `getSystemPrompt()` in `App.tsx`
4. Add system title mapping in `ChatPanel.tsx`
5. Add default content in `DisplayPanel.tsx`

### Working with Mermaid Diagrams
- Diagrams are extracted from Claude responses using regex: `/```mermaid\n([\s\S]*?)\n```/`
- Supported diagram types: mindmap, gantt, flowchart
- Mermaid is initialized with `theme: 'default'` on component mount
- Diagrams are re-rendered on content changes

### Message Flow Pattern
1. User submits message in `ChatPanel`
2. `handleSendMessage` in `App.tsx` processes:
   - Adds user message to state
   - Prepares Claude API request
   - Sends request with system prompt
   - Processes response for diagrams/code
   - Updates project data
   - Saves to localStorage

### Extending Visualization Types
- Add regex patterns in `App.tsx` `handleSendMessage`
- Update `DisplayPanel.tsx` to render new content types
- Consider adding to project `data` structure in types

## Troubleshooting

### Common Issues

**Backend API Connection**
- Ensure backend server is running on `http://localhost:3001`
- Check for CORS configuration if requests fail
- Verify `/api/claude/chat` endpoint is available

**Mermaid Rendering Problems**
- Check browser console for Mermaid syntax errors
- Ensure diagram syntax matches Mermaid specification
- Clear browser cache if diagrams don't update

**React 19 Considerations**
- StrictMode is enabled - effects may run twice in development
- New React features may require updated patterns
- Check React DevTools for component behavior

**LocalStorage Limitations**
- Storage quota: ~5-10MB depending on browser
- Data persists until manually cleared
- Consider adding data export/import functionality for large projects

**Development Server Issues**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Force port if 3000 is occupied
npm run dev -- --port 3001
```

### ESLint Configuration
The project uses modern ESLint config with:
- TypeScript rules via `typescript-eslint`
- React Hooks rules for proper hook usage
- React Refresh rules for HMR compatibility
- Browser globals for DOM APIs

**Ignored Patterns:** `dist/` folder is excluded from linting
