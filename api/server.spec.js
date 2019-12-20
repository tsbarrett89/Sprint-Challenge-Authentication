const request = require("supertest");

const server = require("./server.js");

const db = require('../database/dbconfig.js')

beforeEach(async () => {
  await db('users').truncate()
})

describe('server.js', () => {
  describe('register route', () => {
    it('should send status 404 if username and password are not given', () => {
      return request(server)
        .post('/api/auth/register')
        .then(res => expect(res.status).toBe(404))
    })

    it('should send status 201 on registration', () => {
      return request(server)
        .post('/api/auth/register')
        .send({username:"bill", password:"password"})
        .then(res => expect(res.status).toBe(201))
    })
  })

  describe('login route', () => {
    it('should send status 401 if credentials are invalid', () => {
      return request(server)
        .post('/api/auth/register')
        .send({username:"bill", password:"passwor"})
        .then(res => {
          return request(server)
          .post('/api/auth/login')
          .send({username:"bill", password:"password"})
          .then(res2 => expect(res2.status).toBe(401))
        })
    })

    it('should send status 200 if credentials are valid', () => {
      return request(server)
        .post('/api/auth/register')
        .send({username:"bill", password:"password"})
        .then(res => {
          return request(server)
          .post('/api/auth/login')
          .send({username:"bill", password:"password"})
          .then(res2 => expect(res2.status).toBe(200))
        })
    })
  })

  describe('jokes route', () => {
    it('should send status code 401 if not logged in', () => {
      return request(server)
        .get('/api/jokes')
        .then(res => expect(res.status).toBe(401))
    })

    it('should send status code 200 if logged in', () => {
      request(server)
      .post('/api/auth/register')
      .send({username:"bill", password:"password"})
      .then(res => {
        request(server)
        .post('/api/auth/login')
        .send({username:"bill", password:"password"})
        .then(res2 => {
          request(server)
          .get('/api/jokes')
          .then(res3 => expect(res3.status).toBe(200))
        })
      })
    })
  })
})