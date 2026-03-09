FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ----# Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
# Copy SDK first as it's a dependency
COPY packages/sdk ./packages/sdk
# Copy services
COPY services ./services

# Install dependencies and build SDK
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @stbr/sss-token-sdk build

# Build services
WORKDIR /app/services
RUN pnpm build

# Production stage
FROM node:20-slim
WORKDIR /app/services

# Install pnpm for production deps
RUN npm install -g pnpm

# Copy only what's needed
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json /app/tsconfig.base.json /app/
COPY --from=builder /app/packages/sdk/package.json /app/packages/sdk/
COPY --from=builder /app/packages/sdk/dist /app/packages/sdk/dist
COPY --from=builder /app/services/package.json /app/services/
COPY --from=builder /app/services/dist /app/services/dist
COPY --from=builder /app/services/drizzle.config.ts /app/services/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL="file:./db/dev.db"

# Start the server
CMD ["pnpm", "start"]
