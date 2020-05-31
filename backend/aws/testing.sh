#!/bin/bash
# ==========================================================
# Testing backend en AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# ----------------------------------------------------------
#  Generar template.yml
# ----------------------------------------------------------

chmod +x template_generator.sh; ./template_generator.sh
status=$?


# ----------------------------------------------------------
#  Levantar servicio AWS Lambda
# ----------------------------------------------------------

# Reemplazar variables en archivo template.yml
sed "s/@LAMBDA_LAYER/$AWS_LAMBDA_LAYER/g;s+@LAMBDA_ROLE+$AWS_LAMBDA_ROLE+g" template.yml > template_tmp.yml

sam local start-lambda -t template_tmp.yml & pids="${pids-} $!"
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