const aws = require('aws-sdk');
const arvEnvs = require('../../../layers/arv-envs/nodejs/node_modules/arv-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: arv-update-user', () => {
    let lambda = new aws.Lambda(arvEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'arv-update-user' };

    test('Evaluate: User (fjbarrientosg@gmail.com)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else expect(data.StatusCode).toBe(200);

            done();
        });
    }, 60000);
});
