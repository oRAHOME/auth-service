jest.mock('./db.js');
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('testpassword'),
  compare: jest.fn().mockResolvedValue(true)
}))
const request = require('supertest');
const app = require("./app");
const pool = require('./db');

describe('POST /auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should return 201 and a user object', async () => { 
    const newUser = {
      id: 1, 
      username: 'testuser',
      email: 'testemail@gmail.com',
      password_hash: 'testpassword',
      inserted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    pool.query
    .mockResolvedValueOnce({ rows: []}) // To handle getUserByEmail
    .mockResolvedValueOnce({ rows: [newUser]});

    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'testemail@gmail.com',
        password: 'testpassword'
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('User created');
      expect(response.body.user).toEqual(newUser);
  })
});

describe('POST /auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should return 201 and an access token', async () => {
    const user = {
      id: 1, 
      username: 'testuser',
      email: 'testemail@gmail.com',
      password_hash: 'testpassword',
      inserted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    pool.query
    .mockResolvedValueOnce({ rows: [user]});

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'testemail@gmail.com',
        password: 'testpassword'
      })

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeTruthy();
    expect(response.body.refreshToken).toBeTruthy();  
  })
})

