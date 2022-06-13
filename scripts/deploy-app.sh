APP_NAME=$1
ROOT_DOMAIN=$2
AWS_PROFILE=${3:-default}

cd ../apps/$APP_NAME
aws s3 sync . s3://$APP_NAME.$ROOT_DOMAIN --profile $AWS_PROFILE

cd ../../scripts