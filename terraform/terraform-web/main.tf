terraform {
  required_version = ">= 1.3.7"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80.0"
    }
  }
  cloud {
    organization = "DevOps_GreenLife"
    workspaces {
      name = "web_remote"
    }
  }
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

resource "azurerm_resource_group" "Greenlifebackend_group" {
  name     = var.backend_resource_group_name
  location = var.backend_location

  tags = var.common_tags
}

resource "azurerm_resource_group" "Greenlifefrontend_group" {
  name     = var.frontend_resource_group_name
  location = var.frontend_location

  tags = var.common_tags
}

resource "azurerm_storage_account" "Greenlifebackend_storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.Greenlifebackend_group.name
  location                 = azurerm_resource_group.Greenlifebackend_group.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = var.common_tags
}

resource "azurerm_container_registry" "Greenlifebackend_registry" {
  name                = var.container_registry_name
  resource_group_name = azurerm_resource_group.Greenlifebackend_group.name
  location            = var.container_registry_location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_service_plan" "Greenlifebackend_plan" {
  name                = var.service_plan_name
  resource_group_name = azurerm_resource_group.Greenlifebackend_group.name
  location            = var.container_registry_location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "Greenlifebackend_api" {
  name                    = var.backend_app_name
  resource_group_name     = azurerm_resource_group.Greenlifebackend_group.name
  location                = var.container_registry_location
  service_plan_id         = azurerm_service_plan.Greenlifebackend_plan.id
  client_affinity_enabled = true

  site_config {
    always_on                               = false
    container_registry_use_managed_identity = false
    ftps_state                              = "FtpsOnly"

    application_stack {
      docker_image_name = "greenlifebackendregistry.azurecr.io/greenlife-backend:latest"
    }

    cors {
      allowed_origins     = ["*"]
      support_credentials = false
    }
  }

  app_settings = {
    "ALLOWED_HOSTS"                   = var.allowed_hosts
    "DB_HOST"                         = var.db_host
    "DB_NAME"                         = var.db_name
    "DB_PASSWORD"                     = var.db_password
    "DB_PORT"                         = var.db_port
    "DB_USER"                         = var.db_user
    "DEBUG"                           = var.debug
    "DJANGO_SECRET_KEY"               = var.django_secret_key
    "DOCKER_CUSTOM_IMAGE_NAME"        = "greenlife-backend:latest"
    "DOCKER_ENABLE_CI"                = "true"
    "DOCKER_REGISTRY_SERVER_PASSWORD" = var.registry_password
    "DOCKER_REGISTRY_SERVER_URL"      = var.registry_server_url
    "DOCKER_REGISTRY_SERVER_USERNAME" = var.registry_username
    "REDIS_URL"                       = var.redis_url
    "SECRET_KEY"                      = var.django_secret_key
  }

  tags = merge(var.common_tags, {
    "hidden-related:/subscriptions/76e483cc-356a-490b-9a6a-9cea64ea5fbf/resourceGroups/${var.backend_resource_group_name}/providers/Microsoft.Web/serverfarms/${var.service_plan_name}" = "empty"
  })
}

resource "azurerm_linux_web_app" "Greenlifefrontend_app" {
  name                    = var.frontend_app_name
  resource_group_name     = azurerm_resource_group.Greenlifefrontend_group.name
  location                = var.container_registry_location
  service_plan_id         = azurerm_service_plan.Greenlifebackend_plan.id
  client_affinity_enabled = true

  site_config {
    always_on                               = false
    container_registry_use_managed_identity = false
    ftps_state                              = "FtpsOnly"

    application_stack {
      docker_image_name = "greenlifebackendregistry.azurecr.io/greenlife-frontend:latest"
    }
  }

  app_settings = {
    "DOCKER_CUSTOM_IMAGE_NAME"        = "greenlife-frontend:latest"
    "DOCKER_ENABLE_CI"                = "true"
    "DOCKER_REGISTRY_SERVER_PASSWORD" = var.registry_password
    "DOCKER_REGISTRY_SERVER_URL"      = var.registry_server_url
    "DOCKER_REGISTRY_SERVER_USERNAME" = var.registry_username
    "VITE_API_URL"                    = var.api_url
  }

  tags = {
    "hidden-related:/subscriptions/76e483cc-356a-490b-9a6a-9cea64ea5fbf/resourceGroups/${var.backend_resource_group_name}/providers/Microsoft.Web/serverfarms/${var.service_plan_name}" = "empty"
  }
}

# Azure Load Testing for Web Environment
resource "azurerm_load_test" "greenlife_load_test_web" {
  name                = "greenlife-load-test-web"
  resource_group_name = azurerm_resource_group.Greenlifefrontend_group.name
  location            = var.container_registry_location
  description         = "Web frontend load testing resource for GreenLife Eco Tracker"

  tags = merge(var.common_tags, {
    Purpose = "LoadTesting"
  })
}
