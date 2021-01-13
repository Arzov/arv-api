/**
 * Obtener usuario desde DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const arvEnvs = require('arv-envs');
const dql = require('utils/dql');
let options = arvEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = arvEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);


exports.handler = (event, context, callback) => {
    let hashKey = `${arvEnvs.pfx.USR}${event.email}`;

    dql.getUser(dynamodb, process.env.DB_ARV_001, hashKey, hashKey, callback);
};
