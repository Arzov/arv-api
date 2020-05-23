const arv_env = require('../index');

test('Nombre de tablas correctos', () => {
  expect(arv_env.dt.ARV_USERS).toBe('ARV_USERS')
})