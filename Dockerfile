# Multi-stage Dockerfile for React Application
# Supports: jaazebeh.ir and beta.jaazebeh.ir

# Stage 1: Build stage
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies for build
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM nginx:1.29-alpine AS production

# Install security updates
RUN apk update && apk upgrade --no-cache

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy production-grade nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories with proper permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html

# Remove default nginx configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 