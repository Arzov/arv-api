const aws = require('aws-sdk')
const arvEnvs = require('../../../layers/arv-envs/nodejs/node_modules/arv-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')
const event04 = require('../events/event04.json')

describe('Test AWS Lambda: arv-auth-pre-signup', () => {

  let lambda = new aws.Lambda(arvEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'arv-auth-pre-signup'}

  test('Respuesta desde AWS: Usuario Google (fjbarrientosg@gmail.com)', (done) => {

    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.region).toBe('us-east-1')
        expect(response.triggerSource).toBe('PreSignUp_ExternalProvider')
        expect(response.userName).toBe('Google_115619098971084199595')
        expect(response.request.userAttributes.email).toBe('fjbarrientosg@gmail.com')
        expect(response.request.userAttributes.name).toBe('Franco')
        expect(response.request.userAttributes.family_name).toBe('Barrientos')
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
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.region).toBe('us-east-1')
        expect(response.triggerSource).toBe('PreSignUp_ExternalProvider')
        expect(response.userName).toBe('Facebook_10217846363663521')
        expect(response.request.userAttributes.email).toBe('fjbarrientosg@gmail.com')
        expect(response.request.userAttributes.name).toBe('Franco')
        expect(response.request.userAttributes.family_name).toBe('Barrientos')
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
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.errorMessage).toBe('#¡El email ya se ha registrado con Facebook y Google!#')
        expect(response.errorType).toBe('Error')
      }

      done()
    })
  }, 60000)

  test('Respuesta desde AWS: Usuario Cognito (franco.barrientos@arzov.com)', (done) => {

    params.Payload = JSON.stringify(event04)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.region).toBe('us-east-1')
        expect(response.triggerSource).toBe('PreSignUp_SignUp')
        expect(response.userName).toBe('franco.barrientos@arzov.com')
        expect(response.request.userAttributes.email).toBe('franco.barrientos@arzov.com')
        expect(response.request.userAttributes.name).toBe('Franco')
        expect(response.request.userAttributes.birthdate).toBe('1989-05-15')
        expect(response.request.userAttributes.gender).toBe('M')
      }

      done()
    })
  }, 60000)

})