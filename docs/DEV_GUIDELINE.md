# 🧠 DEV_GUIDELINE_SHORT.md – AI Agent Cheat Sheet

This file summarizes key rules and structure for AI-assisted code generation across backend, frontend, and AI/ML agents.

## 🧩 Project Structure

### Backend (FastAPI)
- `routers/` — API endpoint definitions (e.g., resolve_role.py)
- `models/` — Pydantic request/response models
- `services/` — Business logic
- `agents/` — AI-driven modules (e.g., QueryPlannerAgent.py)
- `tools/` — Reusable tools (e.g., MongoQueryTool.py)
- `tests/` — Pytest unit and integration tests

### Frontend (React + TypeScript)
- `components/` — Feature-based component folders
- `api/` — API service layer (axios-based)
- `state/` — Global state/context (if needed)
- Component structure:
  - `ComponentName.tsx`
  - `ComponentName.types.ts`
  - `ComponentName.styles.ts`
  - `ComponentName.test.tsx`

### Prompts & Agents
- `prompts/` — Contains `.md` prompt files for agent guidance
- Use `<Agent_Name>Agent.py`, `<Tool_Name>Tool.py`
- Keep each agent/tool in its own file

---

## ✅ Backend Conventions
- Python 3.10+ with full type hints
- Follow PEP 8 + docstrings (PEP 257)
- Use FastAPI dependency injection (`Depends()`)
- Return proper status codes + JSON schema
- Add logging to every route/agent

## ✅ Frontend Conventions
- Use TypeScript strictly (no `any`)
- Use React functional components and hooks
- Use MUI for UI components + styling
- Interface-based typing for props/params
- Group components by feature not type

## 📘 Prompt Design Rules
- Store prompts as `.md` files in `/prompts`
- Use templating or clear placeholders
- Document expected input/output for every agent

## 🔒 Misc Rules
- Use `.env` files or config objects (never hardcode secrets)
- Log all external tool/DB/API calls
- Keep `README.md` updated after implementing any new agent or feature

## 🔄 Learnings from Agent Code Generation

These rules were added based on past issues observed during code generation. They should be followed strictly to avoid common pitfalls being repeated during next code generation.

- Code quality and architectural principles:
  - API routes should contain minimal code, with all business logic in the service layer
  - Always ensure there are no errors in the PROBLEMS tab after code generation
  - Fix the root cause of issues rather than just addressing compiler/linter errors
  - Validate changes using appropriate tools (linters, type checkers) before considering work complete


