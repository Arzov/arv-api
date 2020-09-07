/**
 * Obtener usuario desde DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const arvEnvs = require('arv-envs');
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
    let hashKey = `${arvEnvs.pfx.USR}${event.email}`;

    dql.getUser(dynamodb, process.env.DB_ARV_001, hashKey, hashKey, callback);
};
