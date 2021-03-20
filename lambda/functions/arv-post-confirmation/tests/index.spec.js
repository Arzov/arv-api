const aws = require('aws-sdk');
const arvEnvs = require('../../../layers/arv-envs/nodejs/node_modules/arv-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: arv-post-confirmation', () => {
    let lambda = new aws.Lambda(arvEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'arv-post-confirmation' };

    test('Evaluate: Google User (fjbarrientosg@gmail.com)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.region).toBe('us-east-1');
                expect(response.triggerSource).toBe(
                    'PostConfirmation_ConfirmSignUp'
                );
                expect(response.userName).toBe('Google_115619098971084199595');
                expect(response.request.userAttributes.email).toBe(
                    'fjbarrientosg@gmail.com'
                );
                expect(response.request.userAttributes.name).toBe('Franco');
                expect(response.request.userAttributes.family_name).toBe(
                    'Barrientos'
                );
            }

            done();
        });
    }, 60000);

    test('Evaluate: Facebook User (fjbarrientosg@gmail.com)', (done) => {
        params.Payload = JSON.stringify(events[1]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.region).toBe('us-east-1');
                expect(response.triggerSource).toBe(
                    'PostConfirmation_ConfirmSignUp'
                );
                expect(response.userName).toBe('Facebook_10217846363663521');
                expect(response.request.userAttributes.email).toBe(
                    'fjbarrientosg@gmail.com'
                );
                expect(response.request.userAttributes.name).toBe('Franco');
                expect(response.request.userAttributes.family_name).toBe(
                    'Barrientos'
                );
            }

            done();
        });
    }, 60000);

    test('Evaluate: Cognito User (franco.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[2]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.region).toBe('us-east-1');
                expect(response.triggerSource).toBe(
                    'PostConfirmation_ConfirmSignUp'
                );
                expect(response.userName).toBe('franco.barrientos@arzov.com');
                expect(response.request.userAttributes.email).toBe(
                    'franco.barrientos@arzov.com'
                );
                expect(response.request.userAttributes.email_verified).toBe(
                    'true'
                );
                expect(response.request.userAttributes.name).toBe('Franco');
                expect(response.request.userAttributes.gender).toBe('M');
                expect(response.request.userAttributes.birthdate).toBe(
                    '1989-05-15'
                );
            }

            done();
        });
    }, 60000);
});
