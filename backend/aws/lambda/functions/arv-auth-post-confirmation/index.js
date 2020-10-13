/**
 * Verificar usuario
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const arvEnvs = require('arv-envs');
const dql = require('utils/dql');
const arvUtils = require('arv-utils');
let options = arvEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = arvEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);


exports.handler = (event, context, callback) => {
    let provider = arvUtils.getProviderFromUserName(event.userName);
    let hashKey = `${arvEnvs.pfx.USR}${event.request.userAttributes.email}`;

    if (provider === 'Cognito') {
        dql.updateUser(dynamodb, process.env.DB_ARV_001, hashKey, hashKey, function(err, data) {
            if (err) callback(err);
            else callback(null, event);
        });
    }
    else callback(null, event);
};
