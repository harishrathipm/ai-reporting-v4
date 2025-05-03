
# 🧠 Dynamic Reporting AI — Full Architecture (Original Version)

## Overview
This document outlines the **original, full-scale architecture** of the Dynamic Reporting AI system before simplifying it for a demo version. It is designed as a modular, extensible, and production-ready platform that acts as an AI-powered **Virtual Data Analyst**.

The system supports:
- Natural language query input
- Role-based access control (via Azure AD or internal DB)
- Real-time multi-DB connectivity (SQL, NoSQL, files)
- Semantic enrichment of schema via LLM + web search
- Stepwise query planning, decomposition, and execution
- Result analysis, visualization, formatting, and delivery
- Full **metadata tracking**, error handling, and orchestration via LangGraph

## 🧩 Full Functional Modules

### 🔐 Security & Context Management
- **UserRoleResolverAgent** — Resolves roles from Azure AD or internal DB
- **RoleToEntityAccessAgent** — Determines what entities/tables the user can access
- **GlobalExecutionContext** — Stores all state: user, DBs, metadata, result flow

### 🧰 Data Infrastructure & Schema Understanding
- **DatabaseConnectorTool** — Connects to various DBs (MySQL, Mongo, CSV, etc.)
- **DBIntrospectorTool** — Extracts raw schema from DBs (tables, columns, relationships)
- **SemanticEnricherAgent** — Uses LLM + web to infer table/column purpose
- **UserNoteIntegratorTool** — Adds user knowledge to schema
- **KnowledgeGraphBuilderTool** — Builds a reusable knowledge graph for all data

### 🧠 Query Understanding & Planning
- **QueryPlannerAgent** — Converts NL query into high-level plan
- **QueryGenerationModel** — Converts plan into tool-based steps
- **QueryExecutionToolSelector** — Decides tools per step using logic/metadata

### ⚙️ Query Execution & Orchestration
- **QueryExecutorTool** — Executes SQL, Mongo, or file queries
- **TempStorageTool** — Writes intermediate outputs to MongoDB
- **FallbackExecutorTool** — Handles retries, alternate tool selection
- **ResultMetadataTracker** — Captures metadata per step (tool, params, runtime, output, etc.)
- **LangGraphFlowEngine** — LangChain-based orchestrator for full flow
- **ExecutionGuardrails** — Validates steps, enforces timeouts and retries

### 📊 Output Analysis & Delivery
- **InsightGeneratorAgent** — Statistical analysis, summarization, correlation detection
- **VisualizationBuilderModel** — Generates charts/tables from data
- **ReactFormatterAgent** — Reads React component registry and formats data accordingly
- **ActionDispatcherTool** — Sends output via email, webhook, UI, or stores in cloud

### 🔁 External Knowledge Integration
- **WebSearchTool** — Enriches context from public data
- **ExternalAPILoaderTool** — Dynamically loads external APIs for data augmentation

### 📈 Result Metadata (Audit Trail)
- Metadata attached to every step detailing execution steps with all required context for reexecution
- Stored in: `query_metadata` collection in MongoDB

## 🧭 Workflow Example (LangGraph)
1. User query → Role resolved → Context created
2. Query planned → Decomposed → Tools selected
3. DBs introspected → Knowledge graph built → Queries run
4. Intermediate results stored → Analyzed → Visualized
5. Results formatted for React → Dispatched to UI or external system
6. Metadata saved at every step

## 🧱 Deployment Notes
- Containerized using Docker (FastAPI backend, React frontend, MongoDB)
- Secured using OAuth for frontend + backend APIs
- Scalable orchestration using LangGraph DAG nodes

## 🧰 Technologies Used
- **LangChain, LangGraph**
- **FastAPI, MongoDB**
- **ReactJS + Component Registry**
- **Tavily for Web Search**
- **Docker / Azure Container Apps**
