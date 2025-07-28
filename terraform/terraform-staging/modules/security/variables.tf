variable "key_vault_name" {
  description = "Name of the Key Vault"
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

variable "sku_name" {
  description = "SKU name for Key Vault"
  type        = string
  default     = "standard"
}

variable "secret_permissions" {
  description = "Secret permissions for Key Vault"
  type        = list(string)
  default     = ["Get", "List", "Set", "Delete", "Recover", "Backup", "Restore"]
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
