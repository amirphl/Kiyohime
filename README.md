# Marketing Platform

A modern web application to create and manage targeted SMS marketing campaigns. Built with React, TypeScript, and Tailwind CSS with multi-domain deployment support.

## 🌟 Features

- **Multi-Domain Support**: Automatic configuration per domain (dev/prod)
- **Internationalization**: English and Persian (RTL) with dynamic calendar and currency labels
- **Authentication**: Phone/OTP-based login with robust 401 handling and reliable redirects
- **Campaign Wizard (4 Steps)**:
  - Segment: title, segment, subsegments, sex, cities; capacity auto-calculated and persisted
  - Content: link insertion with marker (🔗), Shamsi/Gregorian datetime (24h), strict validation
  - Budget: debounced API calls, estimated messages (msg_target/max_msg_target), max budget enforced
  - Payment: cost breakdown from API (sub_total/tax/total), wallet balance check, finish calls Update API
- **Debounced Inputs**: Budget and report filters avoid API bombardment
- **Wallet Integration**: Balance fetched once on payment; disables finish if insufficient
- **Reports**: Paginated (infinite scroll), sort, title filter, translated statuses, details modal with "Fix and restart"
- **Robust API Client**: Centralized service with token attachment and error handling

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Phone Input**: react-phone-number-input
- **Build Tool**: Create React App
- **Deployment**: Docker, Nginx, Multi-environment support

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Docker (for containerized deployment)

## 🛠️ Installation & Development

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd Kiyohime
```

2. Install dependencies:
```bash
npm install
```

3. Set up yamata-no-orochi.com in /etc/hosts:
```bash
sudo nano /etc/hosts
# Add: 127.0.0.1 yamata-no-orochi.com
```

4. Development with Nginx proxy (recommended):
```bash
./scripts/nginx-docker.sh dev
npm start
```

5. Access at https://yamata-no-orochi.com:8443 (API proxied at /api/v1)

6. Type-check and lint:
```bash
npm run type-check
npm run lint
```

### Environment Configuration

The application automatically detects the domain and applies the appropriate configuration:

- **yamata-no-orochi.com** - Local development (set in /etc/hosts)
- **Production domain** - Read from REACT_APP_PRODUCTION_DOMAIN in .env

## 🐳 Docker Deployment

### Docker Deployment

```bash
# Build and run the application
docker build -t sms-platform .
docker run -p 8081:8081 sms-platform

# For production deployment
docker build -t sms-platform-prod .
docker run -p 80:8081 sms-platform-prod
```

### Nginx with SSL (Recommended)

For SSL-enabled deployment with Nginx:

#### Production Mode
```bash
# Prepare SSL certificates
mkdir -p cert
cp /path/to/your/certificate.crt ./cert/yamata-no-orochi.com.crt
cp /path/to/your/private.key ./cert/yamata-no-orochi.com.key

# Build application
./scripts/deploy.sh yamata

# Start Nginx with SSL
./scripts/nginx-docker.sh start

# Access: https://yamata-no-orochi.com:8443
```

#### Development Mode (Faster)
```bash
# Prepare SSL certificates
mkdir -p cert
cp /path/to/your/certificate.crt ./cert/yamata-no-orochi.com.crt
cp /path/to/your/private.key ./cert/yamata-no-orochi.com.key

# Start Nginx (proxies to development server)
./scripts/nginx-docker.sh dev

# In another terminal, start development server
npm start

# Access: https://yamata-no-orochi.com:8443 (with hot reload)
```

## 🚀 Production Deployment

### Quick Start

1. **Environment Setup**
   ```bash
   # Create .env file
   REACT_APP_PRODUCTION_DOMAIN=your-domain.com
   REACT_APP_ENABLE_ANALYTICS=true
   REACT_APP_PRIMARY_COLOR=#2563eb
   REACT_APP_THEME=light
   REACT_APP_DEFAULT_LANGUAGE=en
   REACT_APP_SUPPORTED_LANGUAGES=en,fa
   NODE_ENV=production
   ```

2. **Build for Production**
   ```bash
   ./scripts/deploy.sh production
   ```

### Deployment Options

#### Option A: Static Hosting (Recommended)

**AWS S3 + CloudFront:**
```bash
npm run build:production
aws s3 sync build/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

#### Option B: Docker Deployment
```bash
docker build -t sms-platform-prod .
docker run -p 80:8081 sms-platform-prod
```

#### Option C: Traditional Server
```bash
# Copy build files
scp -r build/ user@your-server:/var/www/sms-platform/

# Configure nginx and enable site
sudo ln -s /etc/nginx/sites-available/sms-platform /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/sms-platform;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] API keys not exposed in frontend
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Error pages configured
- [ ] Monitoring and logging set up

### Monitoring

**Health Check**: `/api/v1/health`

**Performance Monitoring**:
- Lighthouse audits
- Core Web Vitals
- Error tracking (Sentry)
- Analytics (Google Analytics)

**Logging**:
```bash
# Docker logs
docker logs sms-platform-prod

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Troubleshooting

**Common Issues**:
1. **Build fails**: Check Node.js version (>=16.0.0)
2. **404 errors**: Ensure nginx handles React Router correctly
3. **API errors**: Verify CORS configuration
4. **Performance issues**: Enable gzip compression

**Debug Commands**:
```bash
npm run analyze      # Check build size
npm run type-check   # Type checking
npm run lint         # Linting
npx serve -s build   # Test build locally
```

