# Parameterized Monorepo Dockerfile
FROM node:22-alpine AS base
WORKDIR /app

# Accept the service to build as an argument (defaults to api)
ARG SERVICE=@medlearn/api
ENV SERVICE=${SERVICE}

# Stage 1: Dependencies
FROM base AS deps
COPY . .
RUN npm ci

# Stage 2: Build
FROM deps AS builder
# @medlearn/shared uses source-only (no build)
RUN npm run build -w ${SERVICE}
# Only generate prisma if building the api
RUN if [ "${SERVICE}" = "@medlearn/api" ]; then npm run prisma:generate -w @medlearn/api; fi

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG SERVICE=@medlearn/api
ENV SERVICE=${SERVICE}

# Copy EVERYTHING from builder stage (full workspace parity)
COPY --from=builder /app ./

# Conditional Setup for API
RUN if [ "${SERVICE}" = "@medlearn/api" ]; then \
    mkdir -p apps/api/public/uploads; \
    fi

# Conditional Setup for Web (install serve)
RUN if [ "${SERVICE}" = "@medlearn/web" ]; then \
    npm install -g serve; \
    fi

EXPOSE 4000
EXPOSE 3000

# Fix the CMD array syntax to use the SERVICE env var
# Dynamic CMD for different services
CMD if [ "${SERVICE}" = "@medlearn/api" ]; then \
    npm run start:prod -w ${SERVICE}; \
    else \
    serve -s apps/web/dist -l 3000; \
    fi
