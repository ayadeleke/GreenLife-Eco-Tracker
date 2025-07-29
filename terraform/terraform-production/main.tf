terraform {
  required_version = ">= 1.3.7"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
  cloud {
    organization = "DevOps_GreenLife"
    workspaces {
      name = "greenlife_prod"
    }
  }
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

# Random string for unique resource names
resource "random_string" "unique" {
  length  = 4
  special = false
  upper   = false
}

# Local values for common configurations
locals {
  common_tags = {
    Environment = var.environment
    Project     = "GreenLife"
    ManagedBy   = "Terraform"
  }

  unique_suffix      = random_string.unique.result
  environment_suffix = var.environment == "production" ? "prod" : var.environment
}

# Resource Groups Module
module "resource_groups" {
  source = "./modules/resource_groups"

  backend_rg_name   = var.backend_resource_group_name
  frontend_rg_name  = "Greenlifefrontend_group-prod2"
  backend_location  = var.backend_location
  frontend_location = var.frontend_location
  tags              = local.common_tags
}

# Networking Module
module "networking" {
  source = "./modules/networking"

  vnet_name           = "greenlife-vnet"
  resource_group_name = module.resource_groups.backend_rg_name
  location            = module.resource_groups.backend_rg_location
  tags                = local.common_tags
}

# Storage Module
module "storage" {
  source = "./modules/storage"

  storage_account_name = var.storage_account_name
  resource_group_name  = module.resource_groups.backend_rg_name
  location             = module.resource_groups.backend_rg_location
  tags                 = local.common_tags
}

# Cache Module
module "cache" {
  source              = "./modules/cache"
  cache_name          = "greenlife-redis-${local.environment_suffix}-${local.unique_suffix}"
  resource_group_name = module.resource_groups.backend_rg_name
  location            = module.resource_groups.backend_rg_location
  tags                = local.common_tags
}

# Container Registry Module
module "container_registry" {
  source = "./modules/container_registry"

  registry_name       = "greenlife${local.environment_suffix}acr${local.unique_suffix}"
  resource_group_name = module.resource_groups.backend_rg_name
  location            = module.resource_groups.backend_rg_location
  tags                = local.common_tags
}

# Security Module
module "security" {
  source = "./modules/security"

  key_vault_name      = "greenlife-kv-${local.unique_suffix}"
  resource_group_name = module.resource_groups.backend_rg_name
  location            = module.resource_groups.backend_rg_location
  tags                = local.common_tags
}

# Container Apps Module
module "container_apps" {
  source = "./modules/container_apps"

  log_analytics_name           = "greenlife-logs-${local.unique_suffix}"
  resource_group_name          = module.resource_groups.backend_rg_name
  frontend_resource_group_name = "Greenlifefrontend_group-prod2"
  location                     = module.resource_groups.backend_rg_location
  environment_name             = "greenlife-container-env-${local.unique_suffix}"

  # Backend App Configuration
  backend_app_name = "greenlife-api-prod"
  backend_image    = "${module.container_registry.login_server}/greenlife-backend:latest"
  backend_env_vars = {
    DB_HOST           = var.db_host
    DB_NAME           = var.db_name
    DB_USER           = var.db_user
    DB_PASSWORD       = var.db_password
    DB_PORT           = var.db_port
    DJANGO_SECRET_KEY = var.django_secret_key
    DEBUG             = var.debug
    ALLOWED_HOSTS     = var.allowed_hosts
    REDIS_URL         = module.cache.cache_connection_string
  }

  # Frontend App Configuration
  frontend_app_name = "greenlife-tracker-prod"
  frontend_image    = "${module.container_registry.login_server}/greenlife-frontend:latest"
  frontend_env_vars = {
    VITE_API_URL = "https://greenlife-api-prod.greenplant-30488afa.southcentralus.azurecontainerapps.io/api"
  }

  # Container Registry Configuration
  registry_server   = module.container_registry.login_server
  registry_username = module.container_registry.admin_username
  registry_password = module.container_registry.admin_password

  tags = local.common_tags

  depends_on = [
    module.cache,
    module.container_registry
  ]
}

# Azure Load Testing for Production
resource "azurerm_load_test" "greenlife_load_test_production" {
  name                = "greenlife-load-test-prod-${local.unique_suffix}"
  resource_group_name = module.resource_groups.backend_rg_name
  location            = module.resource_groups.backend_rg_location
  description         = "Production load testing resource for GreenLife Eco Tracker"

  tags = merge(local.common_tags, {
    Purpose = "LoadTesting"
  })
}
