
// Metodos generales
const mt = {
    /**
     * Actualizar usuario en AWS DynamoDB
     * @param {Object} db Conexion a DynamoDB
     * @param {String} tableName Nombre de la tabla
     * @param {String} hashKey Email del usuario
     * @param {Function} fn Función callback
     */
    updateUser: (db, tableName, hashKey, fn) => {
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
}

module.exports.mt = Object.create(mt)
