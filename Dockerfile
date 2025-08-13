# Dockerfile for fullstack app (FastAPI backend + Bun frontend)

# --- Backend Stage ---
FROM python:3.13-slim AS backend-build
WORKDIR /app/backend
COPY backend/ ./
COPY .venv/ ./venv/
ENV VIRTUAL_ENV=/app/backend/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN pip install --upgrade pip && pip install -r requirements.txt

# --- Frontend Stage ---
FROM oven/bun:latest AS frontend-build
WORKDIR /app/frontend
COPY frontend/ ./
RUN bun install && bun run build

# --- Final Stage ---
FROM python:3.13-slim
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend /app/backend
COPY --from=backend-build /app/backend/venv /app/backend/venv
ENV VIRTUAL_ENV=/app/backend/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Expose ports
EXPOSE 8000
EXPOSE 8080

# Start backend and frontend
CMD ["bash", "-c", "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 & cd ../frontend && bun run preview --port 8080"]
