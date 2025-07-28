variable "backend_rg_name" {
  description = "Name of the backend resource group"
  type        = string
}

variable "frontend_rg_name" {
  description = "Name of the frontend resource group"
  type        = string
}

variable "backend_location" {
  description = "Location for backend resources"
  type        = string
}

variable "frontend_location" {
  description = "Location for frontend resources"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
