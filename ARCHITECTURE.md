# ORBIT Architecture

## 1. Overview

ORBIT is a BYOK-enabled, multi-agent development workspace designed to coordinate multiple specialized coding agents around a single software-development objective.

The architecture separates:

1. Workflow orchestration
2. Agent definition
3. Model/provider access
4. Credential handling
5. Project generation
6. Project retrieval
7. Human review

Core principle:

> ORBIT coordinates the work. Providers supply the intelligence. The developer controls the credentials.

---

## 2. High-Level Architecture

```text
Developer
    │
    ▼
ORBIT Frontend
    │
    ├── Session Flow
    ├── Command Input
    ├── BYOK Utility
    ├── Execution View
    └── Review
    │
    ▼
ORBIT Backend
    │
    ├── Session Management
    ├── Model Execution
    ├── Project Storage
    └── Clone
    │
    ├───────────────┐
    ▼               ▼
Real Execution   Product Demo
    │               │
    ▼               ▼
Provider Service  Demo Service
    │
    ├── Gemini
    ├── Mistral
    └── Cerebras
    │
    ▼
Agent Results
    │
    ▼
Project Files
    │
    ├── Clone
    └── Review
```

---

## 3. Frontend Layer

Technology:

- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion

Responsibilities:

- session selection;
- command input;
- BYOK input and verification;
- agent presentation;
- execution state;
- generated-file presentation;
- clone;
- review.

The frontend operates against an ORBIT-level workflow contract and does not need to understand the internal reasoning process of a provider.

---

## 4. Console Workflow

ORBIT uses five stages:

```text
01 SESSION
     │
     ▼
02 COMMAND + BYOK
     │
     ▼
03 PARALLEL
     │
     ▼
04 CLONE
     │
     ▼
05 REVIEW
```

### Session

ORBIT maintains exactly two persistent real session slots:

```text
Session 01
Session 02
```

Both begin empty.

A slot becomes occupied only when a real session is created.

The Product Demo is separate and does not consume either slot.

---

## 5. Agent Configuration

Agent definitions are centralized in:

```text
src/config/models.ts
```

This configuration is the source of truth for:

- agent identity;
- provider;
- model ID;
- role;
- display metadata;
- capabilities.

Current role decomposition:

```text
Agent 01
Architecture & Application Structure

Agent 02
Core Functionality & Feature Implementation

Agent 03
Integration, UI & Refinement
```

The agents do not receive the same task.

They receive complementary responsibilities contributing to one project.

---

## 6. Parallel Execution

```text
                 User Command
                      │
                      ▼
              Work Decomposition
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     Agent 01      Agent 02      Agent 03
   Architecture  Functionality  Integration
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                Project Assembly
```

Parallelism exists at the work-stream level.

It is not three independent agents attempting to solve the same problem.

---

## 7. BYOK Layer

BYOK is implemented as a frontend utility:

```text
src/lib/byok.ts
```

Conceptually:

```text
Developer
    │
    │ Provider Credential
    ▼
Browser
    │
    ├── Gemini
    ├── Mistral
    └── Cerebras
```

The backend does not need to act as a credential-verification proxy.

API keys should never be logged, committed, unnecessarily persisted, or returned in API responses.

---

## 8. Model Provider Service

The provider abstraction lives in:

```text
server/services/modelProvider.ts
```

Conceptually:

```text
ORBIT Agent
     │
     ▼
Model Provider Service
     │
     ├── Gemini
     ├── Mistral
     └── Cerebras
```

The abstraction keeps provider-specific implementation details behind an ORBIT-level execution interface.

---

## 9. Real Execution

```text
Command
   │
   ▼
Session Context
   │
   ▼
Agent Definitions
   │
   ▼
Provider Execution
   │
   ├── Agent 01
   ├── Agent 02
   └── Agent 03
   │
   ▼
Agent Results
   │
   ▼
File Collection
   │
   ▼
Project
```

