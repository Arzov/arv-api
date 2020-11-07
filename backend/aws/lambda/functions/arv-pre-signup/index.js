/**
 * Registrar usuario
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const arvEnvs = require('arv-envs');
const dql = require('utils/dql');
const fns = require('utils/fns');
const arvUtils = require('arv-utils');
const moment = require('moment');
const cognito = new aws.CognitoIdentityServiceProvider();
let options = arvEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = arvEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);


exports.handler = (event, context, callback) => {
    let provider = arvUtils.getProviderFromUserName(event.userName);
    let hashKey = `${arvEnvs.pfx.USR}${event.request.userAttributes.email}`;
    let registerDate = moment().format();
    let firstName = event.request.userAttributes.name;
    let lastName = event.request.userAttributes.family_name;
    let providers = [provider];
    let providerId = JSON.parse(`{"${provider}":{"S":"${event.userName}"}}`);
    let verified = provider === 'Cognito' ? false : true;
    let birthdate = event.request.userAttributes.birthdate;
    let gender = event.request.userAttributes.gender;
    let picture = event.request.userAttributes.picture;

    // Verificar parametros nulos
    firstName = firstName ? firstName : '';
    lastName = lastName ? lastName : '';
    birthdate = birthdate ? birthdate : '';
    gender = gender ? gender : '';
    picture = picture ? picture : '';

    // Verificar imagen de Facebook
    if (picture) {
        picture = picture.substr(0, 5) === 'https' ? picture : JSON.parse(picture).data.url;
    }

    // Buscar si usuario existe en DynamoDB
    dql.getUser(dynamodb, process.env.DB_ARV_001, hashKey, hashKey, function(err, data) {
        if (err) callback(err);
        else {
            // El usuario existe
            if (Object.entries(data).length > 0 && data.constructor === Object) {
                let registeredProviders = data.Item.providers.SS;
                let registeredProviderId = data.Item.providerId.M;
                let registeredLastName = data.Item.lastName.S;
                let registeredBirthdate = data.Item.birthdate.S;
                let registeredGender = data.Item.gender.S;
                let registeredPicture = data.Item.picture.S;

                // Proveedor entrante existe registrado en el usuario
                if (registeredProviders.indexOf(provider) >= 0) callback(null, event);

                // Proveedor entrante no esta registrado
                else {
                    // Proveedor entrante es una red social
                    if (['Facebook', 'Google'].indexOf(provider) >= 0) {
                        // Actualizar proveedor
                        registeredProviders.push(provider);
                        registeredProviderId[provider] = JSON.parse(`{"S":"${event.userName}"}`);
                        registeredLastName = registeredLastName ? registeredLastName : lastName;
                        registeredBirthdate = registeredBirthdate ? registeredBirthdate : birthdate;
                        registeredGender = registeredGender ? registeredGender : gender;
                        registeredPicture = registeredPicture ? registeredPicture : picture;

                        dql.updateUser(dynamodb, process.env.DB_ARV_001, hashKey, hashKey, registeredProviders,
                            registeredProviderId, verified, registeredLastName,
                            registeredBirthdate, registeredGender, registeredPicture, function(err, data) {
                            if (err) callback(err);
                            else {
                                if (process.env.RUN_MODE === 'LOCAL') callback(null, event);

                                // Enlazar cuentas
                                let registeredUsername = event.request.userAttributes.email;

                                // Si el usuario no esta registrado con Cognito
                                // entonces se debe buscar el id de la red social
                                // correspondiente
                                if (registeredProviders.indexOf('Cognito') < 0) {
                                    registeredUsername = provider === 'Facebook' ?
                                        registeredProviderId.Google.S : registeredProviderId.Facebook.S;
                                }

                                let params = {
                                    Username: registeredUsername,
                                    UserPoolId: event.userPoolId
                                }

                                // Revisar primero si el usuario esta verificado
                                cognito.adminGetUser(params, function(err, data) {
                                    if (err) callback(err);
                                    else {
                                        // Si no esta verificado entonces verificar
                                        // ya que el usuario esta entrando con una
                                        // red social y eso lo verifica
                                        if (data.UserStatus === 'UNCONFIRMED') {
                                            cognito.adminConfirmSignUp(params, function(err, data) {
                                                if (err) callback(err);
                                                else
                                                    fns.linkUser(cognito, registeredUsername, provider,
                                                        event, callback);
                                            });
                                        } else 
                                            fns.linkUser(cognito, registeredUsername, provider,
                                                event, callback);
                                    };
                                });
                            }
                        });
                    }

                    // Proveedor entrante es Cognito
                    else {
                        // Se usa # para poder parsear mensaje en frontend
                        if (registeredProviders.length > 1) {
                            let err = new Error("#¡El email ya se ha registrado con Facebook y Google!#");
                            callback(err, event);
                        }
                        else if (registeredProviders.indexOf('Facebook') >= 0) {
                            let err = new Error("#¡El email ya se ha registrado con Facebook!#");
                            callback(err, event);
                        }
                        else {
                            let err = new Error("#¡El email ya se ha registrado con Google!#");
                            callback(err, event);
                        }
                    }
                }
            }

            // No existe el usuario
            else
                dql.addUser(dynamodb, process.env.DB_ARV_001, hashKey, hashKey, registerDate, firstName, lastName,
                    providers, providerId, verified, birthdate, gender, picture, function(err, data) {
                    if (err) callback(err);
                    else callback(null, event);
                });
        }
    });
};
