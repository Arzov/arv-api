/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Update user
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {String} firstName Firstname
 * @param {String} lastName Lastname
 * @param {String} joinedOn Register date
 * @param {String[]} providers Providers list (Google, Facebook, Cognito)
 * @param {Object} providerId Providers id
 * @param {Boolean} verified Verified indicator
 * @param {String} birthdate Birthdate 'yyyy-mm-dd'
 * @param {String} gender Gender
 * @param {String} picture Picture URL
 * @param {Function} fn Callback
 */
const updateUser = (
    db,
    tableName,
    hashKey,
    rangeKey,
    providers,
    providerId,
    verified,
    firstName,
    lastName,
    joinedOn,
    birthdate,
    gender,
    picture,
    fn
) => {
    db.updateItem(
        {
            TableName: tableName,
            Key: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
            },
            UpdateExpression:
                'set providers = :v1, \
                providerId = :v2, \
                verified = :v3,\
                firstName = :v4,\
                lastName = :v5,\
                joinedOn = :v6, \
                birthdate = :v7, \
                gender = :v8, \
                picture = :v9',
            ExpressionAttributeValues: {
                ':v1': { SS: providers },
                ':v2': { M: providerId },
                ':v3': { BOOL: verified },
                ':v4': { S: firstName },
                ':v5': { S: lastName },
                ':v6': { S: joinedOn },
                ':v7': { S: birthdate },
                ':v8': { S: gender },
                ':v9': { S: picture },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    email: hashKey.split('#')[1],
                    firstName,
                    lastName,
                    joinedOn,
                    birthdate,
                    gender,
                    picture,
                    providers,
                    providerId,
                    verified,
                });
        }
    );
};

module.exports.updateUser = updateUser;
