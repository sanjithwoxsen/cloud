# ---------- FRONTEND BUILD STAGE ----------
FROM --platform=linux/arm64 oven/bun:latest AS frontend-builder
WORKDIR /app/frontend

# Copy deps first to use cache
COPY frontend/package.json frontend/bun.lockb* ./

# Always regen lockfile for the correct arch
RUN rm -f bun.lockb && bun install

# Copy rest of frontend source
COPY frontend/ .

# Build (optional if running vite dev later, but keeps dist ready)
RUN bun run build

# ---------- BACKEND + FINAL IMAGE ----------
FROM --platform=linux/arm64 python:3.13-slim AS final
WORKDIR /app

# Install Python deps
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt uvicorn

# Install Node.js and npm in the final image
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Copy backend code
COPY backend/ ./backend

# Copy frontend source & node_modules from builder
COPY --from=frontend-builder /app/frontend ./frontend
COPY --from=frontend-builder /app/frontend/node_modules ./frontend/node_modules

# Copy startup script
COPY startup.sh .
RUN chmod +x startup.sh

# Expose ports
EXPOSE 8000 8080

CMD ["/bin/bash", "startup.sh"]
