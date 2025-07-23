output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.main.name
}

output "storage_account_primary_access_key" {
  description = "Primary access key for storage account"
  value       = azurerm_storage_account.main.primary_access_key
  sensitive   = true
}

output "storage_account_primary_connection_string" {
  description = "Primary connection string for storage account"
  value       = azurerm_storage_account.main.primary_connection_string
  sensitive   = true
}

output "media_container_name" {
  description = "Name of the media container"
  value       = azurerm_storage_container.media.name
}

output "static_container_name" {
  description = "Name of the static container"
  value       = azurerm_storage_container.static.name
}
