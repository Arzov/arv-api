/**
 * Update user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const arvEnvs = require('arv-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');


// configurations

let options = arvEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = arvEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);


// execution

exports.handler = (event, context, callback) => {

    const hashKey = `${arvEnvs.pfx.USER}${event.email}`;
    const rangeKey = `${arvEnvs.pfx.METADATA}${event.email}`;
    const firstName = event.firstName;
    const lastName = event.lastName;
    const birthdate = event.birthdate;
    const gender = event.gender;
    const picture = event.picture;
    const providers = event.providers;
    const providerId = JSON.parse(event.providerId);
    const joinedOn = event.joinedOn;
    const verified = event.verified;

    dql.updateUser(
        dynamodb,
        process.env.DB_ARV_001,
        hashKey,
        rangeKey,
        providers,
        providerId,
        verified,
        firstName,
        lastName,
        joinedOn,
        birthdate,
        gender,
        picture,
        callback
    );
};
