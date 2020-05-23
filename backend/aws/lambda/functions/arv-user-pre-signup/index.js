// LIBRERIAS
const AWS = require('aws-sdk');
const moment = require('moment');

// PARAMETROS
const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB();
const COGNITO_USER_POOL_CLI_ID = '15metijanb2iq6a016tqk832ek';
const COGNITO_USER_POOL_ID = 'us-east-2_qutDL1uPU';
const DYNAMO_TABLE_USERS = 'ARV_USERS';

// FUNCIONES
function getUser(tableName, hashKey, fn) {
    dynamodb.getItem({
        TableName: tableName,
        Key: {
            "hashKey": {
                S: hashKey
            }
        }
    }, function(err, data) {
        if (err) return fn(err);
        else fn(null, data);
    });
}

function addUser(tableName, hashKey, registerDate, firstName, lastName, providers, providerId, verified, birthdate, gender, picture, fn) {
    dynamodb.putItem({
        TableName: tableName,
        Item: {
            "hashKey": {
                S: hashKey
            },
            "registerDate": {
                S: registerDate
            },
            "firstName": {
                S: firstName
            },
            "lastName": {
                S: lastName
            },
            "providers": {
                SS: providers
            },
            "providerId": {
                S: providerId
            },
            "verified": {
                BOOL: verified
            },
            "birthdate": {
                S: birthdate
            },
            "gender": {
                S: gender
            },
            "picture": {
                S: picture
            }
        }
    }, function(err, data) {
        if (err) return fn(err);
        else fn(null, data);
    });
}

function updateUser(tableName, hashKey, providers, providerId, verified, lastName, birthdate, gender, picture, fn) {
    dynamodb.updateItem({
            TableName: tableName,
            Key: {
                "hashKey": {
                    S: hashKey
                }
            },
            UpdateExpression: "set providers = :v1, providerId = :v2, verified = :v3, lastName = :v4, birthdate = :v5, gender = :v6, picture = :v7",
            ExpressionAttributeValues: {
                ":v1": {
                    SS: providers
                },
                ":v2": {
                    S: providerId
                },
                ":v3": {
                    BOOL: verified
                },
                ":v4": {
                    S: lastName
                },
                ":v5": {
                    S: birthdate
                },
                ":v6": {
                    S: gender
                },
                ":v7": {
                    S: picture
                }
            }
        },
        function(err, data) {
            if (err) return fn(err);
            else fn(null, data);
        });
}



// HANDLER
exports.handler = (event, context, callback) => {
    // Parametros del usuario
    let provider = event.userName.includes('@') ? 'Cognito' :
        event.userName.split('_')[0];
    let hashKey = event.request.userAttributes.email;
    let registerDate = moment().format();
    let firstName = event.request.userAttributes.name;
    let lastName = event.request.userAttributes.family_name;
    let providers = [provider];
    let providerId = '{"' + provider + '": "' + event.userName + '"}';
    let verified = provider === 'Cognito' ? false : true;
    let birthdate = event.request.userAttributes.birthdate;
    let gender = event.request.userAttributes.gender;
    let picture = event.request.userAttributes.picture;

    // Verificar parametros nulos
    firstName = firstName ? firstName : ' ';
    lastName = lastName ? lastName : ' ';
    birthdate = birthdate ? birthdate : ' ';
    gender = gender ? gender : ' ';
    picture = picture ? picture : ' ';

    // Verificar imagen de Facebook
    if (picture != ' ') {
        picture = picture.substr(0, 5) === 'https' ? picture : JSON.parse(picture).data.url;
    }

    // Verifica user pool
    if (event.callerContext.clientId === COGNITO_USER_POOL_CLI_ID) {
        // Buscar si usuario existe en DynamoDB
        getUser(DYNAMO_TABLE_USERS, hashKey, function(err, data) {
            if (err) console.log(err);
            else {
                // El usuario existe
                if (Object.entries(data).length > 0 && data.constructor === Object) {
                    let registeredProviders = data.Item.providers.SS;
                    let registeredProviderId = JSON.parse(data.Item.providerId.S);
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
                            registeredProviderId[provider] = event.userName;
                            registeredLastName = registeredLastName === ' ' ? lastName : registeredLastName;
                            registeredBirthdate = registeredBirthdate === ' ' ? birthdate : registeredBirthdate;
                            registeredGender = registeredGender === ' ' ? gender : registeredGender;
                            registeredPicture = registeredPicture === ' ' ? picture : registeredPicture;

                            updateUser(DYNAMO_TABLE_USERS, hashKey, registeredProviders, JSON.stringify(registeredProviderId), verified, registeredLastName, registeredBirthdate, registeredGender, registeredPicture, function(err, data) {
                                if (err) console.log(err);
                                else {
                                    // Enlazar cuentas
                                    let registeredUsername = hashKey;

                                    if (registeredProviders.indexOf('Cognito') < 0) {
                                        registeredUsername = provider === 'Facebook' ? registeredProviderId['Google'] : registeredProviderId['Facebook'];
                                    }

                                    let params = {
                                        DestinationUser: {
                                            ProviderAttributeName: '',
                                            ProviderAttributeValue: registeredUsername,
                                            ProviderName: 'Cognito'
                                        },
                                        SourceUser: {
                                            ProviderAttributeName: 'Cognito_Subject',
                                            ProviderAttributeValue: event.userName,
                                            ProviderName: provider
                                        },
                                        UserPoolId: COGNITO_USER_POOL_ID
                                    };

                                    // Se enlaza al usuario
                                    cognito.adminLinkProviderForUser(params, function(err, data) {
                                        if (err) console.log(err);
                                        else callback(null, event);
                                    });
                                }
                            });
                        }

                        // Proveedor entrante es Cognito
                        else {
                            // Se usa # para poder parsear mensaje en frontend
                            if (registeredProviders.length > 1) {
                                let error = new Error("#¡El email ya se ha registrado con Facebook y Google!#");
                                callback(error, event);
                            }
                            else if (registeredProviders.indexOf('Facebook') >= 0) {
                                let error = new Error("#¡El email ya se ha registrado con Facebook!#");
                                callback(error, event);
                            }
                            else {
                                let error = new Error("#¡El email ya se ha registrado con Google!#");
                                callback(error, event);
                            }
                        }
                    }
                }

                // No existe el usuario
                else {
                    addUser(DYNAMO_TABLE_USERS, hashKey, registerDate, firstName, lastName, providers, providerId, verified, birthdate, gender, picture, function(err, data) {
                        if (err) console.log(err);
                        else callback(null, event);
                    });
                }
            }
        });
    }
};
