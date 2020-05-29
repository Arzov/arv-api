const arv_env = require('../index')

test('Variables AWS DynamoDB', () => {
  expect(arv_env.db.ARV_USERS).toBe('ARV_USERS')
})

test('Variables AWS Cognito', () => {
  expect(arv_env.cg.ARV_USER_POOL_CLI_ID).toBe('15metijanb2iq6a016tqk832ek')
  expect(arv_env.cg.ARV_USER_POOL_ID).toBe('us-east-2_qutDL1uPU')
})