### CI/CD Pipeline

**GitHub Actions Example**:
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build:production
      - run: npm run type-check
      - run: npm run lint
      - name: Deploy to S3
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync build/ s3://your-bucket --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## 📦 Manual Deployment

### Using Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to different environments
./scripts/deploy.sh production
./scripts/deploy.sh yamata
```

### Environment-Specific Builds

```bash
# Yamata domain build
cp deploy/yamata.env .env
npm run build

# Production build (requires .env with REACT_APP_PRODUCTION_DOMAIN)
npm run build
```

## 🌍 Multi-Domain Features

### Automatic Configuration

The application automatically detects the domain and applies:

- **Brand Name & Subtitle**: Different for each domain
- **Primary Color**: Domain-specific theming
- **Default Language**: Farsi, English
- **API Endpoints**: Domain-specific API URLs
- **Feature Flags**: Environment-specific features
- **Environment Banner**: Shows current environment on non-production domains

### Domain-Specific Configurations

| Domain | Language | Default Lang | Primary Color | Features | API Endpoint |
|--------|----------|--------------|---------------|----------|--------------|
| yamata-no-orochi.com | English | en | Red (#dc2626) | Development | https://yamata-no-orochi.com:8443/api/v1 |
| Production | English | en | Blue (#2563eb) | Production | https://{domain}/api/v1 |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx     # Navigation header
│   ├── Footer.tsx     # Site footer
│   ├── DynamicBrand.tsx # Domain-aware branding
│   └── EnvironmentBanner.tsx # Environment indicator
├── config/            # Configuration files
│   └── environment.ts # Multi-domain configuration
├── hooks/             # Custom React hooks
│   ├── useLanguage.tsx # Language management
│   ├── useTranslation.tsx # Translation system
│   └── useConfig.tsx # Environment configuration
├── locales/           # Translation files
│   └── translations.ts # English/Farsi translations
├── pages/             # Page components
│   ├── LoginPage.tsx  # Phone authentication
│   └── SignupPage.tsx # User registration
├── services/          # API services
│   └── api.ts        # Domain-aware API client
└── App.tsx           # Main application component

deploy/               # Deployment configurations
├── localhost.env    # Localhost environment
├── yamata.env       # Yamata domain environment
└── production.env   # Production environment template

scripts/              # Deployment scripts
└── deploy.sh        # Multi-environment deployment

Dockerfile           # Production Docker build
```

Additional notable modules:
- `src/hooks/useCampaign.tsx`: Campaign context and persistence (localStorage)
- `src/hooks/useCampaignValidation.ts`: Step-by-step validation (capacity, link marker, schedule >= now+10m, balance)
- `src/utils/campaignUtils.ts`: Character counting, SMS parts, and content validation
- `src/pages/ReportsPage.tsx`: Infinite scroll, sort, filter, details modal (translated labels)
- `src/components/campaign/*`: Step components with debouncing and validation

## 🔧 Configuration

### Environment Variables

```bash
# Domain Configuration
REACT_APP_DOMAIN=yamata-no-orochi.com
REACT_APP_PRODUCTION_DOMAIN=your-production-domain.com

# Features
REACT_APP_ENABLE_ANALYTICS=true

# UI
REACT_APP_PRIMARY_COLOR=#2563eb
REACT_APP_THEME=light

# Localization (always enabled)
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_SUPPORTED_LANGUAGES=en,fa
```

**Note**: API URL is automatically constructed as `{DOMAIN}/api/v1` (with port 8443 for development) and cannot be overridden via environment variables.

### Adding New Domains

1. For development domains, add configuration in `src/config/environment.ts`:
```typescript
'newdomain.com': {
  domain: 'newdomain.com',
  baseUrl: 'http://newdomain.com',
  apiUrl: 'http://newdomain.com/api/v1',
  brandName: 'New Brand',
  // ... other configurations
}
```

2. Create environment file `deploy/newdomain.env`

3. For production domains, set `REACT_APP_PRODUCTION_DOMAIN` in your `.env` file

## 🌐 Internationalization

### Supported Languages

- **English (en)**: Left-to-right layout; Gregorian Tehran time; currency label: Toman
- **Farsi (fa)**: Right-to-left layout; Shamsi calendar; currency label: تومان

### Language Switching

- Click the globe icon in the header to switch languages
- Language preference is saved in localStorage
- Automatic RTL layout for Farsi

## 🔒 Security Features

- HTTPS enforcement on production
- Security headers via Nginx
- Content Security Policy
- XSS protection
- CSRF protection

## 📊 Monitoring & Analytics

- Environment-specific analytics
- Health check endpoints
- Error logging
- Performance monitoring

## 🚀 Available Scripts

- `npm start` - Start dev server (port 8081)
- `npm run start:direct` - Start dev server without WDS overrides
- `npm run build` - Build for production
- `npm run build:production` - Optimized production build
- `npm test` - Launch tests
- `npm run type-check` - TypeScript check
- `npm run lint` - ESLint
- `npm run lint:fix` - ESLint (fix)
- `npm run analyze` - Build and analyze bundle
- `npm run check` - Lint + Prettier check + TS check
- `npm run fix` - Lint fix + Prettier format
- `npm run deploy:yamata` - Build/deploy yamata
- `npm run deploy:production` - Build/deploy production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 