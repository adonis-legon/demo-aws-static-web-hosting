resource "aws_s3_bucket" "dice_bucket" {
  bucket = "dice.${var.bucket_name}"
}

resource "aws_s3_bucket_policy" "dice_bucket_policy" {
  bucket = aws_s3_bucket.dice_bucket.id
  policy = data.aws_iam_policy_document.dice_allow_access_from_cloud_front_distribution.json
}

data "aws_iam_policy_document" "dice_allow_access_from_cloud_front_distribution" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.dice_s3_distribution_identity.iam_arn]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.dice_bucket.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_acl" "dice_bucket_acl" {
  bucket = aws_s3_bucket.dice_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_public_access_block" "dice_bucket_block_public" {
  bucket = aws_s3_bucket.dice_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "dice_bucket_cors_config" {
  bucket = aws_s3_bucket.dice_bucket.id

  cors_rule {
    allowed_headers = ["Authorization", "Content-Length"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://dice.${var.domain_name}"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_website_configuration" "dice_bucket_website_config" {
  bucket = aws_s3_bucket.dice_bucket.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}
