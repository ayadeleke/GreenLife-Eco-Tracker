# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] 28-07-2025

### Added
- Complete CI/CD pipeline with staging and production environments
- Automated security scanning (Bandit, Safety, Trivy, tfsec)
- Infrastructure as Code with Terraform
- Docker containerization for backend and frontend
- Azure Container Apps deployment
- UptimeRobot monitoring with real-time incident alerts
- Multi-environment monitoring for staging and production
- Public status page for uptime transparency

### Security
- Dependency vulnerability scanning with Safety and pip-audit
- Container image scanning with Trivy
- Static code analysis with Bandit
- Infrastructure security scanning with tfsec
- Manual approval required for production deployments

### Monitoring
- Real-time uptime monitoring with UptimeRobot
- Instant downtime and incident notifications
- Response time and availability tracking
- SSL certificate expiration monitoring
- Multi-location monitoring checks
- **Load Testing**: Comprehensive performance testing with Locust achieving 100% success rate and 144ms average response time

## [2.0.0] - 22-07-2025 - Phase 2: IaC, Containerization & Manual Deployment

### Added
- **Effective Containerization**: Multi-stage Dockerfiles for backend and frontend with optimized caching
- **Docker Compose Orchestration**: Complete local development environment with services orchestration
- **Infrastructure as Code**: Comprehensive Terraform modules for Azure resource provisioning
- **Manual Cloud Deployment**: Successfully deployed application to Azure Container Apps
- **Container Registry Integration**: Automated image building and pushing to Azure Container Registry
- **Database Integration**: MySQL database provisioned and connected via Terraform
- **Networking Configuration**: Virtual networks, subnets, and security groups defined in code
- **Environment Management**: Separate staging and production infrastructure configurations

### Infrastructure
- **Azure Container Registry**: Centralized container image storage
- **Resource Groups**: Logical resource organization by environment
- **Application Gateway**: Load balancing and SSL termination

### Containerization
- **Multi-stage Docker builds**: Optimized image sizes and build caching
- **Development environment**: docker-compose.yml for local development
- **Production-ready images**: Separate configurations for staging and production
- **Health checks**: Container health monitoring and automatic restarts
- **Nginx configuration**: Optimized frontend serving with compression

### Deployment
- **Manual deployment process**: Step-by-step cloud deployment verification
- **Live application URLs**: Publicly accessible staging and production environments
- **Database migrations**: Automated schema deployment
- **Environment variables**: Secure configuration management
- **SSL certificates**: HTTPS encryption for all environments

### Documentation
- **Updated README**: Docker-based setup instructions
- **Phase reflection**: Challenges and lessons learned documentation
- **Infrastructure diagrams**: Visual representation of cloud architecture
- **Deployment guides**: Step-by-step manual deployment instructions

## [1.0.0] - 30-06-2025

### Added
- Initial release of GreenLife Eco Tracker
- Django backend with REST API
- React frontend application
- MySQL database integration
- Azure infrastructure deployment
- Automated testing suite
