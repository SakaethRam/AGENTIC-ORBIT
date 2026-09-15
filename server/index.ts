import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { storageService } from './services/storage.js';
import { modelProviderService } from './services/modelProvider.js';
import { demoService } from './services/demoService.js';
import { verifyByokApiKey } from './services/byokVerifier.js';
import { hasDefaultConfigs } from './services/supabase.js';
import { ORBIT_AGENTS } from '../src/config/models.js';
import orbitProjectsRouter from "./routes/orbitProjects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes

// Orbit Clone Route
app.use("/api/orbit", orbitProjectsRouter);

// 1. Sessions API (Exactly two persistent sessions)
app.get('/api/sessions', (_req: Request, res: Response) => {
  const sessions = storageService.getSessions();
  res.json({ success: true, sessions });
});

app.post('/api/sessions/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { name, description } = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ success: false, error: 'Session name is required' });
    return;
  }

  // Check if session creation exceeds 2-slot limit
  const currentSessions = storageService.getSessions();
  const targetSession = storageService.getSession(id);
  const occupiedCount = currentSessions.filter((s) => s.occupied).length;

  if (!targetSession) {
    res.status(404).json({ success: false, error: 'Session slot not found' });
    return;
  }

  if (!targetSession.occupied && occupiedCount >= 2) {
    res.status(400).json({ success: false, error: 'Maximum limit of 2 active sessions reached. Clear an existing session slot before creating a new session.' });
    return;
  }

  const updated = storageService.updateSession(id, name, description || 'A new surface for a focused build');
  res.json({ success: true, session: updated });
});

// 2. BYOK Verification Endpoint
app.post('/api/byok/verify', async (req: Request, res: Response) => {
  const { modelId, apiKey } = req.body;
  if (!modelId || !apiKey) {
    res.status(400).json({ success: false, error: 'modelId and apiKey are required' });
    return;
  }

  const result = await verifyByokApiKey(modelId, apiKey);
  res.json({ success: true, result });
});

// 3. Model Configuration API
app.get('/api/models/config', async (_req: Request, res: Response) => {
  const isDefaultConfigured = await hasDefaultConfigs();
  res.json({
    success: true,
    isDefaultConfigured,
    agents: ORBIT_AGENTS,
    byokSupported: true,
  });
});

// 4. Model Execution API (Handles real execution vs 100% mocked demoMode execution)
app.post('/api/models/execute', async (req: Request, res: Response) => {
  const { sessionId, command, projectName: reqProjectName, userApiKeys, demoMode } = req.body;

  // PRODUCT DEMO EXECUTION (100% Mocked, does NOT consume real session slots or call LLM APIs)
  if (demoMode) {
    const demoProjectName = demoService.getDemoProjectName();
    const demoFiles = demoService.getDemoFiles();
    const demoAgentResults = demoService.getDemoAgentResults();

    res.json({
      success: true,
      demoMode: true,
      projectId: 'proj-demo-north-star',
      projectName: demoProjectName,
      agentResults: demoAgentResults,
      files: demoFiles,
    });
    return;
  }

  // REAL SESSION EXECUTION
  if (!command) {
    res.status(400).json({ success: false, error: 'Command prompt is required' });
    return;
  }

  const session = storageService.getSession(sessionId) || storageService.getSessions()[0];
  const projectName = reqProjectName || session.name || 'TaskFlow';

  // Execute all three configured ORBIT agents in parallel
  const agentResults = await Promise.all(
    ORBIT_AGENTS.map((agent) =>
      modelProviderService.executeAgent({
        agent,
        command,
        projectName,
        userByokKeys: userApiKeys,
      })
    )
  );

  const allFilesChanged: { path: string; content: string }[] = [];
  agentResults.forEach((res) => {
    if (res.status === 'completed' && res.filesChanged) {
      allFilesChanged.push(...res.filesChanged);
    }
  });

  const project = storageService.saveProjectFiles(projectName, allFilesChanged);

  res.json({
    success: true,
    demoMode: false,
    projectId: project.id,
    projectName: project.name,
    agentResults,
    files: project.files,
  });
});

// 5. Project API
app.get('/api/projects/:name', (req: Request, res: Response) => {
  const name = String(req.params.name);

  if (name === 'north-star') {
    res.json({
      success: true,
      project: {
        id: 'proj-demo-north-star',
        sessionId: 'demo-session',
        name: 'north-star',
        branch: 'main',
        status: 'completed',
        files: demoService.getDemoFiles(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return;
  }

  const project = storageService.getProject(name);
  if (!project) {
    res.status(404).json({ success: false, error: 'Project not found' });
    return;
  }

  res.json({ success: true, project });
});

// 6. Orbit Clone Endpoint
app.get('/api/clone/:projectName', (req: Request, res: Response) => {
  const projectName = String(req.params.projectName);

  // PRODUCT DEMO CLONE (100% Mocked)
  if (projectName === 'north-star') {
    const demoFiles = demoService.getDemoFiles();
    res.json({
      success: true,
      demoMode: true,
      projectName: 'north-star',
      branch: 'main',
      fileCount: demoFiles.length,
      files: demoFiles,
      command: `orbit clone north-star`,
      cloneInstructions: `Product Demo Project 'north-star'.\nContains '/* MOCK FILE */' in all files.`,
    });
    return;
  }

  // REAL PROJECT CLONE
  const project = storageService.getProject(projectName);
  if (!project) {
    res.status(404).json({
      success: false,
      error: `Project '${projectName}' not found`,
    });
    return;
  }

  res.json({
    success: true,
    demoMode: false,
    projectName: project.name,
    branch: project.branch,
    fileCount: project.files.length,
    files: project.files,
    command: `orbit clone ${project.name}`,
    cloneInstructions: `To clone into your local environment:\n  1. Run: orbit clone ${project.name}\n  2. Or fetch via GET /api/clone/${project.name}`,
  });
});

// Serve frontend static build in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ORBIT Backend Server running on port ${PORT}`);
});
