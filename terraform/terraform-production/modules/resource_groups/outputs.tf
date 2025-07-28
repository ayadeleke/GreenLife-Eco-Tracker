output "backend_rg_name" {
  description = "Name of the backend resource group"
  value       = azurerm_resource_group.backend.name
}

output "backend_rg_location" {
  description = "Location of the backend resource group"
  value       = azurerm_resource_group.backend.location
}

output "frontend_rg_name" {
  description = "Name of the frontend resource group"
  value       = azurerm_resource_group.frontend.name
}

output "frontend_rg_location" {
  description = "Location of the frontend resource group"
  value       = azurerm_resource_group.frontend.location
}
