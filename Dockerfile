FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci --workspace=@medlearn/api --workspace=@medlearn/shared --include-workspace-root

# Build shared package - just copy it, apps/api will build its own dependencies
FROM deps AS builder
COPY packages/shared ./packages/shared
# Skip RUN npm run build --workspace=@medlearn/shared as it's missing a build script

COPY apps/api ./apps/api
RUN npm run prisma:generate --workspace=@medlearn/api
RUN npm run build --workspace=@medlearn/api

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy root package.json and all workspace package.jsons (required for npm workspace commands)
COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

# Copy built dependencies and compiled output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/packages/shared ./packages/shared

# Create uploads directory (ensure it's in the correct relative path for the api)
RUN mkdir -p apps/api/public/uploads

EXPOSE 4000

# Use an explicit JSON array for the CMD to ensure correct path and signal handling
CMD ["npm", "run", "start:prod", "--workspace=@medlearn/api"]
