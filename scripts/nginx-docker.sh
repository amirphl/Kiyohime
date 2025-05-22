#!/bin/bash

# Nginx Docker Compose Management Script
# This script helps manage the Nginx container with SSL certificates

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

# Function to check if certificates exist
check_certificates() {
    if [ ! -f "./cert/yamata-no-orochi.com.crt" ] || [ ! -f "./cert/yamata-no-orochi.com.key" ]; then
        print_error "SSL certificates not found in ./cert/ directory"
        print_warning "Please ensure you have:"
        print_warning "  - ./cert/yamata-no-orochi.com.crt"
        print_warning "  - ./cert/yamata-no-orochi.com.key"
        exit 1
    fi
    print_success "SSL certificates found"
}

# Function to build the application
build_app() {
    print_status "Building application for yamata domain..."
    npm run build
    print_success "Application built successfully"
}

# Function to start the Nginx container
start_nginx() {
    print_status "Starting Nginx container..."
    docker-compose up -d
    print_success "Nginx container started"
    print_status "Access your application at: https://yamata-no-orochi.com:8443"
}

# Function to stop the Nginx container
stop_nginx() {
    print_status "Stopping Nginx container..."
    docker-compose down
    print_success "Nginx container stopped"
}

# Function to restart the Nginx container
restart_nginx() {
    print_status "Restarting Nginx container..."
    docker-compose restart
    print_success "Nginx container restarted"
}

# Function to view logs
view_logs() {
    print_status "Showing Nginx logs..."
    docker-compose logs -f nginx
}

# Function to check container status
check_status() {
    print_status "Checking container status..."
    docker-compose ps
}

# Function to rebuild and restart
rebuild() {
    print_status "Rebuilding application and restarting Nginx..."
    build_app
    docker-compose down
    docker-compose up -d
    print_success "Application rebuilt and Nginx restarted"
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     - Start Nginx container"
    echo "  stop      - Stop Nginx container"
    echo "  restart   - Restart Nginx container"
    echo "  logs      - View Nginx logs"
    echo "  status    - Check container status"
    echo "  rebuild   - Rebuild app and restart Nginx"
    echo "  help      - Show this help message"
    echo ""
    echo "Prerequisites:"
    echo "  - SSL certificates in ./cert/ directory"
    echo "  - Application built (npm run build)"
    echo "  - Docker and Docker Compose installed"
}

# Main script logic
case "${1:-help}" in
    "start")
        check_certificates
        build_app
        start_nginx
        ;;
    "stop")
        stop_nginx
        ;;
    "restart")
        restart_nginx
        ;;
    "logs")
        view_logs
        ;;
    "status")
        check_status
        ;;
    "rebuild")
        check_certificates
        rebuild
        ;;
    "help"|*)
        show_help
        ;;
esac 
