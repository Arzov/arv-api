/**
 * Test: arv-get-user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const arvEnvs = require('../../../layers/arv-envs/nodejs/node_modules/arv-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: arv-get-user', () => {

    let lambda = new aws.Lambda(arvEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'arv-get-user' };


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

            else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.email).toBe('fjbarrientosg@gmail.com');
                expect(response.firstName).toBe('Franco');
                expect(response.lastName).toBe('Barrientos');
                expect(response.gender).toBe('');
                expect(response.verified).toBe(true);
                expect(response.birthdate).toBe('');
                expect(JSON.parse(response.providerId)).toStrictEqual({
                    Google: { S: 'Google_115619098971084199595' },
                    Facebook: { S: 'Facebook_10217846363663521' },
                });
            }

            done();
        });
    }, 60000);
});
