# Multi-stage build for production
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - serve static files
FROM node:18-alpine

# Install serve to serve static files
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/build /app/build

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 8081

# Start serve
CMD ["serve", "-s", "build", "-l", "8081"] 