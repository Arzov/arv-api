#!/bin/bash
# ==========================================================
# Run tests locally for AWS
# @author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================
set -o errexit


# ----------------------------------------------------------
#  Parameters
# ----------------------------------------------------------

DYNAMODB_SERVICE_IP=172.17.0.1
DYNAMODB_PORT=8000
DYNAMODB_TEMPLATE_START_LINE=5
DYNAMODB_CONN_TIMEOUT=60000

LAMBDA_SERVICE_IP=0.0.0.0


# ----------------------------------------------------------
#  Create template.yml
# ----------------------------------------------------------

chmod +x samtemplate.sh; ./samtemplate.sh


# ----------------------------------------------------------
#  Start AWS DynamoDB service
# ----------------------------------------------------------

docker run \
    --name arzov-dynamodb \
    -p $DYNAMODB_PORT:$DYNAMODB_PORT \
    -d \
    amazon/dynamodb-local \
    -jar DynamoDBLocal.jar \
    -inMemory -sharedDb

# Create tables
cd dynamodb/tables

declare -A tables=(
  [arv-001]=$DYNAMODB_TEMPLATE_START_LINE
)

for table in "${!tables[@]}"
do
    ln="${tables[$table]}"
    cd $table
    awk "NR >= ${ln}" resource.yml > tmp.yml
    aws dynamodb create-table \
        --cli-input-yaml file://tmp.yml \
        --endpoint-url http://$DYNAMODB_SERVICE_IP:$DYNAMODB_PORT \
        --cli-connect-timeout $DYNAMODB_CONN_TIMEOUT \
        > null.log
    rm tmp.yml; rm null.log; cd ../
done

cd ../../


# ----------------------------------------------------------
#  Start AWS Lambda service
# ----------------------------------------------------------

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
sam local start-lambda \
    -t template.yml \
    --host $LAMBDA_SERVICE_IP \
    --parameter-overrides $params \
    --env-vars lambda/functions/env.json & pids="${pids-} $!"


# ----------------------------------------------------------
#  Execute AWS Lambda
# ----------------------------------------------------------

cd lambda/functions

lambdas="
    arv-pre-signup
    arv-post-confirmation
    arv-get-user
    arv-update-user
"

# Install dependencies
for lambda in $lambdas
do
    echo
    echo "----------------------------"
    echo "Installing lambda: $lambda"
    echo "----------------------------"
    cd $lambda; npm install; cd ../
done

# Execute tests
for lambda in $lambdas
do
    echo
    echo "----------------------------"
    echo "Executing lambda: $lambda"
    echo "----------------------------"
    cd $lambda; npm run test; cd ../
done

# Stop services
kill $pids
docker rm arzov-dynamodb -f

# Remove temp files
cd ../../
rm template.yml