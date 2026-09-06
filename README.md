# ORBIT

> **Divide the work. Accelerate the build.**

ORBIT is a BYOK-enabled, multi-agent development workspace that coordinates multiple AI coding agents around a single software project.

Instead of asking several agents to independently solve the same problem, ORBIT decomposes a development task into focused responsibilities and allows agents to work on different parts of the project in parallel.

**One command. Multiple agents. One project.**

---

## Overview

Modern AI coding workflows are often centered around a single agent working through a task sequentially. ORBIT explores a different approach: treating AI agents as specialized contributors within a shared development workflow.

A typical ORBIT build looks like:

```text
                        DEVELOPMENT COMMAND
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
                 AGENT 01    AGENT 02    AGENT 03
                 Architecture  Features   Integration
                    │           │           │
                    └───────────┼───────────┘
                                ▼
                           ONE PROJECT
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
                 PLAYGROUND   CLONE       REVIEW
```

The agents do not independently generate the same application. Each agent is assigned a different area of responsibility, contributing to the same overall build.

---

## Why ORBIT?

AI-assisted development has made generating code significantly easier, but the workflow around multiple AI systems remains fragmented.

Developers often have to:

- Switch between different AI tools and providers.
- Repeat context across different agents.
- Work through complex tasks sequentially.
- Manage separate development conversations.
- Depend on platform-managed AI usage.

ORBIT was built to explore a more coordinated workflow.

The core idea is simple:

> **Break a development problem into smaller responsibilities and let multiple agents work on those responsibilities concurrently.**

---

## Core Features

### Multi-Agent Development

ORBIT coordinates three specialized development agents:

| Agent | Provider | Model | Responsibility |
|---|---|---|---|
| Agent 01 | Google Gemini | Gemini 3.7 Flash | Architecture & application structure |
| Agent 02 | Mistral | Mistral Small | Core functionality & feature implementation |
| Agent 03 | Cerebras | Qwen3 235B Instruct | Integration, UI & refinement |

The exact model configuration is maintained centrally through the ORBIT agent configuration.

### Parallel Work Decomposition

ORBIT is designed around **division of work**, not duplicated generation.

For example, a project-management application may be divided into:

```text
Agent 01
Application Architecture
        │
        ├── Project structure
        ├── Application shell
        └── Navigation

Agent 02
Core Functionality
        │
        ├── Task management
        ├── Filtering
        └── Dashboard functionality

Agent 03
Integration & Refinement
        │
        ├── Responsive behavior
        ├── Component integration
        └── UI refinement
```

The output is brought together as a single project.

---

## BYOK

ORBIT supports **Bring Your Own Key** for supported AI providers.

Instead of requiring developers to rely on an ORBIT-managed AI credit system, users can provide their own provider credentials.

Current providers include:

- Google Gemini
- Mistral
- Cerebras

BYOK is designed around developer ownership of model access.

```text
Developer
    │
    │ API credentials
    ▼
Provider
    │
    │ Model execution
    ▼
ORBIT
    │
    │ Agent orchestration
    ▼
Project
```

API credentials are treated as sensitive data and should never be committed to source control or exposed through application logs.

---

## ORBIT Workflow

ORBIT follows a five-stage development workflow.

### 01. Session

Create a focused development surface.

ORBIT currently provides two real session slots:

```text
Session 01
Session 02
```

Each slot represents an independent development surface.

### 02. Command + BYOK

Provide a natural-language development command and optionally configure provider credentials.

Example:

```text
Build a modern project management workspace with a dashboard,
task management, filtering, responsive navigation,
and a clean modular architecture.
```

### 03. Playground

The Playground provides visibility into the multi-agent build.

Agents move through the development lifecycle:

```text
QUEUED
   ↓
PLANNING
   ↓
EXECUTING
   ↓
WRITING FILES
   ↓
COMPLETED
```

The objective is to make agent activity visible rather than treating AI execution as a black box.

### 04. Clone

Once the build is complete, the generated project can be accessed through the ORBIT clone workflow.

Example:

```bash
orbit clone north-star
```

The project structure and generated files are made available for continued development.

### 05. Review

The final stage provides a place to inspect the generated result before continuing development.

This closes the workflow:

```text
Command
   ↓
Decompose
   ↓
Execute
   ↓
Assemble
   ↓
Review
   ↓
Continue Building
```

---

## Product Demo

ORBIT includes a deterministic Product Demo for exploring the complete workflow without requiring API credentials.

The demonstration uses a dedicated mock session:

```text
north-star
```

The demo does **not** consume either real session slot.

The Product Demo:

- Does not call Gemini.
- Does not call Mistral.
- Does not call Cerebras.
- Does not use user BYOK credentials.
- Does not use ORBIT default API credentials.
- Does not execute real AI agents.
- Does not generate a real project through an LLM.
- Uses deterministic mock agents and project files.

The three mock agents reproduce the same lifecycle as a real ORBIT build:

```text
QUEUED
→ PLANNING
→ EXECUTING
→ WRITING FILES
→ COMPLETED
```

