#!/bin/bash
# ==========================================================
# Deploy backend en AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# ----------------------------------------------------------
#  Generar template.yml
# ----------------------------------------------------------

chmod +x samtemplate.sh; ./samtemplate.sh
status=$?


# ----------------------------------------------------------
#  Build local para AWS Lambda
# ----------------------------------------------------------

# AWS SAM build
sam build -t template.yml \
    --parameter-overrides "
        ParameterKey=AWSDefaultRegion,ParameterValue=$AWS_DEFAULT_REGION
        ParameterKey=FacebookAppId,ParameterValue=$FACEBOOK_APP_ID
        ParameterKey=FacebookAppSecret,ParameterValue=$FACEBOOK_APP_SECRET
        ParameterKey=GoogleAppId,ParameterValue=$GOOGLE_APP_ID
        ParameterKey=GoogleAppSecret,ParameterValue=$GOOGLE_APP_SECRET
        ParameterKey=AWSCognitoAuthDomain,ParameterValue=$AWS_COGNITO_AUTH_DOMAIN
        ParameterKey=AWSR53UMTDomain,ParameterValue=$AWS_R53_UMT_DOMAIN
        ParameterKey=AWSS3AssetsBucket,ParameterValue=$AWS_S3_ASSETS_BUCKET
    "
status=$((status + $?))


# ----------------------------------------------------------
#  Deploy en AWS
# ----------------------------------------------------------

# AWS SAM deploy
cd .aws-sam/build/
sam deploy --no-confirm-changeset \
    --stack-name arv \
    --s3-prefix arv \
    --region $AWS_DEFAULT_REGION \
    --capabilities CAPABILITY_NAMED_IAM \
    --s3-bucket $AWS_S3_ARTIFACTS_BUCKET \
    --parameter-overrides "
        ParameterKey=AWSDefaultRegion,ParameterValue=$AWS_DEFAULT_REGION
        ParameterKey=FacebookAppId,ParameterValue=$FACEBOOK_APP_ID
        ParameterKey=FacebookAppSecret,ParameterValue=$FACEBOOK_APP_SECRET
        ParameterKey=GoogleAppId,ParameterValue=$GOOGLE_APP_ID
        ParameterKey=GoogleAppSecret,ParameterValue=$GOOGLE_APP_SECRET
        ParameterKey=AWSCognitoAuthDomain,ParameterValue=$AWS_COGNITO_AUTH_DOMAIN
        ParameterKey=AWSR53UMTDomain,ParameterValue=$AWS_R53_UMT_DOMAIN
        ParameterKey=AWSS3AssetsBucket,ParameterValue=$AWS_S3_ASSETS_BUCKET
    " \
    --no-fail-on-empty-changeset
status=$((status + $?))

# Remover archivos temporales
cd ../../
rm template.yml
rm -R .aws-sam
status=$((status + $?))

exit $status