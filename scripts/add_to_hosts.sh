#!/bin/bash

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

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

add_to_hosts() {
  local domain='yamata-no-orochi.com'

  print_status "Adding domain to /etc/hosts file..."

  # Check if already exists
  if grep -q "$domain" /etc/hosts; then
    print_warning "Domain $domain already exists in /etc/hosts"
    return 0
  fi

  # Add to hosts file (requires sudo)
  if command_exists sudo; then
    echo "127.0.0.1 $domain www.$domain api.$domain monitoring.$domain" | sudo tee -a /etc/hosts >/dev/null
    print_success "Domain added to /etc/hosts"
  else
    print_warning "Please manually add the following line to /etc/hosts:"
    echo "127.0.0.1 $domain www.$domain api.$domain monitoring.$domain"
  fi
}

add_to_hosts
