# GreenLife ├── modules/                 # Terraform modules
    ├── resource_groups/     # Resource group module
    ├── storage/            # Storage account module
    ├── cache/              # Redis cache module
    ├── container_registry/ # Azure Container Registry module
    ├── container_apps/     # Container Apps module
    ├── security/           # Key Vault module
    └── networking/         # Virtual network module Infrastructure

This directory contains the modular Terraform configuration for the GreenLife Eco Tracker application infrastructure on Azure.

## 📁 Structure

```
terraform/
├── main_modular.tf           # Main configuration using modules
├── variables.tf              # Variable definitions
├── outputs.tf               # Output definitions
├── terraform.tfvars.example # Example variables file
└── modules/                 # Terraform modules
    ├── resource_groups/     # Resource group module
    ├── storage/            # Storage account module
    ├── cache/              # Redis cache module
    ├── container_registry/ # Azure Container Registry module
    ├── container_apps/     # Container Apps module
    ├── security/           # Key Vault module
    └── networking/         # Virtual network module
```

## 🚀 Quick Start

1. **Copy variables file:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit terraform.tfvars:**
   - Update `mysql_admin_password` with a secure password
   - Adjust other values as needed

3. **Initialize Terraform:**
   ```bash
   terraform init
   ```

4. **Plan deployment:**
   ```bash
   terraform plan
   ```

5. **Apply configuration:**
   ```bash
   terraform apply
   ```

## 🏗️ Modules Overview

### Resource Groups Module
- Creates backend and frontend resource groups
- Configurable locations for each resource group

### Storage Module
- Azure Storage Account for media and static files
- Blob containers for organized storage
- Security configurations applied

### External Database (Aiven Cloud)
- **No Azure Database Module**: Uses external Aiven Cloud managed MySQL
- Database connection configured via environment variables
- High availability and managed backups provided by Aiven

### Cache Module
- Azure Cache for Redis
- Optimized for session storage and caching
- SSL-only access enabled

### Container Registry Module
- Azure Container Registry for Docker images
- Admin access enabled for CI/CD pipelines
- Basic SKU for cost optimization

### Container Apps Module
- Container Apps Environment with Log Analytics
- Backend and frontend container apps
- Auto-scaling and ingress configurations

### Security Module
- Azure Key Vault for secret management
- Access policies for secure secret access
- Integration ready for container apps

### Networking Module
- Virtual Network with container subnet
- Foundation for network security
- Ready for private endpoint integration

## 🔧 Configuration

### Required Variables
- `db_password`: Password for external Aiven database
- `django_secret_key`: Django secret key

### Optional Variables
- `environment`: Environment name (default: "dev")
- `backend_location`: Azure region for backend (default: "South Central US")
- `frontend_location`: Azure region for frontend (default: "Germany West Central")

## 📊 Outputs

After successful deployment, you'll get:
- Application URLs (backend and frontend)
- Redis cache connection details
- Container registry information
- Storage account details
- Key Vault information

**Note**: Database connection details are configured via environment variables for external Aiven Cloud database.

## 🔒 Security Features

- **Key Vault**: Secure secret storage
- **Network Security**: Virtual network isolation
- **Storage Security**: Private blob access
- **Database Security**: SSL-only connections
- **Cache Security**: Redis with TLS encryption

## 💰 Cost Optimization

- Basic SKU for non-production resources
- Minimal instance sizes for development
- Auto-scaling enabled for production readiness

## 🚀 Deployment Pipeline Integration

This configuration is designed to work with:
- Azure Container Registry for image storage
- GitHub Actions for CI/CD
- Azure Container Apps for scalable hosting

## 📋 Prerequisites

- Azure CLI installed and authenticated
- Terraform >= 1.3.7
- Appropriate Azure permissions for resource creation

## 🔄 Migration from Monolithic Configuration

To migrate from the existing `main.tf`:

1. Backup your current state:
   ```bash
   terraform state pull > terraform.tfstate.backup
   ```

2. Rename current main.tf:
   ```bash
   mv main.tf main_old.tf
   ```

3. Rename modular configuration:
   ```bash
   mv main_modular.tf main.tf
   ```

4. Initialize and plan:
   ```bash
   terraform init
   terraform plan
   ```

## 🏷️ Resource Naming

Resources follow the naming convention:
- `greenlife-{service}-{unique-suffix}`
- Consistent tagging with Environment, Project, and ManagedBy tags

## 📞 Support

For issues or questions:
1. Check the module documentation in each module directory
2. Review Terraform plan output for configuration issues
3. Ensure all required variables are set in terraform.tfvars
