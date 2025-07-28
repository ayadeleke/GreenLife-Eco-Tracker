output "vnet_name" {
  description = "Name of the virtual network"
  value       = azurerm_virtual_network.main.name
}

output "vnet_id" {
  description = "ID of the virtual network"
  value       = azurerm_virtual_network.main.id
}

output "container_subnet_id" {
  description = "ID of the container subnet"
  value       = azurerm_subnet.container_subnet.id
}

output "container_subnet_name" {
  description = "Name of the container subnet"
  value       = azurerm_subnet.container_subnet.name
}
