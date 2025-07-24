output "environment_name" {
  description = "Name of the Container Apps environment"
  value       = azurerm_container_app_environment.main.name
}

output "environment_id" {
  description = "ID of the Container Apps environment"
  value       = azurerm_container_app_environment.main.id
}

output "backend_app_fqdn" {
  description = "FQDN of the backend container app"
  value       = azurerm_container_app.backend.latest_revision_fqdn
}

output "frontend_app_fqdn" {
  description = "FQDN of the frontend container app"
  value       = azurerm_container_app.frontend.latest_revision_fqdn
}

output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.main.id
}
