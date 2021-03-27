/**
 * Update user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const arvEnvs = require('arv-envs');
const dql = require('utils/dql');
let options = arvEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = arvEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = (event, context, callback) => {
    const hashKey = `${arvEnvs.pfx.USR}${event.email}`;
    const firstName = event.firstName;
    const lastName = event.lastName;
    const birthdate = event.birthdate;
    const gender = event.gender;
    const picture = event.picture;
    const providers = event.providers;
    const providerId = JSON.parse(event.providerId);
    const registerDate = event.registerDate;
    const verified = event.verified;

    dql.updateUser(
        dynamodb,
        process.env.DB_ARV_001,
        hashKey,
        hashKey,
        providers,
        providerId,
        verified,
        firstName,
        lastName,
        registerDate,
        birthdate,
        gender,
        picture,
        callback
    );
};
