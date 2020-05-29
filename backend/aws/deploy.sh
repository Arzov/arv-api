#!/bin/bash
# ==========================================================
# Deploy backend en AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# ----------------------------------------------------------
#  Generar template.yml
# ----------------------------------------------------------

chmod +x template_generator.sh; ./template_generator.sh


# ----------------------------------------------------------
#  Build local para AWS Lambda
# ----------------------------------------------------------

# Reemplazar variables en archivo template.yml
sed "s/@LAMBDA_LAYER/$AWS_LAMBDA_LAYER/g;s+@LAMBDA_ROLE+$AWS_LAMBDA_ROLE+g" template.yml > template_tmp.yml

# AWS SAM build
sam build -t template_tmp.yml


# ----------------------------------------------------------
#  Deploy en AWS
# ----------------------------------------------------------

# Reemplazar variables en archivo samconfig.toml
sed "s/@S3_BUCKET/$AWS_S3_ARTIFACTS_BUCKET/g;s/@REGION/$AWS_DEFAULT_REGION/g" samconfig.toml > .aws-sam/build/samconfig.toml

# AWS SAM deploy
cd .aws-sam/build/
sam deploy --no-confirm-changeset
status=$?

# Remover archivos temporales
cd ../../
rm template_tmp.yml
rm template.yml
rm -R .aws-sam

exit $status