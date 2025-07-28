variable "log_analytics_name" {
  description = "Name of the Log Analytics workspace"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group for backend"
  type        = string
}

variable "frontend_resource_group_name" {
  description = "Name of the resource group for frontend"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
}

variable "log_analytics_sku" {
  description = "SKU for Log Analytics workspace"
  type        = string
  default     = "PerGB2018"
}

variable "retention_in_days" {
  description = "Retention period for logs in days"
  type        = number
  default     = 30
}

variable "environment_name" {
  description = "Name of the Container Apps environment"
  type        = string
}

variable "backend_app_name" {
  description = "Name of the backend container app"
  type        = string
}

variable "backend_image" {
  description = "Docker image for backend app"
  type        = string
}

variable "backend_cpu" {
  description = "CPU allocation for backend app"
  type        = number
  default     = 0.25
}

variable "backend_memory" {
  description = "Memory allocation for backend app"
  type        = string
  default     = "0.5Gi"
}

variable "backend_env_vars" {
  description = "Environment variables for backend app"
  type        = map(string)
  default     = {}
}

variable "backend_external_enabled" {
  description = "Enable external access for backend app"
  type        = bool
  default     = true
}

variable "backend_target_port" {
  description = "Target port for backend app"
  type        = number
  default     = 8000
}

variable "frontend_app_name" {
  description = "Name of the frontend container app"
  type        = string
}

variable "frontend_image" {
  description = "Docker image for frontend app"
  type        = string
}

variable "frontend_cpu" {
  description = "CPU allocation for frontend app"
  type        = number
  default     = 0.25
}

variable "frontend_memory" {
  description = "Memory allocation for frontend app"
  type        = string
  default     = "0.5Gi"
}

variable "frontend_env_vars" {
  description = "Environment variables for frontend app"
  type        = map(string)
  default     = {}
}

variable "frontend_external_enabled" {
  description = "Enable external access for frontend app"
  type        = bool
  default     = true
}

variable "frontend_target_port" {
  description = "Target port for frontend app"
  type        = number
  default     = 80
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# Container Registry Variables
variable "registry_server" {
  description = "Container registry server URL"
  type        = string
}

variable "registry_username" {
  description = "Container registry username"
  type        = string
}

variable "registry_password" {
  description = "Container registry password"
  type        = string
  sensitive   = true
}
