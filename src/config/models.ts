export interface AgentConfig {
  id: string;
  agentNumber: string;
  name: string;
  modelName: string;
  provider: string;
  model: string;
  modelId: string;
  role: string;
  envKeyName: string;
}

export const ORBIT_AGENTS: AgentConfig[] = [
  {
    id: 'agent-01',
    agentNumber: '01',
    name: 'Cartographer',
    modelName: 'Gemini',
    provider: 'Google Gemini',
    model: 'Gemini 3.7 Flash',
    modelId: 'gemini-3.7-flash',
    role: 'Maps architecture and code boundaries',
    envKeyName: 'GEMINI_API_KEY',
  },
  {
    id: 'agent-02',
    agentNumber: '02',
    name: 'Contrarian',
    modelName: 'Mistral',
    provider: 'Mistral',
    model: 'Codestral-2508',
    modelId: 'codestral-2508',
    role: 'Challenges logic and refactor options',
    envKeyName: 'MISTRAL_API_KEY',
  },
  {
    id: 'agent-03',
    agentNumber: '03',
    name: 'Maker',
    modelName: 'Groq AI',
    provider: 'Groq',
    model: 'GPT-OSS 120B',
    modelId: 'openai/gpt-oss-120b',
    role: 'Generates structured implementation code',
    envKeyName: 'GROQ_API_KEY',
  },
];
