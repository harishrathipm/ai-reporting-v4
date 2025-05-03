# Makefile for backend Python project
# Similar to package.json scripts but using Make

# Variables
VENV = .venv
ACTIVATE = $(VENV)\Scripts\activate

.PHONY: setup install dev start test lint format clean requirements help

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup        - Create virtual environment and install dependencies"
	@echo "  make install      - Install dependencies only"
	@echo "  make dev          - Run development server with auto-reload"
	@echo "  make start        - Run production server"
	@echo "  make test         - Run tests"
	@echo "  make lint         - Run linter"
	@echo "  make format       - Format code with Black"
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
	$(ACTIVATE) && pytest

# Run linter
lint:
	$(ACTIVATE) && flake8 app

# Format code
format:
	$(ACTIVATE) && black app

# Generate requirements.txt
requirements:
	$(ACTIVATE) && pip freeze > requirements.txt

# Clean up
clean:
	rmdir /s /q $(VENV) 2>nul || true
	for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"
	del /s *.pyc 2>nul || true