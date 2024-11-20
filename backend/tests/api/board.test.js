import { app, STOP_SERVER } from '~/server'
import request from 'supertest'
import { CLOSE_DB, CONNECT_DB, DELETE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { generateToken } from '../utils/token.gererator'
import { verifyUserExample, boardExample, createBoardExample } from '../fixtures/model.fixture'

beforeAll(async () => {
  await CONNECT_DB(env.TEST_DATABASE_NAME)
})

afterAll(async () => {
  await DELETE_DB(env.TEST_DATABASE_NAME)
  await CLOSE_DB()
  STOP_SERVER()
})

describe('GET /v1/boards/:boardId', function () {
  it('should return 200 for get users created board', async function () {

    const { createdBoard, createdUser } = await createBoardExample()
    const token = await generateToken({ _id: createdUser._id, email: createdUser.email })
    const response = await request(app)
      .get(`/v1/boards/${createdBoard._id}`)
      .set('Cookie', [`accessToken= ${token}`])
      .expect(200)

    expect(response.body).toHaveProperty('title', createdBoard.title)
    expect(response.body).toHaveProperty('description', createdBoard.description)
  })
})

describe('POST /v1/boards', function () {
  it('should return 201 for created board', async function () {
    const createdUser = await verifyUserExample()
    const token = await generateToken({ _id: createdUser._id, email: createdUser.email })
    const response = await request(app)
      .post('/v1/boards')
      .set('Cookie', [`accessToken= ${token}`])
      .send(boardExample)
      .expect(201)

    expect(response.body.ownerIds).toContain(createdUser._id.toString())
  })

  it('should return 401 for unauthorized user', async function () {
    await request(app)
      .post('/v1/boards')
      .send(boardExample)
      .expect(401)
  })
})
