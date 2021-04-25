/**
 * Test: arv-update-user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const arvEnvs = require('../../../layers/arv-envs/nodejs/node_modules/arv-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: arv-update-user', () => {

    let lambda = new aws.Lambda(arvEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'arv-update-user' };


    // test 1

    test('Evaluate: User (fjbarrientosg@gmail.com)', (done) => {

        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            }

            // success

            else expect(data.StatusCode).toBe(200);

            done();
        });
    }, 60000);
});
