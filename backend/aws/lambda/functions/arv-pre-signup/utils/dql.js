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
        else fn(null, data);
    });
}

/**
 * Agrega un usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {String} registerDate Fecha de registro 'yyyy-mm-dd hh:mm:ss'
 * @param {String} firstName Nombre
 * @param {String} lastName Apellido
 * @param {String[]} providers Listado de proveedores (Google, Facebook, Cognito)
 * @param {Object} providerId Id de los distintos proveedores
 * @param {Boolean} verified Indicador (true: verificado, false: no verificado)
 * @param {String} birthdate Fecha de nacimiento 'yyyy-mm-dd'
 * @param {String} gender Sexo
 * @param {String} picture URL de la imagen de perfil
 * @param {Function} fn Funcion callback
 */
const addUser = (db, tableName, hashKey, rangeKey, registerDate, firstName, lastName, providers,
    providerId, verified, birthdate, gender, picture, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey },
            'registerDate': { S: registerDate },
            'firstName': { S: firstName },
            'lastName': { S: lastName },
            'providers': { SS: providers },
            'providerId': { M: providerId },
            'verified': { BOOL: verified },
            'birthdate': { S: birthdate },
            'gender': { S: gender },
            'picture': { S: picture }
        }
    }, function(err, data) {
        if (err) fn(err);
        else fn(null, data);
    });
}

/**
 * Actualiza informacion del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {String} lastName Apellido
 * @param {String[]} providers Listado de proveedores (Google, Facebook, Cognito)
 * @param {Object} providerId Id de los distintos proveedores
 * @param {Boolean} verified Indicador (true: verificado, false: no verificado)
 * @param {String} birthdate Fecha de nacimiento 'yyyy-mm-dd'
 * @param {String} gender Sexo
 * @param {String} picture URL de la imagen de perfil
 * @param {Function} fn Funcion callback
 */
const updateUser = (db, tableName, hashKey, rangeKey, providers, providerId, verified,
    lastName, birthdate, gender, picture, fn) => {
    db.updateItem({
        TableName: tableName,
        Key: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey }
        },
        UpdateExpression: 'set providers = :v1, providerId = :v2, verified = :v3, lastName = :v4,\
            birthdate = :v5, gender = :v6, picture = :v7',
        ExpressionAttributeValues: {
            ':v1': { SS: providers },
            ':v2': { M: providerId },
            ':v3': { BOOL: verified },
            ':v4': { S: lastName },
            ':v5': { S: birthdate },
            ':v6': { S: gender },
            ':v7': { S: picture }
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
