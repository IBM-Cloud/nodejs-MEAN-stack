// variables /////////////////////////////
variable "region" {
  default     = "us-south"
  description = "Region where to find and create resources"
}

variable "prefix" {
  default     = ""
  description = "Prefix for all resources created by the template"
}

variable "use_default_resource_group" {
  type    = bool
  default = true
}

variable "tags" {
  default = ["terraform", "mean-stack"]
}

// terraform, provider /////////////////////////////
terraform {
  required_version = ">= 1.4"
  required_providers {
    ibm = {
      source  = "IBM-Cloud/ibm"
      version = ">= 1.51"
    }
  }
}

provider "ibm" {
  region = var.region
}

resource "random_string" "random" {
  count = var.prefix == "" ? 1 : 0

  length  = 6
  special = false
}

// basename, resource group id /////////////////////////////
locals {
  basename            = lower(var.prefix == "" ? "mean-stack-${random_string.random.0.result}" : var.prefix)
  resource_group_id   = var.use_default_resource_group ? data.ibm_resource_group.group.0.id : ibm_resource_group.group.0.id
  resource_group_name = var.use_default_resource_group ? data.ibm_resource_group.group.0.name : ibm_resource_group.group.0.name
}

# Create a resource group or reuse an existing one
resource "ibm_resource_group" "group" {
  count = var.use_default_resource_group ? 0 : 1
  name  = "${local.basename}-group"
  tags  = var.tags
}

data "ibm_resource_group" "group" {
  count      = var.use_default_resource_group ? 1 : 0
  is_default = true
}


// mongodb /////////////////////////////
resource "ibm_database" "mongodb" {
  resource_group_id = local.resource_group_id
  name              = "${local.basename}-mongodb"
  service           = "databases-for-mongodb"
  plan              = "standard"
  location          = var.region
  adminpassword     = "password123"
}

resource "ibm_resource_key" "mongodb_key" {
  name                 = "${local.basename}-mongodb-key"
  role                 = "Viewer"
  resource_instance_id = ibm_database.mongodb.id
}

resource "local_file" "env" {
  content  = <<-EOT
    SESSION_SECRET=my_secret
    MONGODB_URL=${ibm_resource_key.mongodb_key.credentials["connection.mongodb.composed.0"]}
    CERTIFICATE_BASE64=${ibm_resource_key.mongodb_key.credentials["connection.mongodb.certificate.certificate_base64"]}
    PORT=8080
    BIND=0.0.0.0
  EOT
  filename = "${path.module}/.env"
}

// code engine /////////////////////////////
resource "ibm_code_engine_project" "ce_project" {
  name              = local.basename
  resource_group_id = local.resource_group_id
}

resource "ibm_code_engine_secret" "ce_secret" {
  project_id = ibm_code_engine_project.ce_project.id
  name       = "${local.basename}-secrets"
  format     = "generic"

  data = {
    SESSION_SECRET     = "my_secret"
    MONGODB_URL        = ibm_resource_key.mongodb_key.credentials["connection.mongodb.composed.0"]
    CERTIFICATE_BASE64 = ibm_resource_key.mongodb_key.credentials["connection.mongodb.certificate.certificate_base64"]
    PORT               = "8080"
    BIND               = "0.0.0.0"
  }
}

resource "ibm_code_engine_app" "code_engine_app_instance" {
  project_id          = ibm_code_engine_project.ce_project.id
  name                = "${local.basename}-application"
  image_reference     = "icr.io/solution-tutorials/tutorial-mean-stack"
  scale_min_instances = 1
  scale_max_instances = 2

  run_env_variables {
    reference = ibm_code_engine_secret.ce_secret.name
    type      = "secret_full_reference"
  }
}

output "endpoint" {
  value = ibm_code_engine_app.code_engine_app_instance.endpoint
}

output "resource_group_name" {
  value = local.resource_group_name
}
