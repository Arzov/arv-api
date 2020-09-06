/**
 * Verificar usuario
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const dql = require('utils/dql');
let options = { apiVersion: '2012-08-10' }

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000'
	options.accessKeyId = 'xxxx'
	options.secretAccessKey = 'xxxx'
	options.region = 'localhost'
}

const dynamodb = new aws.DynamoDB(options);


exports.handler = (event, context, callback) => {
    let provider = event.userName.includes('@') ? 'Cognito' : event.userName.split('_')[0];
    let hashKey = `USR#${event.request.userAttributes.email}`;

    if (provider === 'Cognito') {
        dql.updateUser(dynamodb, process.env.DB_ARV_001, hashKey, hashKey, function(err, data) {
            if (err) callback(err);
            else callback(null, event);
        });
    }
    else callback(null, event);
};