The execution branches can operate concurrently.

Their outputs are collected into the resulting project.

---

## 10. Product Demo

The Product Demo is isolated from real execution.

Demo project:

```text
north-star
```

Architecture:

```text
Product Demo
     │
     ▼
Demo Service
     │
     ├── Mock Agent 01
     ├── Mock Agent 02
     └── Mock Agent 03
     │
     ▼
Deterministic Results
     │
     ▼
Mock Project Files
```

The demo must never invoke:

- Gemini;
- Mistral;
- Cerebras;
- user BYOK keys;
- ORBIT default credentials;
- external AI services.

Every demo file contains:

```text
/* MOCK FILE */
```

The demo uses the same UI workflow as real execution while replacing the intelligence and generation layer with deterministic data.

---

## 11. Default Agent Service

The default server-side agent service is currently not part of the active production execution path.

The UI represents it as:

```text
DEFAULT AGENT SERVICE
ON DEVELOPMENT
Launching soon
```

Current architecture:

```text
BYOK
  │
  ▼
Active

Default Agent Service
  │
  ▼
Locked / Future
```

The existing service remains isolated rather than being rewritten as part of the BYOK architecture.

---

## 12. Storage Layer

Storage is abstracted through:

```text
server/services/storage.ts
```

Conceptually:

```text
Session
 ├── id
 ├── name
 ├── description
 └── occupied

Project
 ├── id
 ├── name
 ├── branch
 ├── status
 └── files[]
```

This prevents workflow components from being tightly coupled to a particular persistence implementation.

---

## 13. API Surface

### Sessions

```text
GET  /api/sessions
POST /api/sessions/:id
```

### Model configuration

```text
GET /api/models/config
```

### Model execution

```text
POST /api/models/execute
```

### Projects

```text
GET /api/projects/:name
```

### Clone

```text
GET /api/clone/:projectName
```

BYOK verification is handled directly by the client-side BYOK utility.

---

## 14. Clone

```text
Project
   │
   ▼
Clone Endpoint
   │
   ▼
Project Metadata + Files
   │
   ▼
orbit clone <project>
```

The Product Demo uses the same interface with deterministic demo data.

---

## 15. Review

```text
Generated Project
       │
       ▼
     Review
       │
       ├── Rating
       └── Feedback
```

Review provides a human evaluation boundary after autonomous execution.

Future feedback can become a signal for:

- task routing;
- agent performance;
- code quality;
- orchestration.

---

## 16. Architectural Boundaries

```text
┌──────────────────────────────────────┐
│ EXPERIENCE                           │
│ React / Console / Review             │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│ ORCHESTRATION                        │
│ Sessions / Agents / Workflow         │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│ INTELLIGENCE                         │
│ Gemini / Mistral / Cerebras          │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│ PROJECT STATE                        │
│ Files / Projects / Storage           │
└──────────────────────────────────────┘
```

Provider intelligence is replaceable while the ORBIT workflow remains stable.

---

## 17. Design Principles

### Provider independence

The workflow should not depend on one model provider.

### Developer ownership

The developer controls model credentials when using BYOK.

### Work decomposition

Agents receive complementary responsibilities.

### Shared objective

All agents contribute toward one project outcome.

### Human control

The developer initiates work, observes execution, inspects output, clones the result, and reviews it.

### Demo isolation

Mock demonstration behavior must never contaminate real execution.

### Replaceable intelligence

Models can change without requiring the entire ORBIT architecture to change.

---

## 18. Architectural Summary

ORBIT is fundamentally an orchestration layer.

```text
                ORBIT
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
   Architecture Functionality Integration
       │          │          │
     Agent 01   Agent 02   Agent 03
       │          │          │
       └──────────┼──────────┘
                  ▼
             One Project
                  │
          ┌───────┴───────┐
          ▼               ▼
        Clone           Review
```

Core proposition:

> One command does not have to mean one agent.
