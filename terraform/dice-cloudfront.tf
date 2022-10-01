locals {
  dice_cloudfront_id                = "s3-dice.${var.bucket_name}"
  dice_cloudfront_cache_policy_name = "s3-dice-distribution-cache-policy"
}

# Cloudfront distribution for main s3 site.
resource "aws_cloudfront_origin_access_identity" "dice_s3_distribution_identity" {
  comment = "Cloudfront Distribution Identity for dice_s3 bucket access"
}

resource "aws_cloudfront_cache_policy" "dice_s3_distribution_cache_policy" {
  name = local.dice_cloudfront_cache_policy_name

  min_ttl     = var.dice_app_cache_config.min_ttl
  default_ttl = var.dice_app_cache_config.default_ttl
  max_ttl     = var.dice_app_cache_config.max_ttl

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_distribution" "dice_s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.dice_bucket.bucket_regional_domain_name
    origin_id   = local.dice_cloudfront_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.dice_s3_distribution_identity.cloudfront_access_identity_path
    }

  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = ["dice.${var.domain_name}"]

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_code         = 200
    response_page_path    = "/404.html"
  }

  default_cache_behavior {
    cache_policy_id  = aws_cloudfront_cache_policy.dice_s3_distribution_cache_policy.id
    target_origin_id = local.dice_cloudfront_id

    viewer_protocol_policy = "redirect-to-https"
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
