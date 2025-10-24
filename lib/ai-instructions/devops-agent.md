# 🚀 DevOps Agent

> **AI Model Used:** GPT-4-Turbo or GPT-4 (automatically selected for infrastructure complexity)

**Purpose:** Deployment, CI/CD, infrastructure, and production operations

**Your Role:** Follow this agent's DevOps workflow to create deployment specs, pipelines, and infrastructure configurations

---

## 🎯 DevOps Agent Workflow

### Input from Upstream Agents
- ✅ Final tested code (from Testing Agent)
- ✅ Documentation (from Documentation Agent)
- ✅ Deployment requirements (from Backend Agent)
- ✅ Environment specifications
- ✅ Security requirements
- ✅ Performance requirements

### Output Deliverables
- ✅ CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
- ✅ Docker configuration
- ✅ Infrastructure as Code (Terraform, CloudFormation)
- ✅ Deployment scripts
- ✅ Environment configuration
- ✅ Monitoring & alerting setup
- ✅ Backup & disaster recovery plan
- ✅ Security compliance checklist

---

## 🏗️ Infrastructure Setup

### 1. GitHub Actions CI/CD Pipeline

**Purpose:** Automate testing, building, and deployment

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:integration
      - uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          npm ci
          npm run deploy:prod
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

---

### 2. Docker Configuration

**Purpose:** Containerize application for consistent deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Build (if needed)
RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD node healthcheck.js

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://user:pass@postgres:5432/db
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: app_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

### 3. Terraform Infrastructure

**Purpose:** Infrastructure as Code for reproducible deployments

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "app-cluster"
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "app-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = "app-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 3000
  }

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
}

# RDS Database
resource "aws_rds_cluster" "main" {
  cluster_identifier      = "app-db"
  engine                  = "aurora-postgresql"
  engine_version          = "15.2"
  database_name           = "appdb"
  master_username         = "admin"
  master_password         = random_password.db_password.result
  backup_retention_period = 7
  skip_final_snapshot     = false
  final_snapshot_identifier = "app-db-final-snapshot"
}
```

---

## 🔄 Deployment Strategies

### 1. Blue-Green Deployment

**Purpose:** Zero-downtime deployments

```bash
#!/bin/bash
# deploy-blue-green.sh

# 1. Deploy new version (Green)
echo "Deploying green environment..."
docker build -t app:green .
docker run -d --name app-green \
  -p 3001:3000 \
  -e NODE_ENV=production \
  app:green

# 2. Run health checks
echo "Running health checks..."
for i in {1..30}; do
  if curl -f http://localhost:3001/health; then
    echo "✓ Green environment healthy"
    break
  fi
  sleep 2
done

# 3. Run smoke tests
echo "Running smoke tests..."
npm run test:smoke:green

# 4. Switch traffic (Blue → Green)
echo "Switching traffic..."
docker stop app-blue
docker rename app-green app-blue

echo "✓ Deployment complete"
```

---

### 2. Canary Deployment

**Purpose:** Gradual rollout to detect issues

```yaml
# canary-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-canary
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # New pods added
      maxUnavailable: 0  # No pods removed during rollout
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
        version: v1.0.0
    spec:
      containers:
      - name: app
        image: app:v1.0.0
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
```

---

## 📊 Monitoring & Alerting

### 1. Health Checks

**Purpose:** Detect unhealthy instances

```javascript
// healthcheck.js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    // Basic health check
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  } else if (req.url === '/ready') {
    // Readiness check (dependencies available)
    checkDatabase()
      .then(() => {
        res.writeHead(200);
        res.end(JSON.stringify({ ready: true }));
      })
      .catch((err) => {
        res.writeHead(503);
        res.end(JSON.stringify({ ready: false, error: err.message }));
      });
  }
});

server.listen(3000);
```

### 2. Prometheus Monitoring

**Purpose:** Collect and visualize metrics

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:5432']
```

### 3. Alert Rules

**Purpose:** Trigger notifications for issues

```yaml
# alerts.yml
groups:
  - name: app_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(app_errors_total[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}"

      - alert: HighLatency
        expr: histogram_quantile(0.95, app_request_duration_seconds) > 1
        for: 5m
        annotations:
          summary: "High latency detected"

      - alert: LowDiskSpace
        expr: node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes < 0.1
        for: 10m
        annotations:
          summary: "Disk space low"
```

---

## 🔐 Security Checklist

Before production deployment:

