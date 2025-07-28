# Networking Module
# This module creates virtual network and subnets for the GreenLife application

resource "azurerm_virtual_network" "main" {
  name                = var.vnet_name
  address_space       = var.address_space
  location           = var.location
  resource_group_name = var.resource_group_name
  
  tags = var.tags
}

resource "azurerm_subnet" "container_subnet" {
  name                 = var.container_subnet_name
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = var.container_subnet_prefixes
}
