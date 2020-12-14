/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Actualiza informacion del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {String} firstName Nombre
 * @param {String} lastName Apellido
 * @param {String} birthdate Fecha de nacimiento
 * @param {String} gender Sexo
 * @param {String} picture URL de la imagen de perfil
 * @param {Function} fn Funcion callback
 */
const updateUser = (db, tableName, hashKey, rangeKey, firstName, lastName, birthdate,
    gender, picture, fn) => {
    db.updateItem({
        TableName: tableName,
        Key: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey }
        },
        UpdateExpression: "set firstName = :v1, lastName = :v2, birthdate = :v3,\
            gender = :v4, picture = :v5",
        ExpressionAttributeValues: {
            ":v1": { S: firstName },
            ":v2": { S: lastName },
            ":v3": { S: birthdate },
            ":v4": { S: gender },
            ":v5": { S: picture }
        }
    }, function(err, data) {
        if (err) fn(err);
        else fn(null, {
            email: hashKey.split('#')[1],
            firstName,
            lastName,
            birthdate,
            gender,
            picture
        });
    });
}


module.exports.updateUser = updateUser
