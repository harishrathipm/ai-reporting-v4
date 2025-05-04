# Makefile for backend Python project
# Similar to package.json scripts but using Make

# Variables
VENV = .venv
ACTIVATE = $(VENV)\Scripts\activate

.PHONY: setup install dev start test test-cov lint fix check typecheck requirements clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup        - Create virtual environment and install dependencies"
	@echo "  make install      - Install dependencies only"
	@echo "  make dev          - Run development server with auto-reload"
	@echo "  make start        - Run production server"
	@echo "  make test         - Run tests"
	@echo "  make test-cov     - Run tests with coverage report"
	@echo "  make lint         - Run linter (ruff) to check for issues"
	@echo "  make fix          - Auto-fix code issues with ruff"
	@echo "  make check        - Run all code quality checks (ruff + mypy)"
	@echo "  make typecheck    - Run mypy static type checking"
	@echo "  make requirements - Generate requirements.txt from installed packages"
	@echo "  make clean        - Remove virtual environment and artifacts"

# Setup environment and install dependencies
setup:
	python -m venv $(VENV)
	$(ACTIVATE) && pip install -r requirements.txt

# Install dependencies only
install:
	$(ACTIVATE) && pip install -r requirements.txt

# Run development server
dev:
	$(ACTIVATE) && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run production server
start:
	$(ACTIVATE) && uvicorn app.main:app --host 0.0.0.0 --port 8000

# Run tests
test:
	$(ACTIVATE) && python -m pytest

# Run tests with coverage report
test-cov:
	if not exist coverage mkdir coverage
	$(ACTIVATE) && python -m pytest --cov=app --cov-report=term --cov-report=html:coverage/html --cov-report=xml:coverage/coverage.xml

# Run linter (ruff check using config from pyproject.toml)
lint:
	$(ACTIVATE) && ruff check app

# Auto-fix code issues (using config from pyproject.toml)
fix:
	$(ACTIVATE) && ruff check --fix app
	$(ACTIVATE) && ruff format app

# Run all code quality checks
check:
	$(ACTIVATE) && ruff check app
	$(ACTIVATE) && ruff format --check app
	$(ACTIVATE) && mypy app

# Run static type checking (using config from pyproject.toml)
typecheck:
	$(ACTIVATE) && mypy app

# Generate requirements.txt
requirements:
	$(ACTIVATE) && pip freeze > requirements.txt

# Clean up (Windows compatible)
clean:
	for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"
	if exist .coverage del .coverage
	if exist coverage rmdir /s /q coverage
	if exist htmlcov rmdir /s /q htmlcov
	del /s *.pyc 2>nul
