/**
 * Get user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const arvEnvs = require('arv-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');

let options = arvEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = arvEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = (event, context, callback) => {
    const hashKey = `${arvEnvs.pfx.USER}${event.email}`;
    const rangeKey = `${arvEnvs.pfx.METADATA}${event.email}`;

    dql.getUser(dynamodb, process.env.DB_ARV_001, hashKey, rangeKey, callback);
};
