/**
 * Validate user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const arvEnvs = require('arv-envs');
const arvUtils = require('arv-utils');
const aws = require('aws-sdk');


// configurations

let optionsLambda = arvEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsLambda = arvEnvs.dev.LAMBDA_CONFIG;
}

const lambda = new aws.Lambda(optionsLambda);


// execution

exports.handler = (event, context, callback) => {

    let provider = arvUtils.getProviderFromUserName(event.userName);
    let hashKey = `${arvEnvs.pfx.USER}${event.request.userAttributes.email}`;

    if (provider === 'Cognito') {
        let params = { FunctionName: 'arv-get-user' };

        params.Payload = JSON.stringify({
            email: hashKey.split('#')[1],
        });

        lambda.invoke(params, function (err, data) {
            if (err) callback(err);
            else {
                const response = JSON.parse(data.Payload);

                let params = { FunctionName: 'arv-update-user' };

                params.Payload = JSON.stringify({
                    email       : hashKey.split('#')[1],
                    firstName   : response.firstName,
                    lastName    : response.lastName,
                    birthdate   : response.birthdate,
                    gender      : response.gender,
                    picture     : response.picture,
                    providers   : response.providers,
                    providerId  : response.providerId,
                    joinedOn    : response.joinedOn,
                    verified    : true,
                });

                lambda.invoke(params, function (err, data) {
                    if (err) callback(err);
                    else callback(null, event);
                });
            }
        });
    } else callback(null, event);
};
