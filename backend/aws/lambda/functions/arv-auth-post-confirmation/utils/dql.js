/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Actualiza información del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {Function} fn Función callback
 */
const updateUser = (db, tableName, hashKey, rangeKey, fn) => {
    db.updateItem({
        TableName: tableName,
        Key: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey }
        },
        UpdateExpression: "set verified = :v1",
        ExpressionAttributeValues: {
            ":v1": { BOOL: true }
        }
    },
    function(err, data) {
        if (err) fn(err);
        else fn(null, data);
    });
}

module.exports.updateUser = updateUser
