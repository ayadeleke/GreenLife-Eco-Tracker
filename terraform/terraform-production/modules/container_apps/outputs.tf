output "environment_name" {
  description = "Name of the Container Apps environment"
  value       = data.azurerm_container_app_environment.shared.name
}

output "environment_id" {
  description = "ID of the Container Apps environment"
  value       = data.azurerm_container_app_environment.shared.id
}

output "backend_app_fqdn" {
  description = "FQDN of the backend container app"
  value       = azurerm_container_app.backend.ingress[0].fqdn
}

output "frontend_app_fqdn" {
  description = "FQDN of the frontend container app"
  value       = azurerm_container_app.frontend.ingress[0].fqdn
}

output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace"
  value       = data.azurerm_log_analytics_workspace.shared.id
}
