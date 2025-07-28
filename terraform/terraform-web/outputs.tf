# Terraform Outputs
# These outputs provide important information about the created resources

output "backend_resource_group_name" {
  description = "Name of the backend resource group"
  value       = azurerm_resource_group.Greenlifebackend_group.name
}

output "frontend_resource_group_name" {
  description = "Name of the frontend resource group"
  value       = azurerm_resource_group.Greenlifefrontend_group.name
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.Greenlifebackend_storage.name
}

output "container_registry_name" {
  description = "Name of the container registry"
  value       = azurerm_container_registry.Greenlifebackend_registry.name
}

output "container_registry_login_server" {
  description = "Login server for the container registry"
  value       = azurerm_container_registry.Greenlifebackend_registry.login_server
}

output "backend_app_name" {
  description = "Name of the backend web app"
  value       = azurerm_linux_web_app.Greenlifebackend_api.name
}

output "frontend_app_name" {
  description = "Name of the frontend web app"
  value       = azurerm_linux_web_app.Greenlifefrontend_app.name
}

output "backend_app_url" {
  description = "URL of the backend web app"
  value       = "https://${azurerm_linux_web_app.Greenlifebackend_api.default_hostname}"
}

output "frontend_app_url" {
  description = "URL of the frontend web app"
  value       = "https://${azurerm_linux_web_app.Greenlifefrontend_app.default_hostname}"
}

output "service_plan_name" {
  description = "Name of the app service plan"
  value       = azurerm_service_plan.Greenlifebackend_plan.name
}

# Load Testing Outputs
output "load_test_resource_name" {
  description = "Name of the Azure Load Testing resource"
  value       = azurerm_load_test.greenlife_load_test_web.name
}

output "load_test_resource_id" {
  description = "Resource ID of the Azure Load Testing resource"
  value       = azurerm_load_test.greenlife_load_test_web.id
}

output "load_test_data_plane_uri" {
  description = "Data plane URI of the Azure Load Testing resource"
  value       = azurerm_load_test.greenlife_load_test_web.data_plane_uri
}
