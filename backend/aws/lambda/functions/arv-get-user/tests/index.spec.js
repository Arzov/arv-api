const aws = require('aws-sdk')
const event = require('../events/event.json')

describe('Test AWS Lambda: arv-get-user', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'arv-get-user'
  }

  test('Respuesta desde AWS: Usuario fjbarrientosg@gmail.com', (done) => {

    params.Payload = JSON.stringify(event)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.hashKey).toBe('fjbarrientosg@gmail.com')
        expect(response.firstName).toBe('Franco')
        expect(response.lastName).toBe('Barrientos')
        expect(JSON.stringify(response.providerId)).toBe('{"Google":{"S":"Google_115619098971084199595"},"Facebook":{"S":"Facebook_10217846363663521"}}')
      }

      done()
    })
  }, 60000)
})