resource "aws_s3_bucket" "dice_bucket" {
  bucket = "dice.${var.bucket_name}"
  acl    = "private"
  policy = templatefile(
    "templates/s3-policy.json", {
      principal = aws_cloudfront_origin_access_identity.dice_s3_distribution_identity.iam_arn,
      bucket    = "dice.${var.bucket_name}"
    }
  )

  cors_rule {
    allowed_headers = ["Authorization", "Content-Length"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://dice.${var.domain_name}"]
    max_age_seconds = 3000
  }

  website {
    index_document = "index.html"
    error_document = "404.html"
  }
  tags = var.common_tags
}
