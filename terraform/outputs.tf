# Main Terraform Outputs

# Resource Group Outputs
output "backend_resource_group_name" {
  description = "Name of the backend resource group"
  value       = module.resource_groups.backend_rg_name
}

output "frontend_resource_group_name" {
  description = "Name of the frontend resource group"
  value       = module.resource_groups.frontend_rg_name
}

# Cache Outputs
output "redis_hostname" {
  description = "Redis cache hostname"
  value       = module.cache.cache_hostname
}

# Container Registry Outputs
output "container_registry_login_server" {
  description = "Container registry login server"
  value       = module.container_registry.login_server
}

output "container_registry_admin_username" {
  description = "Container registry admin username"
  value       = module.container_registry.admin_username
}

# Container Apps Outputs
output "backend_app_url" {
  description = "URL of the backend application"
  value       = "https://${module.container_apps.backend_app_fqdn}"
}

output "frontend_app_url" {
  description = "URL of the frontend application"
  value       = "https://${module.container_apps.frontend_app_fqdn}"
}

# Storage Outputs
output "storage_account_name" {
  description = "Name of the storage account"
  value       = module.storage.storage_account_name
}

# Security Outputs
output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = module.security.key_vault_name
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = module.security.key_vault_uri
}

# Networking Outputs
output "virtual_network_name" {
  description = "Name of the virtual network"
  value       = module.networking.vnet_name
}
