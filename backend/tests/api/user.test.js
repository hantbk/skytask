import { app, STOP_SERVER } from '~/server'
import request from 'supertest'
import { CLOSE_DB, CONNECT_DB, DELETE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { userExample, verifyUserExample } from '../fixtures/model.fixture'

beforeAll(async () => {
  await CONNECT_DB(env.TEST_DATABASE_NAME)
})

afterAll(async () => {
  await DELETE_DB(env.TEST_DATABASE_NAME)
  await CLOSE_DB()
  STOP_SERVER()
})

describe('POST /v1/users/register', function () {
  it('should return 201 for user created', async function () {
    const response = await request(app)
      .post('/v1/users/register')
      .send(userExample)
      .expect(201)
    expect(response.body.email).toBe(userExample.email)
    expect(response.body).not.toHaveProperty('password')
  })
})

describe('POST /v1/users/login', function () {
  it('should return 406 for not verified user', async function () {
    await request(app)
      .post('/v1/users/login')
      .send(userExample)
      .expect(406)
  })

  it('should set cookie for verified user login l', async function () {
    // Set userExample to verified
    await verifyUserExample()

    const response = await request(app)
      .post('/v1/users/login')
      .send(userExample)

    const cookies = response.headers['set-cookie']
    const hasAccessToken = cookies.some((cookie) => cookie.startsWith('accessToken='))
    const hasRefreshToken = cookies.some((cookie) => cookie.startsWith('refreshToken='))

    expect(hasAccessToken).toBe(true)
    expect(hasRefreshToken).toBe(true)
  })
})
