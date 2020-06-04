/**
 * Queries sobre AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Actualiza información del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {Function} fn Función callback
 */
const updateUser = (db, tableName, hashKey, fn) => {
    db.updateItem({
        TableName: tableName,
        Key: { "hashKey": { S: hashKey } },
        UpdateExpression: "set verified = :v1",
        ExpressionAttributeValues: {
            ":v1": { BOOL: true }
        }
    },
    function(err, data) {
        if (err) return fn(err);
        else fn(null, data);
    });
}

module.exports.updateUser = updateUser
