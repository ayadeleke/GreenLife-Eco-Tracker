# Security Module
# This module creates Key Vault for storing secrets

data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "main" {
  name                = var.key_vault_name
  resource_group_name = var.resource_group_name
  location           = var.location
  tenant_id          = data.azurerm_client_config.current.tenant_id
  sku_name           = var.sku_name
  
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id
    
    secret_permissions = var.secret_permissions
  }
  
  tags = var.tags
}
