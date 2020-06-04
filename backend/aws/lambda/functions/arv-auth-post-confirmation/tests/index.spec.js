const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')

describe('Test AWS Lambda: arv-auth-post-confirmation', () => {

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
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.region).toBe('us-east-2')
        expect(response.triggerSource).toBe('PostConfirmation_ConfirmSignUp')
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
        expect(response.region).toBe('us-east-2')
        expect(response.triggerSource).toBe('PostConfirmation_ConfirmSignUp')
        expect(response.userName).toBe('Facebook_10217846363663521')
        expect(response.request.userAttributes.email).toBe('fjbarrientosg@gmail.com')
        expect(response.request.userAttributes.name).toBe('Franco')
        expect(response.request.userAttributes.family_name).toBe('Barrientos')
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
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.region).toBe('us-east-2')
        expect(response.triggerSource).toBe('PostConfirmation_ConfirmSignUp')
        expect(response.userName).toBe('franco.barrientos@arzov.com')
        expect(response.request.userAttributes.email).toBe('franco.barrientos@arzov.com')
        expect(response.request.userAttributes.email_verified).toBe('true')
        expect(response.request.userAttributes.name).toBe('Franco')
        expect(response.request.userAttributes.gender).toBe('M')
        expect(response.request.userAttributes.birthdate).toBe('1989-05-15')
      }

      done()
    })
  }, 60000)

})