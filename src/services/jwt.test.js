const { JsonWebTokenError } = require('jsonwebtoken');
const moment = require('moment');

describe('Jwt services test', () => {
  it('decode valid token', async () => {
    const { createToken, decodeToken } = require('./jwt');
    const token = await createToken(
      { id: '1', email: 'coreo@correo.com' },
      '12'
    );

    const payload = decodeToken(token);
    expect(payload.exp).toBeLessThanOrEqual(moment().unix());
  });
});
