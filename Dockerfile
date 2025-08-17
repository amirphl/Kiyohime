# Multi-stage Dockerfile for React Application
# Supports: jaazebeh.ir and beta.jaazebeh.ir

# Stage 1: Build stage
FROM node:24-alpine AS builder

# Build arguments
ARG NPM_REGISTRY=https://registry.npmjs.org/
ARG NODE_ENV=production

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Configure npm and install dependencies
RUN npm config set registry ${NPM_REGISTRY} && \
    npm config set fetch-retries 3 && \
    npm config set fetch-retry-mintimeout 5000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm config set fetch-retry-factor 2 && \
    npm ci --silent --no-audit --no-fund

# Copy source code
COPY . .

# Set production environment variables
ENV NODE_ENV=production \
    REACT_APP_NODE_ENV=production \
    REACT_APP_PRODUCTION_DOMAIN=jazz.xerexchain.com \
    REACT_APP_ENABLE_ANALYTICS=true \
    REACT_APP_PRIMARY_COLOR=#2563eb \
    REACT_APP_THEME=light \
    REACT_APP_DEFAULT_LANGUAGE=en \
    REACT_APP_SUPPORTED_LANGUAGES=en,fa \
    GENERATE_SOURCEMAP=false \
    INLINE_RUNTIME_CHUNK=false \
    FAST_REFRESH=false \
    WDS_SOCKET_HOST= \
    WDS_SOCKET_PORT= \
    WDS_SOCKET_PATH=

# Build the application for production
RUN npm run build:production

# Stage 2: Production stage
FROM nginx:1.29-alpine AS production

# Install security updates and necessary packages
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache ca-certificates tzdata curl && \
    rm -rf /var/cache/apk/*

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy production-grade nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories with proper permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html && \
    chmod 755 /var/cache/nginx && \
    rm -f /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check (using curl instead of wget for better reliability)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]