Every mock-generated file contains:

```text
/* MOCK FILE */
```

This keeps the demonstration clearly separated from real execution.

---

## Default Agent Service

The Default Agent Service is planned as a future ORBIT-managed execution option.

It is currently unavailable during development.

```text
DEFAULT AGENT SERVICE

ON DEVELOPMENT
Launching soon
```

The current implementation focuses on the BYOK workflow and multi-agent orchestration.

---

## Architecture

ORBIT separates the application interface, orchestration layer, provider integrations, and demonstration environment.

```text
┌─────────────────────────────────────────────┐
│                 ORBIT UI                    │
│                                             │
│ Session → Command → Playground → Clone → Review
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             ORCHESTRATION LAYER             │
│                                             │
│ Session Management                           │
│ Agent Assignment                             │
│ Execution Coordination                       │
│ Project Assembly                             │
└───────────────┬──────────────┬──────────────┘
                │              │
                ▼              ▼
       ┌────────────────┐   ┌────────────────┐
       │ Real Providers │   │  Demo Service  │
       │                │   │                │
       │ Gemini         │   │ Deterministic  │
       │ Mistral        │   │ Mock Agents    │
       │ Cerebras       │   │ Mock Files     │
       └────────────────┘   └────────────────┘
```

The Product Demo remains isolated from real provider execution.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons

### Backend

- Node.js
- Express
- TypeScript

### AI Providers

- Google Gemini
- Mistral
- Cerebras

### Development

- Git
- REST APIs
- Environment-based configuration
- Modular service architecture

---

## Project Structure

A simplified structure:

```text
orbit/
├── src/
│   ├── components/
│   ├── config/
│   │   └── models.ts
│   ├── lib/
│   │   └── byok.ts
│   └── pages/
│       └── OrbitAgentPage.tsx
│
├── server/
│   ├── services/
│   │   ├── demoService.ts
│   │   ├── modelProvider.ts
│   │   └── storage.ts
│   └── index.ts
│
├── public/
├── package.json
└── README.md
```

---

## Security Considerations

ORBIT treats provider credentials as sensitive information.

The application is designed around the following principles:

- Never commit API keys to source control.
- Never log API keys.
- Never expose provider credentials in UI output.
- Keep BYOK state ephemeral.
- Keep Product Demo completely credential-free.
- Separate real execution from deterministic demonstration data.

For local development, provider credentials should be supplied through the appropriate secure development configuration rather than hardcoded into source files.

---

## Development

### Prerequisites

- Node.js
- npm
- Provider API credentials for real model execution

### Install

```bash
npm install
```

### Run the development environment

```bash
npm run dev
```

The exact development scripts may vary depending on the current project configuration.

---

## Development Philosophy

ORBIT is built around three principles:

### 1. Divide the Work

A complex software task can be decomposed into focused responsibilities.

### 2. Keep Agents Visible

Developers should be able to see what their agents are doing rather than receiving only a final response.

### 3. Keep Developers in Control

BYOK gives developers ownership over their provider access while keeping ORBIT focused on orchestration and workflow.

---

## Development with AI Agents

ORBIT was itself developed using AI-assisted development workflows.

During development, different AI sessions were used to work through focused engineering tasks including architecture, implementation, debugging, refinement, and integration.

This makes the project an experiment in both:

> **building a multi-agent development environment**

and

> **using agentic development practices to build that environment.**

---

## Roadmap

### Current

- [x] Multi-agent development workflow
- [x] Two real development sessions
- [x] BYOK workflow
- [x] Gemini integration
- [x] Mistral integration
- [x] Cerebras integration
- [x] Agent work decomposition
- [x] Playground
- [x] Clone workflow
- [x] Review workflow
- [x] Deterministic Product Demo

### Planned

- [ ] Default Agent Service
- [ ] More granular task decomposition
- [ ] Stronger inter-agent coordination
- [ ] Persistent project context
- [ ] Improved conflict resolution
- [ ] Expanded provider support
- [ ] Deeper code review and validation

---

## Design Principle

ORBIT is not trying to make three agents answer the same question.

It is exploring a different model of AI-assisted software development:

```text
             ONE DEVELOPMENT PROBLEM
                       │
                       ▼
                WORK DECOMPOSITION
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       AGENT 01     AGENT 02     AGENT 03
       Architecture  Features    Integration
          │            │            │
          └────────────┼────────────┘
                       ▼
                  ONE PROJECT
```

**Divide the work. Accelerate the build.**

---

## Status

ORBIT is currently an experimental development workspace focused on demonstrating the feasibility of parallel, multi-agent software development with developer-controlled model access.

The current release prioritizes the core orchestration experience and a reliable demonstration workflow, with additional agent coordination and managed execution planned for future iterations.

---

## License

Add the project's applicable license here.

---

## Acknowledgements

ORBIT uses and integrates technologies from multiple AI providers as part of its multi-agent development workflow.

The project would not be possible without the growing ecosystem of accessible model APIs and developer tooling that makes experimentation with agentic software development possible.
