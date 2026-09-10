# ORBIT: OPEN-SOURCE ● MULTI-AGENT DEVELOPMENT

ORBIT is a BYOK-enabled, multi-agent development workspace that coordinates
multiple AI coding agents around a single software project. Instead of
asking several agents to independently solve the same problem, ORBIT
decomposes a development task into focused responsibilities and lets agents
work on different parts of a project in parallel.

>VISIT ORBIT AGENT: [@Orbit](https://agentic-orbit.netlify.app/)

## Overview

Most AI-assisted development workflows center on a single agent working
through a task sequentially. ORBIT takes a different approach: it treats AI
agents as specialized contributors within a shared development workflow,
each responsible for a distinct part of the build rather than a duplicate
attempt at the whole thing.

A typical ORBIT build assigns one agent to architecture, one to core
functionality, and one to integration and refinement. The three
contributions are assembled into a single project. The full breakdown of
responsibilities, the model each agent runs on, and the lifecycle every
agent follows is documented in [ORBIT-AGENT.md](./ORBIT-AGENT.md).

## Why ORBIT

AI-assisted development has made generating code significantly easier, but
the workflow around using multiple AI systems together remains fragmented.
Developers commonly have to switch between tools and providers, rebuild
context for each new session, work through complex tasks sequentially, and
depend on a single platform's managed usage. ORBIT explores a more
coordinated alternative: break a development problem into smaller
responsibilities, and let multiple agents work on those responsibilities
concurrently.

## Core Concepts

- **Multi-agent development.** Three specialized agents, each with a fixed
  area of responsibility, contribute to one build.
- **Bring Your Own Key (BYOK).** Developers supply their own provider
  credentials rather than relying on an ORBIT-managed credit system, keeping
  model access under their direct control.
- **Visible execution.** Every agent moves through the same defined
  lifecycle, so a build's progress is observable rather than a black box.
- **A deterministic Product Demo.** The full workflow can be explored
  without provisioning any API credentials, using a dedicated mock session
  that never touches a real provider.

These concepts, along with the full workflow from command to reviewable
project, are covered in [ORBIT-AGENT.md](./ORBIT-AGENT.md).

## Architecture

ORBIT separates the application interface, the orchestration layer, the
provider integrations, and the demonstration environment, so that each can
change independently. The layered design, the request flow from command to
assembled project, and the BYOK credential flow are documented with diagrams
in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Security

Provider credentials are treated as sensitive at every layer: never
committed to source control, never written to logs, never exposed in UI
output, and kept ephemeral rather than persisted beyond a session. The
Product Demo is fully isolated from real provider execution, by design. See
[ARCHITECTURE.md § Isolation Boundary](./ARCHITECTURE.md#isolation-boundary)
for the specifics.

## Status

ORBIT is an experimental development workspace focused on demonstrating the
feasibility of parallel, multi-agent software development with
developer-controlled model access. The current release prioritizes the core
orchestration experience and a reliable demonstration workflow; additional
agent coordination and a managed execution option are planned for future
iterations.

## Development Philosophy

ORBIT is built around three principles: a complex software task can be
decomposed into focused responsibilities; developers should see what their
agents are doing rather than receive only a final response; and BYOK gives
developers ownership of provider access while ORBIT focuses on
orchestration. ORBIT was itself built using AI-assisted development
workflows, which makes it as much an experiment in agentic development
practice as it is a tool for it.

## License

ORBIT is released under the MIT License. See [LICENSE](./LICENSE) for the
full text.
