output "registry_name" {
  description = "Name of the container registry"
  value       = azurerm_container_registry.main.name
}

output "login_server" {
  description = "Login server for the container registry"
  value       = azurerm_container_registry.main.login_server
}

output "admin_username" {
  description = "Admin username for the container registry"
  value       = azurerm_container_registry.main.admin_username
}

output "admin_password" {
  description = "Admin password for the container registry"
  value       = azurerm_container_registry.main.admin_password
  sensitive   = true
}
