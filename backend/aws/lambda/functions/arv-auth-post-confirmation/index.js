/**
 * Verificar usuario en AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const arv_env = require('arv-env');
const commons = require('utils/commons');
const dynamodb = new aws.DynamoDB();


exports.handler = (event, context, callback) => {
    // Parametros del usuario
    let provider = event.userName.includes('@') ? 'Cognito' : event.userName.split('_')[0];
    let hashKey = event.request.userAttributes.email;

    if (provider === 'Cognito') {
        commons.mt.updateUser(dynamodb, arv_env.db.ARV_USERS, hashKey, function(err, data) {
            if (err) callback(err);
            else callback(null, event);
        });
    }
    else callback(null, event);
};
