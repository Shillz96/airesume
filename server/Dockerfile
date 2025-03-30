FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python application code
COPY python_api/ ./python_api/
COPY models/ ./models/
COPY routes/ ./routes/

# Set Python path
ENV PYTHONPATH=/app

# Command to run the application using Gunicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "python_api.main:app", "--bind", "0.0.0.0:${PORT:-8000}"] 