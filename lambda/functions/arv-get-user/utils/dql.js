/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Get user
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Email
 * @param   {String}    rangeKey    Email
 * @param   {Function}  fn          Callback
 */
const getUser = (db, tableName, hashKey, rangeKey, fn) => {

    db.getItem(
        {
            TableName: tableName,
            Key: {
                hashKey     : { S: hashKey },
                rangeKey    : { S: rangeKey },
            },
        },

        function (err, data) {

            // error

            if (err) return fn(err);

            // return empty object

            else if (
                Object.keys(data).length === 0 &&
                data.constructor === Object
            ) {
                fn(null, {});
            }

            // return resutl

            else {
                fn(null, {
                    email       : data.Item.hashKey.S.split('#')[1],
                    firstName   : data.Item.firstName.S,
                    lastName    : data.Item.lastName.S,
                    providerId  : JSON.stringify(data.Item.providerId.M),
                    providers   : data.Item.providers.SS,
                    joinedOn    : data.Item.joinedOn.S,
                    verified    : data.Item.verified.BOOL,
                    birthdate   : data.Item.birthdate.S,
                    gender      : data.Item.gender.S,
                    picture     : data.Item.picture.S,
                });
            }
        }
    );
};


// export modules

module.exports.getUser = getUser;
