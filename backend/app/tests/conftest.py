import os
import sys
from pathlib import Path

# Add the parent directory to sys.path to make 'app' importable
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))