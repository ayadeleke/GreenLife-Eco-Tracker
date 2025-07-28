# GreenLife Terraform Configuration

This directory contains the Terraform configuration for deploying the GreenLife application to Azure.

## Security Notice

⚠️ **IMPORTANT**: This configuration uses variables to keep sensitive information secure. Never commit sensitive values to version control.

## Setup Instructions

### 1. Prerequisites

- Terraform installed (version >= 1.3.7)
- Azure CLI installed and authenticated
- Access to your Azure subscription

### 2. Configure Variables

1. Copy the example variables file:
   ```powershell
   Copy-Item terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` and update with your actual values:
   - Database credentials (from Aiven Cloud)
   - Django secret key
   - Container registry credentials
   - API URLs

### 3. Deploy Infrastructure

1. Initialize Terraform:
   ```powershell
   terraform init
   ```

2. Validate the configuration:
   ```powershell
   terraform validate
   ```

3. Plan the deployment:
   ```powershell
   terraform plan
   ```

4. Apply the configuration:
   ```powershell
   terraform apply
   ```

## File Structure

- `main.tf` - Main Terraform configuration
- `variables.tf` - Variable definitions
- `outputs.tf` - Output definitions
- `terraform.tfvars.example` - Example variables file
- `terraform.tfvars` - Your actual variables (not committed to git)
- `.gitignore` - Git ignore file to prevent committing sensitive files

## Security Best Practices

1. **Never commit `terraform.tfvars`** - This file contains sensitive information
2. **Use environment variables** for CI/CD pipelines
3. **Rotate secrets regularly**
4. **Use Azure Key Vault** for production environments
5. **Review access permissions** regularly

## Resources Created

This configuration creates:
- Resource groups for backend and frontend
- Storage account for application data
- Container registry for Docker images
- App Service plan and web apps
- All necessary configurations for the GreenLife application

## Troubleshooting

If you encounter issues:

1. Ensure you're authenticated with Azure CLI:
   ```powershell
   az login
   ```

2. Check your subscription:
   ```powershell
   az account show
   ```

3. Verify variable values in `terraform.tfvars`

4. Check Terraform state:
   ```powershell
   terraform state list
   ```

## Support

For issues related to this Terraform configuration, please check the main project documentation or create an issue in the repository.
