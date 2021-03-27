/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Add user
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {String} registerDate Resgister date
 * @param {String} firstName Firstname
 * @param {String} lastName Lastname
 * @param {String[]} providers Providers list (Google, Facebook, Cognito)
 * @param {Object} providerId Providers id
 * @param {Boolean} verified Verified indicator
 * @param {String} birthdate Birthdate 'yyyy-mm-dd'
 * @param {String} gender Gender
 * @param {String} picture Picture URL
 * @param {Function} fn Callback
 */
const addUser = (
    db,
    tableName,
    hashKey,
    rangeKey,
    registerDate,
    firstName,
    lastName,
    providers,
    providerId,
    verified,
    birthdate,
    gender,
    picture,
    fn
) => {
    db.putItem(
        {
            TableName: tableName,
            Item: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
                registerDate: { S: registerDate },
                firstName: { S: firstName },
                lastName: { S: lastName },
                providers: { SS: providers },
                providerId: { M: providerId },
                verified: { BOOL: verified },
                birthdate: { S: birthdate },
                gender: { S: gender },
                picture: { S: picture },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else fn(null, data);
        }
    );
};

module.exports.addUser = addUser;
