resource "aws_s3_bucket" "root_bucket" {
  bucket = var.bucket_name
  acl    = "private"
  policy = templatefile(
    "templates/s3-policy.json", {
      principal = aws_cloudfront_origin_access_identity.dice_s3_distribution_identity.iam_arn,
      bucket    = var.bucket_name
    }
  )

  website {
    redirect_all_requests_to = "https://dice.${var.domain_name}"
  }

  tags = var.common_tags
}
