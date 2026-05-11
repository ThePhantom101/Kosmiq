# Use a specialized uv image for building
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

# Install build-essential for pyswisseph C-bindings
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy project files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-install-project --no-dev

# Copy source code
COPY . .

# Final stage: Use a clean slim image
FROM python:3.12-slim-bookworm

WORKDIR /app

# Copy the virtual environment from the builder
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app /app

# Set PATH to use the virtual environment
ENV PATH="/app/.venv/bin:$PATH"

# Expose port
EXPOSE 8080

# Command to run the application
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
