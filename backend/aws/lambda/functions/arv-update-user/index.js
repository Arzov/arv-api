/**
 * Actualizar información del usuario
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
    let firstName = event.firstName;
    let lastName = event.lastName;
    let birthdate = event.birthdate;
    let gender = event.gender;
    let picture = event.picture;

    dql.updateUser(dynamodb, process.env.DB_ARV_001, hashKey, hashKey, firstName,
        lastName, birthdate, gender, picture, callback);
};
