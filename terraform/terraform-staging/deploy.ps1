# GreenLife Terraform Deployment Script (PowerShell)
# Usage: .\deploy.ps1 [staging|production]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("staging", "production")]
    [string]$Environment = "staging"
)

$TfvarsFile = "environments\$Environment.tfvars"

Write-Host "🚀 Deploying GreenLife infrastructure to $Environment environment..." -ForegroundColor Green

# Check if environment file exists
if (!(Test-Path $TfvarsFile)) {
    Write-Host "❌ Error: Environment file $TfvarsFile not found!" -ForegroundColor Red
    Write-Host "Available environments:" -ForegroundColor Yellow
    Get-ChildItem environments\*.tfvars -ErrorAction SilentlyContinue | ForEach-Object { $_.Name }
    exit 1
}

# Initialize Terraform
Write-Host "📦 Initializing Terraform..." -ForegroundColor Blue
terraform init

# Validate configuration
Write-Host "✅ Validating Terraform configuration..." -ForegroundColor Blue
terraform validate

# Plan deployment
Write-Host "📋 Creating deployment plan for $Environment..." -ForegroundColor Blue
terraform plan -var-file="$TfvarsFile" -out="$Environment.tfplan"

# Ask for confirmation
$Confirm = Read-Host "Do you want to apply this plan? (yes/no)"

if ($Confirm -eq "yes") {
    Write-Host "🔨 Applying Terraform configuration..." -ForegroundColor Green
    terraform apply "$Environment.tfplan"
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 1
}
