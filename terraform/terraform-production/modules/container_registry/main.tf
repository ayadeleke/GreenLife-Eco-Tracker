# Container Registry Module
# This module creates Azure Container Registry for the GreenLife application

resource "azurerm_container_registry" "main" {
  name                = var.registry_name
  resource_group_name = var.resource_group_name
  location           = var.location
  sku                = var.sku
  admin_enabled      = var.admin_enabled
  
  tags = var.tags
}
