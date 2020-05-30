/**
 * Verificar usuario en AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const arv_env = require('arv-env');
const dynamodb = new aws.DynamoDB();
const COGNITO_USER_POOL_CLI_ID = arv_env.cg.COGNITO_USER_POOL_CLI_ID;
const DYNAMO_TABLE_USERS = 'ARV_USERS';

// FUNCIONES
function updateUser(tableName, hashKey, fn) {
    dynamodb.updateItem({
            TableName: tableName,
            Key: {
                "hashKey": {
                    S: hashKey
                }
            },
            UpdateExpression: "set verified = :v1",
            ExpressionAttributeValues: {
                ":v1": {
                    BOOL: true
                }
            }
        },
        function(err, data) {
            if (err) return fn(err);
            else fn(null, data);
        });
}

// HANDLER
exports.handler = (event, context, callback) => {
    // Parametros del usuario
    let provider = event.userName.includes('@') ? 'Cognito' :
        event.userName.split('_')[0];
    let hashKey = event.request.userAttributes.email;

    // Verificar user pool
    if (event.callerContext.clientId === COGNITO_USER_POOL_CLI_ID) {
        if (provider === 'Cognito') {
            updateUser(DYNAMO_TABLE_USERS, hashKey, function(err, data) {
                if (err) console.log(err);
                else callback(null, event);
            });
        }
        else callback(null, event);
    }
};
