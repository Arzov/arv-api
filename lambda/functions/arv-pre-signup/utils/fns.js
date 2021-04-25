/**
 * Functions
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// functions

/**
 * Create link with a existing account
 * @param   {Object}    cognito             Cognito client
 * @param   {String}    registeredUsername  Cognito username
 * @param   {String}    provider            Event's provider
 * @param   {Object}    event               Event
 * @param   {Function}  fn                  Callback
 */
const linkUser = (cognito, registeredUsername, provider, event, fn) => {

    let params = {
        DestinationUser: {
            ProviderAttributeName: '',
            ProviderAttributeValue: registeredUsername,
            ProviderName: 'Cognito',
        },
        SourceUser: {
            ProviderAttributeName: 'Cognito_Subject',
            ProviderAttributeValue: event.userName,
            ProviderName: provider,
        },
        UserPoolId: event.userPoolId,
    };

    cognito.adminLinkProviderForUser(params, function (err, data) {
        if (err) fn(err);
        else fn(null, event);
    });
};


// export modules

module.exports.linkUser = linkUser;
