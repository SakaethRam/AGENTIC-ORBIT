import { SessionSlot, Project, ProjectFile } from '../../src/types/orbit.js';

class StorageService {
  // Start with exactly 2 AVAILABLE session slots containing NO data
  private sessions: SessionSlot[] = [
    {
      id: 'session-01',
      name: '',
      description: '',
      occupied: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'session-02',
      name: '',
      description: '',
      occupied: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private projects: Map<string, Project> = new Map();

  getSessions(): SessionSlot[] {
    return this.sessions;
  }

  getSession(id: string): SessionSlot | undefined {
    return this.sessions.find((s) => s.id === id);
  }

  updateSession(id: string, name: string, description: string): SessionSlot | null {
    const session = this.sessions.find((s) => s.id === id);
    if (!session) return null;

    session.name = name;
    session.description = description;
    session.occupied = true;
    session.updatedAt = new Date().toISOString();

    if (!this.projects.has(name)) {
      this.projects.set(name, {
        id: `proj-${Date.now()}`,
        sessionId: id,
        name,
        branch: 'main',
        status: 'active',
        files: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return session;
  }

  getProject(name: string): Project | undefined {
    return this.projects.get(name);
  }

  saveProjectFiles(projectName: string, newFiles: ProjectFile[], branch: string = 'main'): Project {
    let project = this.projects.get(projectName);
    if (!project) {
      project = {
        id: `proj-${Date.now()}`,
        sessionId: 'session-01',
        name: projectName,
        branch,
        status: 'completed',
        files: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.projects.set(projectName, project);
    }

    const existingFileMap = new Map(project.files.map((f) => [f.path, f]));
    for (const file of newFiles) {
      existingFileMap.set(file.path, {
        ...file,
        modifiedAt: new Date().toISOString(),
      });
    }

    project.files = Array.from(existingFileMap.values());
    project.branch = branch;
    project.status = 'completed';
    project.updatedAt = new Date().toISOString();

    return project;
  }
}

export const storageService = new StorageService();
