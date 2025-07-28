# Cache Module
# This module creates Azure Cache for Redis for the GreenLife application

resource "azurerm_redis_cache" "main" {
  name                = var.cache_name
  resource_group_name = var.resource_group_name
  location           = var.location
  capacity           = var.capacity
  family             = var.family
  sku_name           = var.sku_name
  
  redis_configuration {
    maxmemory_policy = var.maxmemory_policy
  }
  
  enable_non_ssl_port = var.enable_non_ssl_port
  minimum_tls_version = var.minimum_tls_version
  
  tags = var.tags
}
