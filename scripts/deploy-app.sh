APP_NAME=$1
ROOT_DOMAIN=$2
AWS_PROFILE=${3:-default}
ORIGIN_BUCKET=$APP_NAME.$ROOT_DOMAIN

cd ../apps/$APP_NAME
aws s3 sync . s3://$ORIGIN_BUCKET --profile $AWS_PROFILE

# get cloudfront distribution id where the origin bucket name is the app+root_domain
ORIGIN_BUCKET=$APP_NAME.$ROOT_DOMAIN
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id, Origins.Items[0].DomainName]' | jq --arg ORIGIN_BUCKET "$ORIGIN_BUCKET" '.[] | select(.[] | contains($ORIGIN_BUCKET)) | .[0]')

# create invalidation to update the cache
eval DISTRIBUTION_ID=$DISTRIBUTION_ID
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/*'

cd ../../scripts