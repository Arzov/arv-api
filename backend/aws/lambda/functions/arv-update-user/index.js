/**
 * Actualizar información del usuario
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
    let hashKey = `USR#${event.hashKey}`;
    let firstName = event.firstName;
    let lastName = event.lastName;
    let birthdate = event.birthdate;
    let gender = event.gender;
    let picture = event.picture;

    dql.updateUser(dynamodb, process.env.DB_ARV_001, hashKey, hashKey, firstName,
        lastName, birthdate, gender, picture, function(err, data) {
        if (err) callback(err);
        else callback(null, data);
    });
};
