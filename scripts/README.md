# Deployment Scripts

This directory contains deployment scripts for the SMS Marketing Platform.

## deploy.sh

The main deployment script that handles building and deploying the application to different environments.

### Usage

```bash
./scripts/deploy.sh [environment]
```

### Available Environments

- **production** - Production deployment (requires `.env` file with `REACT_APP_PRODUCTION_DOMAIN`)
- **yamata** - Yamata domain deployment

### Examples

```bash
# Build for yamata domain
./scripts/deploy.sh yamata

# Build for production (requires .env file)
./scripts/deploy.sh production
```

### Environment Files

The script uses environment files from the `deploy/` directory:

- `deploy/yamata.env` - Yamata domain configuration
- `.env` - Production configuration (must be created manually)

### Production Deployment

For production deployment, create a `.env` file with:

```bash
REACT_APP_PRODUCTION_DOMAIN=your-domain.com
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_PRIMARY_COLOR=#2563eb
REACT_APP_THEME=light
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_SUPPORTED_LANGUAGES=en,fa
NODE_ENV=production
```

**Note**: API URL is automatically constructed as `{DOMAIN}/api/v1` and cannot be overridden via environment variables.

### Adding Custom Deployment Commands

Edit the `deploy.sh` script to add your specific deployment commands:

- **AWS S3**: `aws s3 sync build/ s3://your-domain.com --delete`
- **Docker**: `docker build -t sms-platform-prod . && docker push your-registry/sms-platform-prod`
- **CDN Invalidation**: `aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/*'`

## nginx-docker.sh

Management script for the Nginx Docker container with SSL support.

### Usage

```bash
./scripts/nginx-docker.sh [command]
```

### Available Commands

- **start** - Build app and start Nginx container
- **stop** - Stop Nginx container
- **restart** - Restart Nginx container
- **logs** - View Nginx logs
- **status** - Check container status
- **rebuild** - Rebuild app and restart Nginx
- **help** - Show help message

### Examples

```bash
# Start Nginx with SSL
./scripts/nginx-docker.sh start

# View logs
./scripts/nginx-docker.sh logs

# Rebuild and restart
./scripts/nginx-docker.sh rebuild
```

### Prerequisites

- SSL certificates in `./cert/` directory:
  - `./cert/yamata-no-orochi.com.crt`
  - `./cert/yamata-no-orochi.com.key`
- Docker and Docker Compose installed
- Application built (`npm run build`)

### SSL Configuration

The script expects SSL certificates with specific names:
- Certificate: `./cert/yamata-no-orochi.com.crt`
- Private key: `./cert/yamata-no-orochi.com.key`

### Access URLs

- **Frontend**: `https://yamata-no-orochi.com:8443`
- **API**: `https://yamata-no-orochi.com:8443/api/v1`

### Troubleshooting

- Make sure the script is executable: `chmod +x scripts/nginx-docker.sh`
- Check that SSL certificates exist in `./cert/` directory
- Verify Docker and Docker Compose are installed
- Check container logs: `./scripts/nginx-docker.sh logs`
- Ensure application is built: `npm run build` 