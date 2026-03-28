FROM node:22-alpine AS base
WORKDIR /app

# Stage 1: Install all dependencies (workspaces handled at root)
FROM base AS deps
COPY . .
RUN npm ci

# Stage 2: Build all workspaces (ensure shared is available)
FROM deps AS builder
# @medlearn/shared has no build step (it's source-only)
COPY packages/shared ./packages/shared
RUN npm run prisma:generate -w @medlearn/api
RUN npm run build -w @medlearn/api

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy EVERYTHING from builder stage to preserve workspace structure perfectly
COPY --from=builder /app ./

# Create uploads directory
RUN mkdir -p apps/api/public/uploads

EXPOSE 4000

# Fix: Split workspace flag into separate array elements for npm to parse correctly
CMD ["npm", "run", "start:prod", "-w", "@medlearn/api"]
