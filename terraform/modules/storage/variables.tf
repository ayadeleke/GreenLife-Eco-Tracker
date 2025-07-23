variable "storage_account_name" {
  description = "Name of the storage account"
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

variable "account_tier" {
  description = "Storage account tier"
  type        = string
  default     = "Standard"
}

variable "replication_type" {
  description = "Storage account replication type"
  type        = string
  default     = "LRS"
}

variable "media_container_access_type" {
  description = "Access type for media container"
  type        = string
  default     = "blob"
}

variable "static_container_access_type" {
  description = "Access type for static container"
  type        = string
  default     = "blob"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
