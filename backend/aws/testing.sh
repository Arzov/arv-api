#!/bin/bash
# ==========================================================
# Testing backend en AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# ----------------------------------------------------------
#  Generar template.yml
# ----------------------------------------------------------

chmod +x template_generator.sh; ./template_generator.sh


# ----------------------------------------------------------
#  Levantar servicio AWS Lambda
# ----------------------------------------------------------

# Reemplazar variables en archivo template.yml
sed "s/@LAMBDA_LAYER/$AWS_LAMBDA_LAYER/g;s+@LAMBDA_ROLE+$AWS_LAMBDA_ROLE+g" template.yml > template_tmp.yml

sam local start-lambda -t template_tmp.yml &


# ----------------------------------------------------------
#  Pruebas AWS Lambda
# ----------------------------------------------------------

cd lambda/functions/arv-user-post-confirmation
npm install
npm run test
status=$?

# Remover archivos temporales
cd ../../../
rm template_tmp.yml
rm template.yml

exit $status