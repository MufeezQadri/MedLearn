FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci --workspace=@medlearn/api --workspace=@medlearn/shared --include-workspace-root

# Build shared package - just copy it, apps/api will build its own dependencies
FROM deps AS builder
COPY packages/shared ./packages/shared
# Skip RUN npm run build --workspace=@medlearn/shared as it's missing a build script

COPY apps/api ./apps/api
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npm run build --workspace=@medlearn/api

# Production image
FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/packages/shared ./packages/shared

WORKDIR /app/apps/api

# Create uploads directory
RUN mkdir -p public/uploads

EXPOSE 4000

# Use npm run start:prod to handle DB sync before launching node index.js
CMD ["npm", "run", "start:prod", "--workspace=@medlearn/api"]
