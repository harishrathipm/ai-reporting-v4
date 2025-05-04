# Dynamic Reporting AI - Development Guidelines

This document outlines the development guidelines and best practices for the Dynamic Reporting AI project. It serves as a reference for developers, automated code generation tools, and agents to ensure consistent code generation and maintenance.

## Table of Contents

1. [General Guidelines](#general-guidelines)
2. [File Organization Principles](#file-organization-principles)
3. [Test-Driven Development](#test-driven-development)
4. [Backend Development (Python/FastAPI)](#backend-development)
5. [Frontend Development (React/TypeScript)](#frontend-development)
6. [AI/ML Components (LangGraph/LangChain)](#ai-ml-components)
7. [Testing](#testing)
8. [Documentation](#documentation)
9. [Code Review Process](#code-review-process)
10. [Actionable Guidelines](#actionable-guidelines)

## General Guidelines

### Project Structure
- Follow the monorepo structure with clear separation of backend, frontend, and docs
- Each component should be modular and focused on a single responsibility
- Use meaningful file and directory names that reflect their purpose

### Code Style
- Maintain consistent code formatting across the codebase
- Follow language-specific style guides (PEP 8 for Python, Airbnb for JavaScript/TypeScript)
- Use meaningful variable and function names with proper casing conventions

### Version Control
- Use semantic versioning (SEMVER) for releases
- Follow the Git Flow branching model (main, develop, feature branches)
- Write clear, descriptive commit messages with a consistent format

### Environment Configuration
- Store configuration in environment variables or dedicated config files
- Never commit sensitive information (API keys, credentials) to version control
- Use different environments for development, staging, and production

## File Organization Principles

### Single Responsibility Per File
- Each file should have a single, well-defined responsibility
- Limit file size (generally <200 lines of code) to maintain readability
- Name files according to the component, agent, tool, or test they contain

### Component Per File (Frontend)
- Each React component should reside in its own file
- Component files should export only one component as default
- Use index.ts files for re-exporting components from directories
- Place component-specific hooks and utilities in separate files within the same directory

### Agent/Tool Per File (AI/ML)
- Each agent should be defined in its own file
- Each tool should be implemented in a dedicated file
- Group related agents/tools in logical directories
- Use clear naming: `<name>Agent.ts`, `<name>Tool.ts`

### Test Per File
- Create separate test files for each implementation file
- Follow parallel directory structure for tests (e.g., `src/components/Button.tsx` → `src/components/__tests__/Button.test.tsx`)
- Name test files consistently (e.g., `*.test.ts`, `*_test.py`)
- Each test file should focus on a single component, function, or class

## Test-Driven Development

### TDD Workflow
- Write tests before implementing functionality (Red-Green-Refactor)
- Start with failing tests that define expected behavior
- Implement the minimum code needed to pass tests
- Refactor while keeping tests passing

### When to Create Tests
- **Backend**: Create test files immediately when creating new endpoints, services, or utilities
- **Frontend**: Write tests alongside new component creation or feature implementation
- **AI/ML**: Create evaluation tests for each new agent or tool

### Test Coverage Guidelines
- Aim for minimum 80% code coverage across the codebase
- Achieve 100% coverage for critical infrastructure and business logic
- Update tests immediately when modifying existing code

## Backend Development

### Architecture
- Follow the FastAPI application structure:
  - Routers for API endpoint definitions
  - Models for data validation with Pydantic
  - Services for business logic implementation
  - Tools for reusable utility functions
  - Agents for higher-level AI-driven capabilities

### Python Coding Standards
- Use Python 3.10+ features and typing hints
- Follow PEP 8 style guide and docstring conventions (PEP 257)
- Implement proper error handling and logging

### API Design
- Design RESTful APIs with appropriate HTTP methods and status codes
- Use consistent naming conventions for endpoints
- Implement proper input validation and error responses
- Document APIs using FastAPI's automatic Swagger generation

### Database Access
- Use async database drivers where possible for improved performance
- Implement proper connection pooling and transaction management
- Write clear and optimized database queries

### Module Organization
- Use clear directory structure for different concerns:
  - `routers/` for API endpoint definitions
  - `models/` for Pydantic data models
  - `services/` for business logic
  - `tools/` for reusable utilities
  - `agents/` for AI agent implementations
  - `tests/` for test files (parallel to implementation)
- Keep files small and focused on a single responsibility
- Implement one class/function per file for complex components

### Example Backend Code Structure

```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

# Define models with proper typing
class ItemModel(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Sample Item",
                "description": "This is a sample item description"
            }
        }

# Organize routes by resource
router = APIRouter(prefix="/api/items", tags=["items"])

@router.get("/", response_model=List[ItemModel])
async def get_items():
    """
    Get all items.
    
    Returns a list of all available items.
    """
    try:
        # Implementation
        return items_list
    except Exception as e:
        # Proper error handling
        logger.error(f"Error retrieving items: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

## Frontend Development

### Architecture
- Follow component-based architecture with React
- Use TypeScript for type safety
- Implement service-based approach for API interactions and state management

### React Component Structure
- Create reusable, single-responsibility components
- Organize components by feature or functionality
- Use functional components with hooks instead of class components
- Implement proper prop type validation

### TypeScript Best Practices
- Define interfaces for all data structures
- Use proper typing for all variables, functions, and components
- Avoid using 'any' type when possible
- Use TypeScript utility types when appropriate

### Styling
- Use MUI components with consistent theming
- Follow responsive design principles
- Use a consistent naming convention for CSS classes

### React Component Organization
- Follow a consistent component directory structure:
```
ComponentName/
  ├── index.ts                 # Re-export component
  ├── ComponentName.tsx        # Main component implementation
  ├── ComponentName.test.tsx   # Component tests
  ├── ComponentName.types.ts   # Component-specific types
  ├── ComponentName.styles.ts  # Component styles
  └── hooks/                   # Component-specific hooks
      └── useCustomHook.ts     # Custom hook implementation
```
- Create new component files for any component that:
  - Is used in multiple places
  - Contains significant logic
  - Exceeds 100 lines of code

### Example Frontend Code Structure

```typescript
// Define proper interfaces
interface ItemProps {
  id?: number;
  name: string;
  description?: string;
  onItemClick?: (id: number) => void;
}

// Functional component with TypeScript
const ItemComponent: React.FC<ItemProps> = ({ 
  id, 
  name, 
  description, 
  onItemClick 
}) => {
  const handleClick = () => {
    if (id && onItemClick) {
      onItemClick(id);
    }
  };

  return (
    <div className="item-container" onClick={handleClick}>
      <h3>{name}</h3>
      {description && <p>{description}</p>}
    </div>
  );
};

export default ItemComponent;
```

### State Management
- Use React hooks (useState, useEffect, useContext) for component-level state
- Consider using React Context API for sharing state between components
- For complex state management, use a state management library like Redux

### API Integration
- Create service modules for API calls
- Use axios or fetch API with proper error handling
- Implement proper loading and error states

## AI/ML Components

### LangGraph & LangChain
- Follow the agent-tools pattern for building AI capabilities
- Design reusable tools with clear interfaces
- Build composable chains and graphs that can be easily tested
- Handle errors gracefully and provide fallback mechanisms

### Agent Design
- Each agent should have a clear, single responsibility
- Implement proper input validation and output formatting
- Document agent capabilities, inputs, and outputs
- Provide examples for agent interactions

### Prompt Engineering
- Create clear, concise, and deterministic prompts
- Store prompts in a central repository for easy management
- Use templating for dynamic prompt generation
- Document prompt parameters and expected outputs

### Agent and Tool Organization
- Place each agent in its own file, named after the agent's purpose
- Implement each tool in a dedicated file
- Group related agents and tools in logical directories:
```
agents/
  ├── query/
  │   ├── QueryPlannerAgent.py
  │   └── QueryExecutorAgent.py
  ├── data/
  │   └── DataEnrichmentAgent.py
  └── common/
      └── BaseAgent.py
tools/
  ├── database/
  │   ├── SQLQueryTool.py
  │   └── MongoQueryTool.py
  ├── web/
  │   └── WebSearchTool.py
  └── common/
      └── BaseTool.py
```
- Create corresponding test files in parallel structure

### Example LangGraph Implementation

```python
from langchain.agents import Tool
from langchain.prompts import PromptTemplate
from langgraph.graph import StateGraph

# Define clear tool interfaces
def query_database(query: str) -> str:
    """
    Execute a query against the database.
    
    Args:
        query: The query to execute
        
    Returns:
        The query result as a string
    """
    # Implementation
    return result

# Create tools with descriptive documentation
tools = [
    Tool(
        name="database_query",
        func=query_database,
        description="Useful for querying the database to retrieve information"
    )
]

# Define clear prompts
prompt_template = PromptTemplate(
    template="You are a data analyst. Answer the following question: {question}",
    input_variables=["question"]
)

# Define state and workflow
workflow = StateGraph(initial_state={"question": "", "response": ""})
# Add nodes to the graph
# Connect nodes with conditionals
```

## Testing

### Backend Testing
- Use pytest for unit and integration tests
- Aim for high test coverage (minimum 80%)
- Implement fixtures for reusable test setups
- Use mocking for external dependencies

### Frontend Testing
- Use Jest and React Testing Library for component tests
- Implement snapshot testing for UI components
- Test hooks and utility functions with unit tests
- Use mock service workers (MSW) for API mocking

### AI/ML Testing
- Create evaluation sets for agent and tool testing
- Compare agent responses against expected outputs
- Test failure modes and edge cases
- Implement automated regression testing

### Test File Organization
- Create test files alongside implementation files or in parallel directory structure
- Group tests by the type of testing (unit, integration, e2e)
- Name test files consistently and descriptively
- Backend example:
```
app/
  ├── routers/
  │   └── query.py
  └── tests/
      ├── unit/
      │   └── routers/
      │       └── test_query.py
      └── integration/
          └── routers/
              └── test_query_integration.py
```
- Frontend example:
```
src/
  ├── components/
  │   └── Button/
  │       ├── Button.tsx
  │       └── Button.test.tsx
  └── services/
      ├── api.ts
      └── __tests__/
          └── api.test.ts
```

## Documentation

### Code Documentation
- Document all public functions, classes, and methods
- Include type hints and return values
- Explain complex logic and algorithms
- Keep documentation up to date with code changes

### System Documentation
- Maintain architecture diagrams for system components
- Document integration points and dependencies
- Update documentation with each major release
- Include setup and deployment instructions

### User Documentation
- Provide clear explanations of features and capabilities
- Include examples and use cases
- Update documentation with each user-facing change
- Collect and incorporate user feedback

## Code Review Process

### Pre-Submission
- Run automated linting and formatting tools
- Ensure all tests pass locally
- Verify documentation is up to date
- Check for security vulnerabilities

### Review Criteria
- Code follows established patterns and guidelines
- Tests cover new functionality and edge cases
- Documentation is clear and complete
- No unnecessary complexity or dependencies

### Post-Review
- Address all review comments
- Update tests and documentation as needed
- Ensure CI/CD pipeline passes
- Merge with approval from at least one reviewer

## Actionable Guidelines

These guidelines outline specific actions to take during development:

### When Creating a New Feature
1. **Start with a test file** that defines the expected behavior
2. **Create separate files** for each component, agent, or tool
3. **Implement the feature** with the smallest scope that satisfies the tests
4. **Document the feature** inline and in relevant documentation
5. **Run tests and linting** before submitting for review

### When Modifying Existing Code
1. **Check existing tests** to understand current behavior
2. **Add new tests** for any new functionality
3. **Update existing tests** to reflect changes in behavior
4. **Keep changes focused** on a single responsibility
5. **Run the full test suite** to ensure no regressions

### When Refactoring
1. **Ensure comprehensive test coverage** before starting
2. **Make small, incremental changes** with tests passing at each step
3. **Split large files** into smaller, focused files when appropriate
4. **Extract reusable functionality** into separate modules
5. **Update documentation** to reflect structural changes

### When Adding a New Component
1. **Create a new directory** for the component with the appropriate structure
2. **Implement component-specific types** in a separate file
3. **Write tests** that verify component behavior
4. **Document props and behavior** in the component file
5. **Consider extracting complex logic** into custom hooks or utilities

### When Implementing a New Agent or Tool
1. **Define clear input and output interfaces** before implementation
2. **Create a dedicated file** for the agent or tool
3. **Write tests** for various scenarios including edge cases
4. **Document expected behavior** and usage examples
5. **Implement error handling** and logging

## Tools and References

### Backend
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [PEP 8 Style Guide](https://peps.python.org/pep-0008/)

### Frontend
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Material-UI Documentation](https://mui.com/getting-started/usage/)

### AI/ML
- [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Prompt Engineering Guidelines](https://www.promptingguide.ai/)