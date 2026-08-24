variable "builds_cloudfront_distribution_id" {
  type        = string
  description = "CloudFront distribution ID for builds.opentrons.com (release-ci output opentrons_app_builds_cloudfront_distribution_id). Leave empty to skip invalidation IAM."
  default     = ""
}
