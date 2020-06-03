#!/bin/bash
# ==========================================================
# Deploy backend en AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# ----------------------------------------------------------
#  Generar template.yml
# ----------------------------------------------------------

chmod +x template_generator.sh; ./template_generator.sh
status=$?


# ----------------------------------------------------------
#  Build local para AWS Lambda
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

# AWS SAM build
sam build -t template_tmp.yml
status=$((status + $?))


# ----------------------------------------------------------
#  Deploy en AWS
# ----------------------------------------------------------

# Reemplazar variables en archivo samconfig.toml
sed "
    s/@AWS_S3_ARTIFACTS_BUCKET/$AWS_S3_ARTIFACTS_BUCKET/g;
    s/@AWS_DEFAULT_REGION/$AWS_DEFAULT_REGION/g
" samconfig.toml > .aws-sam/build/samconfig.toml

# AWS SAM deploy
cd .aws-sam/build/
sam deploy --no-confirm-changeset
status=$((status + $?))

# Remover archivos temporales
cd ../../
rm template_tmp.yml
rm template.yml
rm -R .aws-sam
status=$((status + $?))

exit $status