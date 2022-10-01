provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region

  default_tags {
    tags = var.common_tags
  }
}

provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}
