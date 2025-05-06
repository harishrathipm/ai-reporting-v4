# Makefile for backend Python project
# Similar to package.json scripts but using Make

# Variables
VENV = .venv
ACTIVATE = $(VENV)\Scripts\activate

.PHONY: setup install dev start test test-cov compile requirements clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup        - Create virtual environment and install dependencies"
	@echo "  make install      - Install dependencies only"
	@echo "  make dev          - Run development server with auto-reload"
	@echo "  make start        - Run production server"
	@echo "  make compile      - Compile Python files to .pyc bytecode"
	@echo "  make test         - Run tests"
	@echo "  make test-cov     - Run tests with coverage report"
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

# Compile Python files to bytecode
compile:
	$(ACTIVATE) && python -m compileall app

# Run tests (includes compilation first)
test: compile
	$(ACTIVATE) && python -m pytest

# Run tests with coverage report (includes compilation first)
test-cov: compile
	if not exist coverage mkdir coverage
	$(ACTIVATE) && python -m pytest --cov=app --cov-report=term --cov-report=html:coverage/html --cov-report=xml:coverage/coverage.xml

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
