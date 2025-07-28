# Variables for GreenLife Terraform Configuration
# This file defines all the variables used in the main.tf file

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "staging"
}

# Resource Group Variables
variable "backend_resource_group_name" {
  description = "Name of the backend resource group"
  type        = string
  default     = "Greenlifebackend_group-a7e3"
}

variable "frontend_resource_group_name" {
  description = "Name of the frontend resource group"
  type        = string
  default     = "Greenlifefrontend_group"
}

variable "backend_location" {
  description = "Location for backend resources"
  type        = string
  default     = "South Central US"
}

variable "frontend_location" {
  description = "Location for frontend resources"
  type        = string
  default     = "Germany West Central"
}

# Storage Variables
variable "storage_account_name" {
  description = "Name of the storage account"
  type        = string
  default     = "greenlifestorage450"
}

# Container Registry Variables
variable "container_registry_name" {
  description = "Name of the container registry"
  type        = string
  default     = "GreenlifebackendRegistry"
}

variable "container_registry_location" {
  description = "Location for container registry"
  type        = string
  default     = "Germany West Central"
}

# App Service Variables
variable "service_plan_name" {
  description = "Name of the app service plan"
  type        = string
  default     = "ASP-Greenlifebackendgroupa7e3-af92"
}

variable "backend_app_name" {
  description = "Name of the backend web app"
  type        = string
  default     = "greenlifebackendapi"
}

variable "frontend_app_name" {
  description = "Name of the frontend web app"
  type        = string
  default     = "greengoal"
}

# Database Variables (External - Aiven Cloud)
variable "db_host" {
  description = "Database host"
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "Database port"
  type        = string
  default     = "16783"
}

variable "db_name" {
  description = "Database name"
  type        = string
  sensitive   = true
}

variable "db_user" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# Application Variables
variable "django_secret_key" {
  description = "Django secret key"
  type        = string
  sensitive   = true
}

variable "debug" {
  description = "Django debug mode"
  type        = string
  default     = "False"
}

variable "allowed_hosts" {
  description = "Django allowed hosts"
  type        = string
  default     = "localhost,127.0.0.1,0.0.0.0,greenlifebackendapi.azurewebsites.net,134.149.216.180,greengoal.azurewebsites.net"
}

# Container Registry Credentials
variable "registry_server_url" {
  description = "Container registry server URL"
  type        = string
  sensitive   = true
}

variable "registry_username" {
  description = "Container registry username"
  type        = string
  sensitive   = true
}

variable "registry_password" {
  description = "Container registry password"
  type        = string
  sensitive   = true
}

# Redis Configuration
variable "redis_url" {
  description = "Redis connection URL"
  type        = string
  sensitive   = true
  default     = "greenlife-redis-staging-91ha.redis.cache.windows.net"
}

# API URL for frontend
variable "api_url" {
  description = "Backend API URL for frontend"
  type        = string
  default     = "https://greenlifebackendapi.azurewebsites.net/api"
}

# Common tags
variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    "Environment" = "staging"
    "ManagedBy"   = "Terraform"
    "Project"     = "GreenLife"
  }
}
