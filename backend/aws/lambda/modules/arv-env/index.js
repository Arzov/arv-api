/**
 * Variables de entorno para funciones AWS Lambda
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// AWS DynamoDB
const db = {
    ARV_USERS: 'ARV_USERS'
}

// AWS Cognito
const cg = {
    ARV_USER_POOL_CLI_ID: '15metijanb2iq6a016tqk832ek',
    ARV_USER_POOL_ID: 'us-east-2_qutDL1uPU'
}

module.exports.db = Object.create(db)
module.exports.cg = Object.create(cg)