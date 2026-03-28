FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies (workspaces handled at root)
FROM base AS deps
COPY . .
RUN npm ci

# Build all workspaces
FROM deps AS builder
RUN npm run prisma:generate -w @medlearn/api
RUN npm run build -w @medlearn/api

# Production image
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy EVERYTHING from builder stage to preserve workspace structure perfectly
COPY --from=builder /app ./

# Create uploads directory (ensure it's in the correct relative path for the api)
RUN mkdir -p apps/api/public/uploads

EXPOSE 4000

# Run from root using workspace flag - this is the most reliable way in current structure
CMD ["npm", "run", "start:prod", "--workspace=@medlearn/api"]
