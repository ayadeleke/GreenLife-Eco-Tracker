#!/bin/bash

# GreenLife Terraform Deployment Script
# Usage: ./deploy.sh [staging|production]

ENVIRONMENT=${1:-staging}
TFVARS_FILE="environments/${ENVIRONMENT}.tfvars"

echo "🚀 Deploying GreenLife infrastructure to ${ENVIRONMENT} environment..."

# Check if environment file exists
if [ ! -f "$TFVARS_FILE" ]; then
    echo "❌ Error: Environment file $TFVARS_FILE not found!"
    echo "Available environments:"
    ls -1 environments/*.tfvars 2>/dev/null || echo "No environment files found in environments/ directory"
    exit 1
fi

# Initialize Terraform
echo "📦 Initializing Terraform..."
terraform init

# Validate configuration
echo "✅ Validating Terraform configuration..."
terraform validate

# Plan deployment
echo "📋 Creating deployment plan for ${ENVIRONMENT}..."
terraform plan -var-file="$TFVARS_FILE" -out="${ENVIRONMENT}.tfplan"

# Ask for confirmation
echo "Do you want to apply this plan? (yes/no)"
read -r CONFIRM

if [ "$CONFIRM" = "yes" ]; then
    echo "🔨 Applying Terraform configuration..."
    terraform apply "${ENVIRONMENT}.tfplan"
    echo "✅ Deployment completed!"
else
    echo "❌ Deployment cancelled"
    exit 1
fi
