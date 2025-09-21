# syntax=docker/dockerfile:1

# Install dependencies once and reuse layer
FROM node:20-bookworm AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build frontend + server bundles
FROM deps AS builder
COPY . .
RUN npm run build

# Production image, only runtime deps + built assets
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist
# Include any additional runtime assets if needed
COPY --from=builder /app/public ./public

EXPOSE 8080
CMD ["npm", "run", "start"]
