#!/bin/bash
# ==========================================================
# Deploy backend to AWS
# @author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================
set -o errexit


# ----------------------------------------------------------
#  Create template.yml
# ----------------------------------------------------------

chmod +x samtemplate.sh; ./samtemplate.sh


# ----------------------------------------------------------
#  Build AWS Lambda
# ----------------------------------------------------------

# AWS SAM build
params="
    ParameterKey=HostRoot,ParameterValue=$HOST_ROOT
    ParameterKey=AWSDefaultRegion,ParameterValue=$AWS_DEFAULT_REGION
    ParameterKey=FacebookAppId,ParameterValue=$FACEBOOK_APP_ID
    ParameterKey=FacebookAppSecret,ParameterValue=$FACEBOOK_APP_SECRET
    ParameterKey=GoogleAppId,ParameterValue=$GOOGLE_APP_ID
    ParameterKey=GoogleAppSecret,ParameterValue=$GOOGLE_APP_SECRET
    ParameterKey=AWSCognitoAuthDomain,ParameterValue=$AWS_COGNITO_AUTH_DOMAIN
    ParameterKey=AWSR53UMTDomain,ParameterValue=$AWS_R53_UMT_DOMAIN
    ParameterKey=AWSS3AssetsBucket,ParameterValue=$AWS_S3_ASSETS_BUCKET
"
sam build -t template.yml --parameter-overrides $params


# ----------------------------------------------------------
#  Deploy to AWS
# ----------------------------------------------------------

# AWS SAM deploy
cd .aws-sam/build/
sam deploy --no-confirm-changeset \
    --stack-name arv \
    --s3-prefix arv \
    --region $AWS_DEFAULT_REGION \
    --capabilities CAPABILITY_NAMED_IAM \
    --s3-bucket $AWS_S3_ARTIFACTS_BUCKET \
    --parameter-overrides $params \
    --no-fail-on-empty-changeset

# Remove temp files
cd ../../
rm template.yml
rm -R .aws-sam