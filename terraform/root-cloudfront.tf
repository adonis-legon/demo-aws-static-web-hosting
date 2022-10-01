locals {
  root_cloudfront_id                = "s3-root.${var.bucket_name}"
  root_cloudfront_cache_policy_name = "s3-root-distribution-cache-policy"
}

# Cloudfront S3 for redirect to dice.
resource "aws_cloudfront_origin_access_identity" "root_s3_distribution_identity" {
  comment = "Cloudfront Distribution Identity for dice_s3 bucket access"
}

resource "aws_cloudfront_cache_policy" "root_s3_distribution_cache_policy" {
  name = local.root_cloudfront_cache_policy_name

  min_ttl     = 3600
  default_ttl = 21600
  max_ttl     = 172800

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Origin"]
      }
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}


resource "aws_cloudfront_distribution" "root_s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.root_bucket.bucket_regional_domain_name
    origin_id   = local.root_cloudfront_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.root_s3_distribution_identity.cloudfront_access_identity_path
    }
  }

  enabled         = true
  is_ipv6_enabled = true

  aliases = [var.domain_name]

  default_cache_behavior {
    cache_policy_id  = aws_cloudfront_cache_policy.root_s3_distribution_cache_policy.id
    target_origin_id = local.root_cloudfront_id

    viewer_protocol_policy = "allow-all"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.cert_validation.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}
