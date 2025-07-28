# Resource Groups Module
# This module creates the resource groups for the GreenLife application

resource "azurerm_resource_group" "backend" {
  name     = var.backend_rg_name
  location = var.backend_location
  
  tags = var.tags
}

resource "azurerm_resource_group" "frontend" {
  name     = var.frontend_rg_name
  location = var.frontend_location
  
  tags = var.tags
}
