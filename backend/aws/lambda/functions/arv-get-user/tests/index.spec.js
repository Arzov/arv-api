const aws = require('aws-sdk')
const arvEnvs = require('../../../layers/arv-envs/nodejs/node_modules/arv-envs')
const event = require('../events/event.json')

describe('Test AWS Lambda: arv-get-user', () => {

  let lambda = new aws.Lambda(arvEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'arv-get-user'}

  test('Respuesta desde AWS: Usuario fjbarrientosg@gmail.com', (done) => {

    params.Payload = JSON.stringify(event)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('fjbarrientosg@gmail.com')
        expect(response.firstName).toBe('Franco')
        expect(response.lastName).toBe('Barrientos')
        expect(response.gender).toBe('')
        expect(response.verified).toBe(true)
        expect(response.birthdate).toBe('')
        expect(response.providerId).toStrictEqual({ Google: { S: 'Google_115619098971084199595' },
          Facebook:{ S: 'Facebook_10217846363663521' } })
      }

      done()
    })
  }, 60000)
})