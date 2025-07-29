# Local Terraform Execution Guide

## Prerequisites
1. Install Terraform CLI
2. Install Azure CLI and login: `az login`
3. Set environment variables for secrets

## For Staging Environment:
```powershell
# Navigate to staging directory
cd terraform/terraform-staging

# Set required environment variables
$env:TF_VAR_django_secret_key = "your-secret-key"
$env:TF_VAR_db_password = "your-db-password"

# Initialize Terraform (if not already done)
terraform init

# Plan changes
terraform plan

# Apply changes (with approval)
terraform apply
```

## For Production Environment:
```powershell
# Navigate to production directory
cd terraform/terraform-production

# Set required environment variables
$env:TF_VAR_django_secret_key = "your-secret-key"
$env:TF_VAR_db_password = "your-db-password"

# Initialize Terraform
terraform init

# Plan changes
terraform plan

# Apply changes (with approval)
terraform apply
```

## Important Notes:
- The log you shared shows a GitHub Actions execution
- Local execution would show different paths and user context
- Always run `terraform plan` before `terraform apply`
- Make sure you're in the correct environment directory
- Use environment-specific variable files (.tfvars)
