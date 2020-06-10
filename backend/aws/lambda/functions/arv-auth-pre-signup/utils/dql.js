/**
 * Queries sobre AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene información del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {Function} fn Función callback
 */
const getUser = (db, tableName, hashKey, fn) => {
    db.getItem({
        TableName: tableName,
        Key: { "hashKey": { S: hashKey } }
    }, function(err, data) {
        if (err) return fn(err);
        else fn(null, data);
    });
}

/**
 * Agrega un usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {String} registerDate Fecha de registro 'yyyy-mm-dd hh:mm:ss'
 * @param {String} firstName Nombre del usuario
 * @param {String} lastName Apellido del usuario
 * @param {String[]} providers Listado de proveedores (Google, Facebook, Cognito)
 * @param {String} providerId Id de los distintos proveedores
 * @param {Boolean} verified Indicador (true: verificado, false: no verificado)
 * @param {String} birthdate Fecha de nacimiento 'yyyy-mm-dd hh:mm:ss'
 * @param {String} gender Sexo del usuario
 * @param {String} picture URL imagen de perfil
 * @param {Function} fn Función callback
 */
const addUser = (db, tableName, hashKey, registerDate, firstName, lastName, providers,
    providerId, verified, birthdate, gender, picture, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            "hashKey": { S: hashKey },
            "registerDate": { S: registerDate },
            "firstName": { S: firstName },
            "lastName": { S: lastName },
            "providers": { SS: providers },
            "providerId": { S: providerId },
            "verified": { BOOL: verified },
            "birthdate": { S: birthdate },
            "gender": { S: gender },
            "picture": { S: picture }
        }
    }, function(err, data) {
        if (err) fn(err);
        else fn(null, data);
    });
}

/**
 * Actualiza información del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {String} lastName Apellido del usuario
 * @param {String[]} providers Listado de proveedores (Google, Facebook, Cognito)
 * @param {String} providerId Id de los distintos proveedores
 * @param {Boolean} verified Indicador (true: verificado, false: no verificado)
 * @param {String} birthdate Fecha de nacimiento 'yyyy-mm-dd hh:mm:ss'
 * @param {String} gender Sexo del usuario
 * @param {String} picture URL imagen de perfil
 * @param {Function} fn Función callback
 */
const updateUser = (db, tableName, hashKey, providers, providerId, verified, lastName, birthdate,
    gender, picture, fn) => {
    db.updateItem({
        TableName: tableName,
        Key: { "hashKey": { S: hashKey } },
        UpdateExpression: "set providers = :v1, providerId = :v2, verified = :v3, lastName = :v4, birthdate = :v5, gender = :v6, picture = :v7",
        ExpressionAttributeValues: {
            ":v1": { SS: providers },
            ":v2": { S: providerId },
            ":v3": { BOOL: verified },
            ":v4": { S: lastName },
            ":v5": { S: birthdate },
            ":v6": { S: gender },
            ":v7": { S: picture }
        }
    },
    function(err, data) {
        if (err) fn(err);
        else fn(null, data);
    });
}

module.exports.getUser = getUser
module.exports.addUser = addUser
module.exports.updateUser = updateUser
