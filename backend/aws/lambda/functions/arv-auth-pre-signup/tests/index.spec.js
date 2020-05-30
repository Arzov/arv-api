const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')

describe("Test AWS Lambda: arv-auth-pre-signup", () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-2',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'arv-auth-pre-signup'
  }

  test('Respuesta desde AWS: Usuario Google (fjbarrientosg@gmail.com)', (done) => {

    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        expect(data.StatusCode).toBe(200)
        expect(data.Payload).toBe('{"version":"1","region":"us-east-2","userPoolId":"us-east-2_qutDL1uPU","userName":"Google_115619098971084199595","callerContext":{"awsSdkVersion":"aws-sdk-unknown-unknown","clientId":"15metijanb2iq6a016tqk832ek"},"triggerSource":"PreSignUp_ExternalProvider","request":{"userAttributes":{"cognito:email_alias":"","name":"Franco","cognito:phone_number_alias":"","family_name":"Barrientos","email":"fjbarrientosg@gmail.com","picture":"https://lh3.googleusercontent.com/a-/AOh14GgWjEj2cnH3clfJHqQiMnQ7yqFiZ3ImefchqcWxPQ=s96-c"},"validationData":{}},"response":{"autoConfirmUser":false,"autoVerifyEmail":false,"autoVerifyPhone":false}}')
      }

      done()
    })
  }, 60000)

  test('Respuesta desde AWS: Usuario Facebook (fjbarrientosg@gmail.com)', (done) => {

    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        expect(data.StatusCode).toBe(200)
        expect(data.Payload).toBe('{"version":"1","region":"us-east-2","userPoolId":"us-east-2_qutDL1uPU","userName":"Facebook_10217846363663521","callerContext":{"awsSdkVersion":"aws-sdk-unknown-unknown","clientId":"15metijanb2iq6a016tqk832ek"},"triggerSource":"PreSignUp_ExternalProvider","request":{"userAttributes":{"cognito:email_alias":"","name":"Franco","cognito:phone_number_alias":"","family_name":"Barrientos","email":"fjbarrientosg@gmail.com","picture":"{\\"data\\":{\\"height\\":50,\\"is_silhouette\\":false,\\"url\\":\\"https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10217846363663521\\u0026height=50\\u0026width=50\\u0026ext=1593462184\\u0026hash=AeT6ufYDgveULGEG\\",\\"width\\":50}}"},"validationData":{}},"response":{"autoConfirmUser":false,"autoVerifyEmail":false,"autoVerifyPhone":false}}')
      }

      done()
    })
  }, 60000)

  test('Respuesta desde AWS: Usuario Cognito (fjbarrientosg@gmail.com)', (done) => {

    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        expect(data.StatusCode).toBe(200)
        expect(data.Payload).toBe('{"errorType":"Error","errorMessage":"#¡El email ya se ha registrado con Facebook y Google!#"}')
      }

      done()
    })
  }, 60000)

})