# Demo Project for hosting static websites on AWS using Route53, CloudFront and S3

## Setup Terraform

```console
terraform$ terraform workspace new <env>
terraform$ terraform init
```

## Review Infrastructure changes

```console
scripts$ . terraform-plan.sh <env>
```

## Apply Infrastructure changes

```console
scripts$ . terraform-apply.sh <env>
```

## Deploy App

```console
scripts$ . deploy-app.sh <app-name> <custom-domain>
scripts$ #example
scripts$ . deploy-app.sh dice mydomain.com
```
