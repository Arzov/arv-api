const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')

describe("Test AWS Lambda: arv-auth-post-confirmation", () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-2',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'arv-auth-post-confirmation'
  }

  test('Respuesta desde AWS: Usuario Google (fjbarrientosg@gmail.com)', (done) => {

    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        expect(data.StatusCode).toBe(200)
        expect(data.Payload).toBe('{"version":"1","region":"us-east-2","userPoolId":"us-east-2_qutDL1uPU","userName":"Google_115619098971084199595","callerContext":{"awsSdkVersion":"aws-sdk-unknown-unknown","clientId":"15metijanb2iq6a016tqk832ek"},"triggerSource":"PostConfirmation_ConfirmSignUp","request":{"userAttributes":{"sub":"81ce6d09-d419-4390-b138-68d6619bb589","identities":"[{\\"userId\\":\\"115619098971084199595\\",\\"providerName\\":\\"Google\\",\\"providerType\\":\\"Google\\",\\"issuer\\":null,\\"primary\\":true,\\"dateCreated\\":1590851317883}]","cognito:user_status":"EXTERNAL_PROVIDER","name":"Franco","family_name":"Barrientos","picture":"https://lh3.googleusercontent.com/a-/AOh14GgWjEj2cnH3clfJHqQiMnQ7yqFiZ3ImefchqcWxPQ=s96-c","email":"fjbarrientosg@gmail.com"}},"response":{}}')
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
        expect(data.Payload).toBe('{"version":"1","region":"us-east-2","userPoolId":"us-east-2_qutDL1uPU","userName":"Facebook_10217846363663521","callerContext":{"awsSdkVersion":"aws-sdk-unknown-unknown","clientId":"15metijanb2iq6a016tqk832ek"},"triggerSource":"PostConfirmation_ConfirmSignUp","request":{"userAttributes":{"sub":"aa5cf9da-6aa5-47c1-a6c2-4195f5cbd01d","identities":"[{\\"userId\\":\\"10217846363663521\\",\\"providerName\\":\\"Facebook\\",\\"providerType\\":\\"Facebook\\",\\"issuer\\":null,\\"primary\\":true,\\"dateCreated\\":1590870187937}]","cognito:user_status":"EXTERNAL_PROVIDER","name":"Franco","family_name":"Barrientos","picture":"{\\"data\\":{\\"height\\":50,\\"is_silhouette\\":false,\\"url\\":\\"https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10217846363663521\\u0026height=50\\u0026width=50\\u0026ext=1593462184\\u0026hash=AeT6ufYDgveULGEG\\",\\"width\\":50}}","email":"fjbarrientosg@gmail.com"}},"response":{}}')
      }

      done()
    })
  }, 60000)

  test('Respuesta desde AWS: Usuario Cognito (franco.barrientos@arzov.com)', (done) => {

    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        expect(data.StatusCode).toBe(200)
        expect(data.Payload).toBe('{"version":"1","region":"us-east-2","userPoolId":"us-east-2_qutDL1uPU","userName":"franco.barrientos@arzov.com","callerContext":{"awsSdkVersion":"aws-sdk-unknown-unknown","clientId":"15metijanb2iq6a016tqk832ek"},"triggerSource":"PostConfirmation_ConfirmSignUp","request":{"userAttributes":{"sub":"bb366753-511c-4d47-b13c-09747a2bcc2d","cognito:user_status":"CONFIRMED","email_verified":"true","birthdate":"1989-05-15","gender":"M","name":"Franco","email":"franco.barrientos@arzov.com"}},"response":{}}')
      }

      done()
    })
  }, 60000)

})