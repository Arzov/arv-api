/**
 * Funciones
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Genera el enlace con una cuenta existente
 * @param {Object} cognito Conexion a Cognito
 * @param {String} registeredUsername Usuario registrado en Cognito
 * @param {String} provider Proveedor entrante
 * @param {Object} event Evento entrante
 * @param {Function} fn Funcion callback
 */
const linkUser = (cognito, registeredUsername, provider, event, fn) => {
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
        UserPoolId: event.userPoolId
    };

    cognito.adminLinkProviderForUser(params, function(err, data) {
        if (err) fn(err);
        else fn(null, event);
    });
}

module.exports.linkUser = linkUser
