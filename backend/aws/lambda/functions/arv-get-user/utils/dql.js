/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene informacion del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {Function} fn Funcion callback
 */
const getUser = (db, tableName, hashKey, rangeKey, fn) => {
    db.getItem({
        TableName: tableName,
        Key: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey }
        }
    }, function(err, data) {
        if (err) return fn(err);
        else
            fn(null, {
                email: data.Item.hashKey.S.split('#')[1],
                firstName: data.Item.firstName.S,
                lastName: data.Item.lastName.S,
                providerId: data.Item.providerId.M,
                providers: data.Item.providers.SS,
                registerDate: data.Item.registerDate.S,
                verified: data.Item.verified.BOOL,
                birthdate: data.Item.birthdate.S,
                gender: data.Item.birthdate.S,
                picture: data.Item.birthdate.S
            });
    });
}

module.exports.getUser = getUser
