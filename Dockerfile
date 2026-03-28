FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies (workspaces handled at root)
FROM base AS deps
COPY . .
RUN npm ci

# Build all workspaces
# Note: @medlearn/shared is TypeScript types only and has no build step — skip it
FROM deps AS builder
RUN npm run prisma:generate -w @medlearn/api
RUN npm run build -w @medlearn/api

# Production image
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the entire workspace from builder to preserve the full monorepo structure,
# ensuring all package.json files (e.g. apps/api/package.json) remain in place
# for runtime npm operations such as prisma:push.
COPY --from=builder /app ./

# Create uploads directory (ensure it's in the correct relative path for the api)
RUN mkdir -p apps/api/public/uploads

EXPOSE 4000

# Use -w shorthand so npm correctly resolves the workspace at runtime
CMD ["npm", "run", "start:prod", "-w", "@medlearn/api"]
