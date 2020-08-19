const aws = require('aws-sdk')
const event = require('../events/event.json')

describe('Test AWS Lambda: arv-update-user', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'arv-update-user'
  }

  test('Respuesta desde AWS: Usuario fjbarrientosg@gmail.com', (done) => {

    params.Payload = JSON.stringify(event)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else expect(data.StatusCode).toBe(200)

      done()
    })
  }, 60000)
})