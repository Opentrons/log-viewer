# GitHub Actions OIDC role for Opentrons/log-viewer desktop app deploys.
#
# Mirrors inf/release-ci/opentrons_monorepo_app_deploy_oidc.tf in robot-stack-infra,
# scoped to prefix "logviewer/" instead of "app/".
#
# Buckets: robot-stack prod website (builds.opentrons.com) + ot3 prod website
# (ot3-development.builds.opentrons.com).
#
# After apply, set GitHub Actions variable OT_LOGVIEWER_DEPLOY_ROLE to
# terraform output -raw log_viewer_github_oidc_role_arn.
#
# Prerequisite: IAM OIDC provider for https://token.actions.githubusercontent.com
# must exist in the robotics_robot_stack_prod account.

data "aws_caller_identity" "current" {}

data "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"
}

data "aws_s3_bucket" "builds" {
  bucket = "builds.opentrons.com"
}

data "aws_s3_bucket" "ot3_development_builds" {
  bucket = "ot3-development.builds.opentrons.com"
}

locals {
  object_arns = [
    "${data.aws_s3_bucket.builds.arn}/logviewer/*",
    "${data.aws_s3_bucket.ot3_development_builds.arn}/logviewer/*",
  ]
  cloudfront_arn = var.builds_cloudfront_distribution_id == "" ? null : "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${var.builds_cloudfront_distribution_id}"
}

resource "aws_iam_role" "github_actions_log_viewer_deploy" {
  name        = "github-actions-log-viewer-deploy"
  description = "OIDC: Opentrons/log-viewer S3 deploy to robot-stack + ot3 builds buckets (logviewer/ prefix)"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRoleWithWebIdentity"
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github_actions.arn
        }
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:Opentrons/log-viewer:*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "github_actions_log_viewer_deploy_s3" {
  name = "log-viewer-s3-logviewer-prefix"
  role = aws_iam_role.github_actions_log_viewer_deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(
      [
        {
          Sid    = "ListBucketsForSync"
          Effect = "Allow"
          Action = [
            "s3:ListBucket",
            "s3:GetBucketLocation",
          ]
          Resource = [
            data.aws_s3_bucket.builds.arn,
            data.aws_s3_bucket.ot3_development_builds.arn,
          ]
        },
        {
          Sid    = "ObjectRWInLogviewerPrefix"
          Effect = "Allow"
          Action = [
            "s3:GetObject",
            "s3:PutObject",
            "s3:PutObjectAcl",
            "s3:DeleteObject",
            "s3:AbortMultipartUpload",
          ]
          Resource = local.object_arns
        },
      ],
      local.cloudfront_arn == null ? [] : [
        {
          Sid      = "InvalidateProdBuildsCloudFront"
          Effect   = "Allow"
          Action   = ["cloudfront:CreateInvalidation"]
          Resource = local.cloudfront_arn
        },
      ],
    )
  })
}
