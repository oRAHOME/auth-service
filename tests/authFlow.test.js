const request = require('supertest');
const app = require('../app');
const pool = require('../db');

describe('Auth Flow Functional Test', () => {
  const testEmail = 'func_test@gmail.com';
  const testUsername = 'testuser';
  const testPassword = 'Password123@';

  // After everything, clean up the test user
  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
    await pool.end(); 
  });

  // Create a new user
  it('should register, login and access protected route', async () => {
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        username: testUsername,
        email: testEmail,
        password: testPassword,
      });

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.user.email).toBe(testEmail);
    
    // Login with the new user
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.accessToken).toBeTruthy();

    // Access the protected route using the token
    const token = loginRes.body.accessToken;
    const protectedRes = await request(app)
      .get('/auth/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(protectedRes.statusCode).toBe(200);
    expect(protectedRes.body.message).toBe('Authorized');
    expect(protectedRes.body.user).toBeDefined();
  });
});
