# Global Variables
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
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
  description = "Azure region for backend resources"
  type        = string
  default     = "South Central US"
}

variable "frontend_location" {
  description = "Azure region for frontend resources"
  type        = string
  default     = "Germany West Central"
}

# Storage Variables
variable "storage_account_name" {
  description = "Name of the storage account"
  type        = string
  default     = "greenlifestorage450"
}

# Database Variables (External - Aiven Cloud)
variable "db_host" {
  description = "External database host (Aiven Cloud)"
  type        = string
  default     = "greenlife-db-greenlife-025.b.aivencloud.com"
}

variable "db_port" {
  description = "External database port"
  type        = string
  default     = "16783"
}

variable "db_name" {
  description = "External database name"
  type        = string
  default     = "freedb_greenlife_db"
}

variable "db_user" {
  description = "External database user"
  type        = string
  default     = "avnadmin"
}

variable "db_password" {
  description = "External database password"
  type        = string
  sensitive   = true
}

# Django Application Variables
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
  default     = "localhost,127.0.0.1"
}