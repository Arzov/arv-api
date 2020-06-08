#!/bin/bash
# ==========================================================
# Testing backend en AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# ----------------------------------------------------------
#  Generar template.yml
# ----------------------------------------------------------

chmod +x samtemplate.sh; ./samtemplate.sh
status=$?


# ----------------------------------------------------------
#  Levantar servicio AWS DynamoDB
# ----------------------------------------------------------

docker network create arzov-local-network
docker run --name aws-arzov -d -p 8000:8000 \
    --network arzov-local-network \
    --network-alias arzov \
    amazon/dynamodb-local \
    -jar DynamoDBLocal.jar \
    -inMemory -sharedDb

# Crear tablas
cd dynamodb/tables

declare -A tables=(
  [arv-users]=5
)

for table in "${!tables[@]}"
do
    ln="${tables[$table]}"
    cd $table
    awk "NR >= ${ln}" resource.yml > tmp.yml
    aws dynamodb create-table --cli-input-yaml file://tmp.yml --endpoint-url http://localhost:8000 --region localhost > null.log
    rm tmp.yml; rm null.log; cd ../
done

cd ../../


# ----------------------------------------------------------
#  Levantar servicio AWS Lambda
# ----------------------------------------------------------

# Reemplazar variables en archivo template.yml
sed "
    s/@AWS_DEFAULT_REGION/$AWS_DEFAULT_REGION/g;
    s/@FACEBOOK_APP_ID/$FACEBOOK_APP_ID/g;
    s/@FACEBOOK_APP_SECRET/$FACEBOOK_APP_SECRET/g;
    s/@GOOGLE_APP_ID/$GOOGLE_APP_ID/g;
    s/@GOOGLE_APP_SECRET/$GOOGLE_APP_SECRET/g;
    s/@AWS_COGNITO_AUTH_DOMAIN/$AWS_COGNITO_AUTH_DOMAIN/g;
    s+@AWS_LAMBDA_ROLE+$AWS_LAMBDA_ROLE+g;
    s+@AWS_APPSYNC_ROLE+$AWS_APPSYNC_ROLE+g
" template.yml > template_tmp.yml

sam local start-lambda --docker-network arzov-local-network -t template_tmp.yml \
    --env-vars lambda/functions/env.json & pids="${pids-} $!"
status=$((status + $?))


# ----------------------------------------------------------
#  Pruebas AWS Lambda
# ----------------------------------------------------------

cd lambda/functions

lambdas="
    arv-auth-pre-signup
    arv-auth-post-confirmation
"

for lambda in $lambdas
do
    cd $lambda; npm install; npm run test
    status=$((status + $?))
    cd ../
done

# Detener servicios
kill -9 $pids
docker kill aws-arzov
docker rm aws-arzov
docker network rm arzov-local-network

# Remover archivos temporales
cd ../../
rm template_tmp.yml
rm template.yml
status=$((status + $?))

exit $status