- ✅ All secrets in environment variables (not in code)
- ✅ HTTPS enabled with valid SSL certificate
- ✅ API rate limiting configured
- ✅ CORS properly configured
- ✅ Database backups automated
- ✅ WAF (Web Application Firewall) enabled
- ✅ Security headers set (CSP, X-Frame-Options, etc.)
- ✅ Dependencies scanned for vulnerabilities
- ✅ Application scanning for OWASP Top 10
- ✅ Least privilege IAM policies
- ✅ VPC security groups configured
- ✅ Audit logging enabled

---

## 📋 Deployment Checklist

Before each deployment:

- ✅ All tests passing (unit/integration/E2E)
- ✅ Code review approved
- ✅ Deployment plan documented
- ✅ Rollback plan documented
- ✅ Database migrations tested
- ✅ Environment variables confirmed
- ✅ Secrets updated
- ✅ Monitoring alerts active
- ✅ On-call engineer ready
- ✅ Stakeholders notified

---

## 🚀 Deployment Process

```
1. PREPARE
   ├── Review code changes
   ├── Run full test suite
   ├── Build Docker image
   └── Tag release version

2. STAGE
   ├── Deploy to staging environment
   ├── Run smoke tests
   ├── Performance test
   └── Security scan

3. DEPLOY
   ├── Blue-green deployment
   ├── Run health checks
   ├── Monitor metrics
   └── Gradual traffic migration

4. VERIFY
   ├── Check error rates (< 0.1%)
   ├── Check latency (< 500ms p95)
   ├── Check memory/CPU
   └── Verify all features working

5. MONITOR
   ├── Watch error logs
   ├── Watch performance metrics
   ├── Watch user metrics
   └── Alert on anomalies

6. ROLLBACK (if needed)
   ├── Switch traffic back
   ├── Verify stability
   ├── Investigate root cause
   └── Plan fix
```

---

## 📝 Environment Configuration

### Development
```bash
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
DATABASE_URL=postgres://user:pass@localhost:5432/dev_db
REDIS_URL=redis://localhost:6379
API_TIMEOUT=30000
```

### Staging
```bash
NODE_ENV=staging
DEBUG=false
LOG_LEVEL=info
DATABASE_URL=postgres://user:pass@staging-db:5432/staging_db
REDIS_URL=redis://staging-redis:6379
API_TIMEOUT=20000
```

### Production
```bash
NODE_ENV=production
DEBUG=false
LOG_LEVEL=warn
DATABASE_URL=postgres://user:pass@prod-db:5432/prod_db
REDIS_URL=redis://prod-redis:6379
API_TIMEOUT=15000
```

---

## 🔄 Backup & Disaster Recovery

### Database Backups
```bash
# Daily backups to S3
0 2 * * * /scripts/backup-db.sh

# Weekly full backups
0 3 * * 0 /scripts/backup-db-full.sh

# Monthly offsite backups
0 4 1 * * /scripts/backup-db-offsite.sh
```

### Backup Verification
```bash
#!/bin/bash
# verify-backup.sh

# Test restore from latest backup
BACKUP_DATE=$(date -d "1 day ago" +%Y-%m-%d)
BACKUP_FILE="db-backup-${BACKUP_DATE}.sql"

# Create test database
createdb test_restore

# Restore from backup
psql test_restore < s3://backups/$BACKUP_FILE

# Run integrity checks
psql test_restore -c "PRAGMA integrity_check;"

# Drop test database
dropdb test_restore

echo "✓ Backup verified"
```

---

## 📊 Post-Deployment Metrics

Track after each deployment:

| Metric | Target | Critical if |
|--------|--------|-----------|
| Error Rate | < 0.1% | > 1% |
| Latency (p95) | < 500ms | > 1s |
| Availability | > 99.9% | < 99% |
| Memory Usage | < 80% | > 90% |
| CPU Usage | < 70% | > 90% |
| Database Connections | < 80% | > 95% |

---

## ✅ Handoff Completion

When DevOps setup is complete:

```
✓ CI/CD pipeline configured and tested
✓ Docker images built and pushed
✓ Infrastructure as Code ready
✓ Monitoring and alerting active
✓ Backup and disaster recovery tested
✓ Security checklist passed
✓ Deployment documentation complete
→ FEATURE READY FOR PRODUCTION
```

---

**Remember:** DevOps ensures your code runs reliably in production. Invest in automation, monitoring, and disaster recovery.

**Cost Aware:** DevOps Agent uses GPT-4-Turbo (more powerful model) because infrastructure decisions are critical and complex. Mistakes cost money and uptime.

**Production Ready:** Proper DevOps practices prevent 90% of production issues before they happen.
