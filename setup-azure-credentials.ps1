#!/usr/bin/env pwsh
# Azure Credentials Setup Script for GitHub Actions
# This script creates the necessary Azure credentials for your GitHub Actions workflows

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubOrg = "ayadeleke",
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubRepo = "GreenLife-Eco-Tracker",
    
    [Parameter(Mandatory=$false)]
    [string]$SubscriptionId,
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupStaging = "Greenlifebackend_group-a7e3",
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupFrontendStaging = "Greenlifefrontend_group",
    
    [Parameter(Mandatory=$false)]
    [string]$ACRNameStaging = "greenlifestagingacr91ha"
)

Write-Host "🚀 Setting up Azure credentials for GitHub Actions..." -ForegroundColor Green

# Get current subscription if not provided
if (-not $SubscriptionId) {
    $SubscriptionId = az account show --query id --output tsv
    Write-Host "Using current subscription: $SubscriptionId" -ForegroundColor Cyan
}

# Set subscription context
az account set --subscription $SubscriptionId

# Get tenant ID
$TenantId = az account show --query tenantId --output tsv
Write-Host "Tenant ID: $TenantId" -ForegroundColor Cyan

# =======================
# OIDC Setup (Recommended)
# =======================

Write-Host "`n📋 Creating Azure AD App Registration for OIDC..." -ForegroundColor Yellow

# Create app registration
$AppName = "github-actions-$GitHubRepo"
$AppRegistration = az ad app create --display-name $AppName --query '{appId:appId,objectId:id}' --output json | ConvertFrom-Json

$ClientId = $AppRegistration.appId
$ObjectId = $AppRegistration.objectId

Write-Host "App Registration created:" -ForegroundColor Green
Write-Host "  Client ID: $ClientId" -ForegroundColor Cyan
Write-Host "  Object ID: $ObjectId" -ForegroundColor Cyan

# Create service principal
az ad sp create --id $ClientId

Write-Host "`n🔐 Setting up Federated Identity Credentials..." -ForegroundColor Yellow

# Create federated credentials for main branch (production)
$FederatedCredentialMain = @{
    name = "github-actions-main"
    issuer = "https://token.actions.githubusercontent.com"
    subject = "repo:$GitHubOrg/${GitHubRepo}:ref:refs/heads/main"
    audiences = @("api://AzureADTokenExchange")
} | ConvertTo-Json

$FederatedCredentialMain | Out-File -FilePath "federated-credential-main.json" -Encoding UTF8

az ad app federated-credential create --id $ClientId --parameters federated-credential-main.json

# Create federated credentials for develop branch (staging)  
$FederatedCredentialDevelop = @{
    name = "github-actions-develop"
    issuer = "https://token.actions.githubusercontent.com"
    subject = "repo:$GitHubOrg/${GitHubRepo}:ref:refs/heads/develop"
    audiences = @("api://AzureADTokenExchange")
} | ConvertTo-Json

$FederatedCredentialDevelop | Out-File -FilePath "federated-credential-develop.json" -Encoding UTF8

az ad app federated-credential create --id $ClientId --parameters federated-credential-develop.json

# Clean up temp files
Remove-Item "federated-credential-main.json", "federated-credential-develop.json"

Write-Host "`n🎯 Assigning Azure Roles..." -ForegroundColor Yellow

# Assign Contributor role to subscription (for Terraform)
az role assignment create --assignee $ClientId --role "Contributor" --scope "/subscriptions/$SubscriptionId"

# Assign additional roles for Container Apps
az role assignment create --assignee $ClientId --role "Azure Container Registry Contributor" --scope "/subscriptions/$SubscriptionId"
az role assignment create --assignee $ClientId --role "Container Apps Contributor" --scope "/subscriptions/$SubscriptionId"

Write-Host "`n📦 Getting Azure Container Registry Information..." -ForegroundColor Yellow

# Get ACR credentials
$ACRLoginServer = az acr show --name $ACRNameStaging --resource-group $ResourceGroupStaging --query loginServer --output tsv
$ACRUsername = az acr credential show --name $ACRNameStaging --query username --output tsv
$ACRPassword = az acr credential show --name $ACRNameStaging --query passwords[0].value --output tsv

Write-Host "`n✅ Setup Complete! Add these secrets to your GitHub repository:" -ForegroundColor Green
Write-Host "Go to: https://github.com/$GitHubOrg/$GitHubRepo/settings/secrets/actions" -ForegroundColor Cyan

Write-Host "`n🔑 Required GitHub Secrets:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Azure Authentication (OIDC)
Write-Host "`n🌐 Azure Authentication (OIDC - Recommended):" -ForegroundColor Magenta
Write-Host "AZURE_CLIENT_ID: $ClientId"
Write-Host "AZURE_TENANT_ID: $TenantId"
Write-Host "AZURE_SUBSCRIPTION_ID: $SubscriptionId"

# Terraform Cloud
Write-Host "`n🏗️ Terraform Cloud:" -ForegroundColor Magenta
Write-Host "TERRAFORM_CLOUD_TOKEN: <Get from https://app.terraform.io/app/settings/tokens>"

# Application Secrets
Write-Host "`n🔐 Application Secrets:" -ForegroundColor Magenta
Write-Host "DJANGO_SECRET_KEY: <Generate a secure Django secret key>"
Write-Host "DB_PASSWORD: <Your database password>"

# Azure Container Registry (Staging)
Write-Host "`n📦 Azure Container Registry - Staging:" -ForegroundColor Magenta
Write-Host "ACR_LOGIN_SERVER_STAGING: $ACRLoginServer"
Write-Host "ACR_USERNAME_STAGING: $ACRUsername"
Write-Host "ACR_PASSWORD_STAGING: $ACRPassword"

# Resource Groups
Write-Host "`n📁 Resource Groups:" -ForegroundColor Magenta
Write-Host "AZURE_RESOURCE_GROUP_STAGING: $ResourceGroupStaging"
Write-Host "AZURE_RESOURCE_GROUP_FRONTEND_STAGING: $ResourceGroupFrontendStaging"

# For the AutoDeploy workflow
Write-Host "`n🚀 Auto Deploy Workflow Secrets:" -ForegroundColor Magenta
Write-Host "GREENLIFETRACKER_AZURE_CLIENT_ID: $ClientId"
Write-Host "GREENLIFETRACKER_AZURE_TENANT_ID: $TenantId" 
Write-Host "GREENLIFETRACKER_AZURE_SUBSCRIPTION_ID: $SubscriptionId"
Write-Host "GREENLIFETRACKER_REGISTRY_USERNAME: $ACRUsername"
Write-Host "GREENLIFETRACKER_REGISTRY_PASSWORD: $ACRPassword"

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Write-Host "`n📝 Next Steps:" -ForegroundColor Green
Write-Host "1. Copy the secrets above to your GitHub repository settings"
Write-Host "2. Get your Terraform Cloud token from: https://app.terraform.io/app/settings/tokens"
Write-Host "3. Generate a Django secret key using: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'"
Write-Host "4. Set up production environment credentials if needed"
Write-Host "5. Test your workflows by pushing to develop branch"

Write-Host "`n🔒 Security Notes:" -ForegroundColor Red
Write-Host "• The OIDC method is more secure than using client secrets"
Write-Host "• Rotate ACR passwords regularly"
Write-Host "• Use least privilege principle for role assignments"
Write-Host "• Monitor service principal usage in Azure AD logs"

Write-Host "`n🎉 Azure credentials setup completed successfully!" -ForegroundColor Green
