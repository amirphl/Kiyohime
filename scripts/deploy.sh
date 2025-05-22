#!/bin/bash

# Deployment script for SMS Marketing Platform
# Usage: ./scripts/deploy.sh [environment]
# Environments: production, yamata

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is provided
if [ -z "$1" ]; then
    print_error "Please specify an environment: production, yamata"
    echo "Usage: ./scripts/deploy.sh [environment]"
    echo ""
    echo "Available environments:"
    ls deploy/*.env 2>/dev/null | sed 's/deploy\///' | sed 's/\.env//' || echo "No environment files found in deploy/"
    echo ""
    echo "For production, create a .env file with REACT_APP_PRODUCTION_DOMAIN set"
    exit 1
fi

ENVIRONMENT=$1

# Handle production environment differently
if [ "$ENVIRONMENT" = "production" ]; then
    if [ ! -f ".env" ]; then
        print_error "Production deployment requires a .env file with REACT_APP_PRODUCTION_DOMAIN set"
        echo "Example .env content:"
        echo "REACT_APP_PRODUCTION_DOMAIN=your-domain.com"
        echo "REACT_APP_API_URL=https://your-domain.com/api/v1"
        exit 1
    fi
    ENV_FILE=".env"
else
    ENV_FILE="deploy/${ENVIRONMENT}.env"
    
    # Check if environment file exists
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Environment file not found: $ENV_FILE"
        echo "Available environments:"
        ls deploy/*.env 2>/dev/null | sed 's/deploy\///' | sed 's/\.env//' || echo "No environment files found in deploy/"
        exit 1
    fi
fi

print_status "Deploying to $ENVIRONMENT environment..."

# Copy environment file (only for non-production environments)
if [ "$ENVIRONMENT" != "production" ]; then
    print_status "Setting up environment variables..."
    cp "$ENV_FILE" .env
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the application
print_status "Building application for $ENVIRONMENT..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed!"
    exit 1
fi

# Environment-specific deployment steps
case $ENVIRONMENT in
    "production")
        print_status "Deploying to production..."
        print_status "Build completed for production domain"
        print_success "Production build completed!"
        print_warning "Add your production deployment commands here:"
        echo "  - AWS S3: aws s3 sync build/ s3://your-domain.com --delete"
        echo "  - Docker: docker build -t sms-platform-prod . && docker push your-registry/sms-platform-prod"
        echo "  - CDN: aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/*'"
        ;;
    "yamata")
        print_status "Building for yamata-no-orochi.com..."
        print_success "Yamata build completed!"
        print_warning "Add your yamata deployment commands here:"
        echo "  - Copy build files to your server"
        echo "  - Update nginx configuration"
        echo "  - Restart services"
        ;;
    *)
        print_error "Unknown environment: $ENVIRONMENT"
        echo "Available environments: production, yamata"
        exit 1
        ;;
esac

# Final status
print_success "Deployment to $ENVIRONMENT completed successfully!"
print_status "Build files are ready in the 'build/' directory" 