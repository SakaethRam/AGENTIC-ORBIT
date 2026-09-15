import { ORBIT_AGENTS } from '../../src/config/models.js';

export interface DemoFile {
  path: string;
  content: string;
}

export interface DemoAgentResult {
  agentId: string;
  agentNumber: string;
  name: string;
  provider: string;
  model: string;
  modelId: string;
  status: 'completed';
  task: string;
  filesChanged: DemoFile[];
  outputTokens: number;
  activityLog: string[];
  credentialSource: 'ORBIT Key';
}

export class DemoService {
  private readonly projectName = 'north-star';
  private readonly command =
    'Build a modern project management workspace with a dashboard, task management, filtering, responsive navigation, and a clean modular architecture.';

  getDemoProjectName(): string {
    return this.projectName;
  }

  getDemoCommand(): string {
    return this.command;
  }

  getDemoFiles(): DemoFile[] {
    return [
      {
        path: 'src/components/Navbar.tsx',
        content: `/* MOCK FILE */
import React from 'react';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <span className="font-mono font-bold tracking-widest">NORTH STAR</span>
      <div className="flex gap-4 text-sm text-gray-500">
        <a href="#dashboard" className="hover:text-black">Dashboard</a>
        <a href="#tasks" className="hover:text-black">Tasks</a>
      </div>
    </nav>
  );
}`,
      },
      {
        path: 'src/components/Dashboard.tsx',
        content: `/* MOCK FILE */
import React from 'react';
import { TaskCard } from './TaskCard';
import { TaskFilter } from './TaskFilter';

export function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">North Star Workspace</h1>
      <p className="mt-2 text-gray-600">Productivity overview & active tasks.</p>
      <div className="mt-6">
        <TaskFilter />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <TaskCard title="Set up ORBIT architecture" status="COMPLETED" />
        <TaskCard title="Configure multi-agent coordination" status="IN PROGRESS" />
      </div>
    </div>
  );
}`,
      },
      {
        path: 'src/components/TaskCard.tsx',
        content: `/* MOCK FILE */
import React from 'react';

export function TaskCard({ title, status }: { title: string; status: string }) {
  return (
    <div className="rounded-lg border p-4 shadow-sm bg-white">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <span className="mt-2 inline-block text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">{status}</span>
    </div>
  );
}`,
      },
      {
        path: 'src/components/TaskFilter.tsx',
        content: `/* MOCK FILE */
import React from 'react';

export function TaskFilter() {
  return (
    <div className="flex gap-2">
      <button className="px-3 py-1.5 text-xs font-medium rounded bg-black text-white">All Tasks</button>
      <button className="px-3 py-1.5 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Active</button>
      <button className="px-3 py-1.5 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Completed</button>
    </div>
  );
}`,
      },
      {
        path: 'src/pages/Home.tsx',
        content: `/* MOCK FILE */
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Dashboard } from '../components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Dashboard />
      </main>
    </div>
  );
}`,
      },
      {
        path: 'src/pages/Tasks.tsx',
        content: `/* MOCK FILE */
import React from 'react';
import { Navbar } from '../components/Navbar';
import { TaskCard } from '../components/TaskCard';
import { TaskFilter } from '../components/TaskFilter';

export default function Tasks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Task Management</h2>
        <TaskFilter />
        <div className="grid gap-4 mt-6 sm:grid-cols-2">
          <TaskCard title="Setup workspace schema" status="COMPLETED" />
          <TaskCard title="Connect reactive stores" status="IN PROGRESS" />
        </div>
      </div>
    </div>
  );
}`,
      },
      {
        path: 'src/hooks/useTasks.ts',
        content: `/* MOCK FILE */
import { useState } from 'react';

export function useTasks() {
  const [tasks] = useState([
    { id: '1', title: 'Set up ORBIT architecture', status: 'COMPLETED' },
    { id: '2', title: 'Configure multi-agent coordination', status: 'IN PROGRESS' }
  ]);

  return { tasks };
}`,
      },
      {
        path: 'src/lib/utils.ts',
        content: `/* MOCK FILE */
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}`,
      },
      {
        path: 'src/styles/globals.css',
        content: `/* MOCK FILE */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, sans-serif;
  color: #111;
}`,
      },
      {
        path: 'src/App.tsx',
        content: `/* MOCK FILE */
import React from 'react';
import Home from './pages/Home';

export default function App() {
  return <Home />;
}`,
      },
      {
        path: 'src/main.tsx',
        content: `/* MOCK FILE */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      },
      {
        path: 'README.md',
        content: `/* MOCK FILE */
# North Star Workspace

Product Demo project generated via ORBIT Product Demo.
Command: "${this.command}"
`,
      },
    ];
  }

  getDemoAgentResults(): DemoAgentResult[] {
    const demoFiles = this.getDemoFiles();

    return ORBIT_AGENTS.map((agent) => {
      let agentFiles: DemoFile[] = [];
      let activityLog: string[] = [];
      let outputTokens = 1450;
      let roleDescription = agent.role;

      if (agent.id === 'agent-01') {
        roleDescription = 'Architecture & Application Shell';
        agentFiles = demoFiles.filter(
          (f) =>
            f.path === 'src/components/Navbar.tsx' ||
            f.path === 'src/pages/Home.tsx' ||
            f.path === 'src/pages/Tasks.tsx' ||
            f.path === 'README.md'
        );
        outputTokens = 1420;
        activityLog = [
          'QUEUED: Waiting for demonstration trigger',
          'PLANNING: Mapping application structure, navigation, and page routes',
          'EXECUTING: Assembling application shell and reusable navigation boundaries',
          'WRITING FILES: Generating Navbar.tsx, Home.tsx, Tasks.tsx, README.md',
          'COMPLETED: Architecture & Application Shell built successfully',
        ];
      } else if (agent.id === 'agent-02') {
        roleDescription = 'Task Management & Interaction';
        agentFiles = demoFiles.filter(
          (f) =>
            f.path === 'src/components/TaskCard.tsx' ||
            f.path === 'src/components/TaskFilter.tsx' ||
            f.path === 'src/hooks/useTasks.ts' ||
            f.path === 'src/lib/utils.ts'
        );
        outputTokens = 1850;
        activityLog = [
          'QUEUED: Waiting for demonstration trigger',
          'PLANNING: Designing task lists, filtering logic, and state interactions',
          'EXECUTING: Implementing interactive task components and task filter state',
          'WRITING FILES: Generating TaskCard.tsx, TaskFilter.tsx, useTasks.ts, utils.ts',
          'COMPLETED: Task Management & Interaction completed',
        ];
      } else {
        roleDescription = 'Responsive UI & Integration';
        agentFiles = demoFiles.filter(
          (f) =>
            f.path === 'src/components/Dashboard.tsx' ||
            f.path === 'src/styles/globals.css' ||
            f.path === 'src/App.tsx' ||
            f.path === 'src/main.tsx'
        );
        outputTokens = 2100;
        activityLog = [
          'QUEUED: Waiting for demonstration trigger',
          'PLANNING: Establishing responsive visual consistency and final wiring',
          'EXECUTING: Connecting task widgets, responsive layouts, and main application entry',
          'WRITING FILES: Generating Dashboard.tsx, globals.css, App.tsx, main.tsx',
          'COMPLETED: Responsive UI & Integration wired successfully',
        ];
      }

      return {
        agentId: agent.id,
        agentNumber: agent.agentNumber,
        name: agent.name,
        provider: agent.provider,
        model: agent.model,
        modelId: agent.modelId,
        status: 'completed',
        task: roleDescription,
        filesChanged: agentFiles,
        outputTokens,
        activityLog,
        credentialSource: 'ORBIT Key',
      };
    });
  }
}

export const demoService = new DemoService();
