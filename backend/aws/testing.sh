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

sam local start-lambda -t template_tmp.yml --env-vars lambda/functions/env.json & pids="${pids-} $!"
status=$((status + $?))


# ----------------------------------------------------------
#  Pruebas AWS Lambda
# ----------------------------------------------------------

cd lambda/functions

cd arv-auth-pre-signup; npm install; npm run test; cd ../
status=$((status + $?))

cd arv-auth-post-confirmation; npm install; npm run test; cd ../
status=$((status + $?))

kill -9 $pids

# Remover archivos temporales
cd ../../
rm template_tmp.yml
rm template.yml
status=$((status + $?))

exit $status