terraform {
  required_version = ">= 1.3.7"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.43.0"
    }
  }
  cloud {
    organization = "DevOps_GreenLife"
    workspaces {
      name = "remote_state"
    }
  }
}


provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "Greenlifebackend_group" {
  name     = "Greenlifebackend_group-a7e3"
  location = "South Central US"
}

resource "azurerm_resource_group" "Greenlifefrontend_group" {
  name     = "Greenlifefrontend_group"
  location = "Germany West Central"
}


resource "azurerm_storage_account" "Greenlifebackend_storage" {
  name                     = "greenlifestorage450"
  resource_group_name      = azurerm_resource_group.Greenlifebackend_group.name
  location                 = azurerm_resource_group.Greenlifebackend_group.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
