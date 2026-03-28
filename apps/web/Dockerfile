FROM node:22-alpine AS base
WORKDIR /app

# Stage 1: Install dependencies (workspaces handled at root)
FROM base AS deps
COPY . .
RUN npm ci

# Stage 2: Build the web app
FROM deps AS builder
# @medlearn/shared uses source-only (no build)
RUN npm run build -w @medlearn/web

# Stage 3: Production runner (serving static files)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install a simple static server
RUN npm install -g serve

# Copy ONLY the built dist folder from the builder
COPY --from=builder /app/apps/web/dist ./dist

# Vite apps usually serve on 3000 or the PORT env var
EXPOSE 3000

# Serve the dist folder
# Railway injects the PORT env var, so we use it here
CMD ["serve", "-s", "dist", "-l", "3000"]
