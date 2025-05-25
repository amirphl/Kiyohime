#!/bin/bash

# Script to generate self-signed SSL certificate for yamata-no-orochi.com
# This script creates a certificate valid for 365 days

set -e

# Configuration
DOMAIN="yamata-no-orochi.com"
CERT_DIR="./cert"
KEY_FILE="$CERT_DIR/yamata-no-orochi.com.key"
CERT_FILE="$CERT_DIR/yamata-no-orochi.com.crt"
CSR_FILE="$CERT_DIR/yamata-no-orochi.com.csr"
CONFIG_FILE="$CERT_DIR/openssl.conf"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if OpenSSL is installed
if ! command -v openssl &> /dev/null; then
    print_error "OpenSSL is not installed. Please install it first:"
    echo "  sudo pacman -S openssl"
    exit 1
fi

# Create cert directory if it doesn't exist
if [ ! -d "$CERT_DIR" ]; then
    print_status "Creating certificate directory: $CERT_DIR"
    mkdir -p "$CERT_DIR"
fi

# Create OpenSSL configuration file
print_status "Creating OpenSSL configuration file..."
cat > "$CONFIG_FILE" << EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C = IR
ST = Tehran
L = Tehran
O = Yamata No Orochi
OU = IT Department
CN = $DOMAIN
emailAddress = admin@$DOMAIN

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = $DOMAIN
DNS.2 = *.$DOMAIN
DNS.3 = localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

# Generate private key
print_status "Generating private key..."
openssl genrsa -out "$KEY_FILE" 2048

# Generate Certificate Signing Request (CSR)
print_status "Generating Certificate Signing Request..."
openssl req -new -key "$KEY_FILE" -out "$CSR_FILE" -config "$CONFIG_FILE"

# Generate self-signed certificate
print_status "Generating self-signed certificate..."
openssl x509 -req -in "$CSR_FILE" -signkey "$KEY_FILE" -out "$CERT_FILE" -days 365 -extensions v3_req -extfile "$CONFIG_FILE"

# Set proper permissions
print_status "Setting proper permissions..."
chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"
chmod 644 "$CSR_FILE"
chmod 644 "$CONFIG_FILE"

# Verify the certificate
print_status "Verifying the generated certificate..."
openssl x509 -in "$CERT_FILE" -text -noout | head -20

# Display certificate information
print_status "Certificate generated successfully!"
echo ""
echo "Certificate files created:"
echo "  Private Key: $KEY_FILE"
echo "  Certificate: $CERT_FILE"
echo "  CSR: $CSR_FILE"
echo "  Config: $CONFIG_FILE"
echo ""
echo "Certificate details:"
openssl x509 -in "$CERT_FILE" -noout -subject -issuer -dates

print_warning "This is a self-signed certificate. Browsers will show a security warning."
print_warning "For production use, consider using Let's Encrypt or a commercial CA."

# Optional: Create a combined PEM file for some applications
print_status "Creating combined PEM file..."
cat "$CERT_FILE" "$KEY_FILE" > "$CERT_DIR/yamata-no-orochi.com.pem"
chmod 600 "$CERT_DIR/yamata-no-orochi.com.pem"

echo ""
print_status "Combined PEM file created: $CERT_DIR/yamata-no-orochi.com.pem"
echo ""
print_status "Certificate generation completed successfully!" 