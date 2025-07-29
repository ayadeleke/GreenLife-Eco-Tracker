# Container Apps Module
# This module manages the shared Container App Environment and Production Apps
# Note: Environment is shared between staging and production due to subscription limits

# Use existing shared Container App Environment
data "azurerm_container_app_environment" "shared" {
  name                = "greenlife-container-env-91ha"
  resource_group_name = "Greenlifebackend_group-a7e3"
}

# Use existing shared Log Analytics workspace
data "azurerm_log_analytics_workspace" "shared" {
  name                = "greenlife-logs-91ha"
  resource_group_name = "Greenlifebackend_group-a7e3"
}

resource "azurerm_container_app" "backend" {
  name                         = var.backend_app_name
  container_app_environment_id = data.azurerm_container_app_environment.shared.id
  resource_group_name          = var.resource_group_name
  revision_mode               = "Single"

  registry {
    server   = var.registry_server
    username = var.registry_username
    password_secret_name = "registry-password"
  }

  secret {
    name  = "registry-password"
    value = var.registry_password
  }

  # Lifecycle rule to prevent secret removal issues
  lifecycle {
    ignore_changes = [
      secret
    ]
  }

  template {
    container {
      name   = "backend"
      image  = var.backend_image
      cpu    = var.backend_cpu
      memory = var.backend_memory
      
      dynamic "env" {
        for_each = var.backend_env_vars
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }
  
  ingress {
    external_enabled = var.backend_external_enabled
    target_port      = var.backend_target_port
    
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
  
  tags = var.tags
}

resource "azurerm_container_app" "frontend" {
  name                         = var.frontend_app_name
  container_app_environment_id = data.azurerm_container_app_environment.shared.id
  resource_group_name          = var.frontend_resource_group_name
  revision_mode               = "Single"

  registry {
    server   = var.registry_server
    username = var.registry_username
    password_secret_name = "registry-password"
  }

  secret {
    name  = "registry-password"
    value = var.registry_password
  }

  # Lifecycle rule to prevent secret removal issues
  lifecycle {
    ignore_changes = [
      secret
    ]
  }

  template {
    container {
      name   = "frontend"
      image  = var.frontend_image
      cpu    = var.frontend_cpu
      memory = var.frontend_memory
      
      dynamic "env" {
        for_each = var.frontend_env_vars
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }
  
  ingress {
    external_enabled = var.frontend_external_enabled
    target_port      = var.frontend_target_port
    
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
  
  tags = var.tags
}
