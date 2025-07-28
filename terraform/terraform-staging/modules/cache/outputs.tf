output "cache_hostname" {
  description = "Hostname of the Redis cache"
  value       = azurerm_redis_cache.main.hostname
}

output "cache_primary_access_key" {
  description = "Primary access key for Redis cache"
  value       = azurerm_redis_cache.main.primary_access_key
  sensitive   = true
}

output "cache_secondary_access_key" {
  description = "Secondary access key for Redis cache"
  value       = azurerm_redis_cache.main.secondary_access_key
  sensitive   = true
}

output "cache_connection_string" {
  description = "Redis connection string"
  value       = "rediss://:${azurerm_redis_cache.main.primary_access_key}@${azurerm_redis_cache.main.hostname}:6380"
  sensitive   = true
}
