variable "cache_name" {
  description = "Name of the Redis cache"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
}

variable "capacity" {
  description = "Cache capacity"
  type        = number
  default     = 0
}

variable "family" {
  description = "Cache family"
  type        = string
  default     = "C"
}

variable "sku_name" {
  description = "SKU name for Redis cache"
  type        = string
  default     = "Basic"
}

variable "maxmemory_policy" {
  description = "Maximum memory policy"
  type        = string
  default     = "allkeys-lru"
}

variable "enable_non_ssl_port" {
  description = "Enable non-SSL port"
  type        = bool
  default     = false
}

variable "minimum_tls_version" {
  description = "Minimum TLS version"
  type        = string
  default     = "1.2"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
