/**
 * Verificar usuario
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const arvEnvs = require('arv-envs');
const dql = require('utils/dql');
const arvUtils = require('arv-utils');
let options = { apiVersion: '2012-08-10' }

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000'
	options.accessKeyId = 'xxxx'
	options.secretAccessKey = 'xxxx'
	options.region = 'localhost'
}

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
