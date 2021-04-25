/**
 * SignUp user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const arvUtils = require('arv-utils');
const arvEnvs = require('arv-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');
const fns = require('utils/fns');


// configurations

const cognito = new aws.CognitoIdentityServiceProvider();
let optionsDynamodb = arvEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = arvEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = arvEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = arvEnvs.dev.LAMBDA_CONFIG;
}

const dynamodb = new aws.DynamoDB(optionsDynamodb);
const lambda = new aws.Lambda(optionsLambda);


// execution

exports.handler = (event, context, callback) => {

    let provider = arvUtils.getProviderFromUserName(event.userName);
    let hashKey = `${arvEnvs.pfx.USER}${event.request.userAttributes.email}`;
    let rangeKey = `${arvEnvs.pfx.METADATA}${event.request.userAttributes.email}`;
    let joinedOn = new Date().toISOString();
    let firstName = event.request.userAttributes.name;
    let lastName = event.request.userAttributes.family_name;
    let providers = [provider];
    let providerId = JSON.parse(`{"${provider}":{"S":"${event.userName}"}}`);
    let verified = provider === 'Cognito' ? false : true;
    let birthdate = event.request.userAttributes.birthdate;
    let gender = event.request.userAttributes.gender;
    let picture = event.request.userAttributes.picture;


    // validate nulls

    firstName = firstName ? firstName : '';
    lastName = lastName ? lastName : '';
    birthdate = birthdate ? birthdate : '';
    gender = gender ? gender : '';
    picture = picture ? picture : '';


    // set picture for Facebook

    if (picture) {
        picture =
            picture.substr(0, 5) === 'https'
                ? picture
                : JSON.parse(picture).data.url;
    }


    // validate if user already exist

    let params = { FunctionName: 'arv-get-user' };

    params.Payload = JSON.stringify({
        email: hashKey.split('#')[1],
    });


    lambda.invoke(params, function (err, data) {
        if (err) callback(err);
        else {

            const response = JSON.parse(data.Payload);

            // user exist

            if (
                Object.entries(response).length > 0 &&
                response.constructor === Object
            ) {
                let registeredProviders = response.providers;
                let registeredProviderId = JSON.parse(response.providerId);
                let registeredLastName = response.lastName;
                let registeredBirthdate = response.birthdate;
                let registeredGender = response.gender;
                let registeredPicture = response.picture;


                // event's provider already exist in user's providers

                if (registeredProviders.indexOf(provider) >= 0)
                    callback(null, event);


                // event's provider is not already registered

                else {

                    // event's provider belong to a social media

                    if (['Facebook', 'Google'].indexOf(provider) >= 0) {

                        // update provider

                        registeredProviders.push(provider);
                        registeredProviderId[provider] = JSON.parse(
                            `{"S":"${event.userName}"}`
                        );

                        // fill fields from social media provider, just in case

                        registeredLastName = registeredLastName
                            ? registeredLastName
                            : lastName;
                        registeredBirthdate = registeredBirthdate
                            ? registeredBirthdate
                            : birthdate;
                        registeredGender = registeredGender
                            ? registeredGender
                            : gender;
                        registeredPicture = registeredPicture
                            ? registeredPicture
                            : picture;

                        let params = { FunctionName: 'arv-update-user' };

                        params.Payload = JSON.stringify({
                            email       : hashKey.split('#')[1],
                            firstName   : response.firstName,
                            lastName    : registeredLastName,
                            birthdate   : registeredBirthdate,
                            gender      : registeredGender,
                            picture     : registeredPicture,
                            providers   : registeredProviders,
                            providerId  : JSON.stringify(registeredProviderId),
                            joinedOn    : response.joinedOn,
                            verified    : response.verified,
                        });


                        lambda.invoke(params, function (err, data) {
                            if (err) callback(err);
                            else {
                                if (process.env.RUN_MODE === 'LOCAL')
                                    callback(null, event);

                                // link accounts

                                let registeredUsername =
                                    event.request.userAttributes.email;


                                /**
                                 * If the user is not registered with Cognito
                                 * then the correspondent id of the social
                                 * network must be found
                                 */

                                if (
                                    registeredProviders.indexOf('Cognito') < 0
                                ) {
                                    registeredUsername =
                                        provider === 'Facebook'
                                            ? registeredProviderId.Google.S
                                            : registeredProviderId.Facebook.S;
                                }

                                let params = {
                                    Username    : registeredUsername,
                                    UserPoolId  : event.userPoolId,
                                };

                                // check if user is already verified

                                cognito.adminGetUser(
                                    params,

                                    function (err, data) {
                                        if (err) callback(err);
                                        else {

                                            /**
                                             * If not verified then verify
                                             * since the user is entering with a
                                             * social network and that verifies it
                                             */

                                            if (
                                                data.UserStatus ===
                                                'UNCONFIRMED'
                                            ) {
                                                cognito.adminConfirmSignUp(
                                                    params,

                                                    function (err, data) {
                                                        if (err) callback(err);
                                                        else {
                                                            params.UserAttributes = [
                                                                {
                                                                    Name    : 'email_verified',
                                                                    Value   : 'true',
                                                                },
                                                            ];

                                                            // verify email

                                                            cognito.adminUpdateUserAttributes(
                                                                params,
                                                                function (
                                                                    err,
                                                                    data
                                                                ) {
                                                                    if (err)
                                                                        callback(
                                                                            err
                                                                        );
                                                                    else
                                                                        fns.linkUser(
                                                                            cognito,
                                                                            registeredUsername,
                                                                            provider,
                                                                            event,
                                                                            callback
                                                                        );
                                                                }
                                                            );
                                                        }
                                                    }
                                                );
                                            } else
                                                fns.linkUser(
                                                    cognito,
                                                    registeredUsername,
                                                    provider,
                                                    event,
                                                    callback
                                                );
                                        }
                                    }
                                );
                            }
                        });
                    }

                    // event's provider is Cognito

                    else {

                        // '#' is used for split message from frontend

                        if (registeredProviders.length > 1) {
                            let err = new Error(
                                '#El correo ya se ha registrado con Facebook y Google.#'
                            );
                            callback(err, event);
                        }

                        else if (
                            registeredProviders.indexOf('Facebook') >= 0
                        ) {
                            let err = new Error(
                                '#El correo ya se ha registrado con Facebook.#'
                            );
                            callback(err, event);
                        }

                        else {
                            let err = new Error(
                                '#El correo ya se ha registrado con Google.#'
                            );
                            callback(err, event);
                        }
                    }
                }
            }

            // user doesn't exist

            else
                dql.addUser(
                    dynamodb,
                    process.env.DB_ARV_001,
                    hashKey,
                    rangeKey,
                    joinedOn,
                    firstName,
                    lastName,
                    providers,
                    providerId,
                    verified,
                    birthdate,
                    gender,
                    picture,

                    function (err, data) {
                        if (err) callback(err);
                        else callback(null, event);
                    }
                );
        }
    });
};
