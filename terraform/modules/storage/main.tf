# Storage Module
# This module creates storage account and containers for the GreenLife application

resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = var.account_tier
  account_replication_type = var.replication_type
  
  # Security settings
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = true
  
  tags = var.tags
}

resource "azurerm_storage_container" "media" {
  name                  = "media"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = var.media_container_access_type
}

resource "azurerm_storage_container" "static" {
  name                  = "static"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = var.static_container_access_type
}
