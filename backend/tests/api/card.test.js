import { app, STOP_SERVER } from '~/server'
import request from 'supertest'
import { CLOSE_DB, CONNECT_DB, DELETE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { generateToken } from '../utils/token.gererator'
import { createColumnExample } from '../fixtures/model.fixture'

beforeAll(async () => {
  await CONNECT_DB(env.TEST_DATABASE_NAME)
})

afterAll(async () => {
  await DELETE_DB(env.TEST_DATABASE_NAME)
  await CLOSE_DB()
  STOP_SERVER()
})

describe('POST /v1/cards', function () {
  it('should return 201 for created card', async function () {
    const { createdUser, createdBoard, createdColumn } = await createColumnExample()
    const token = await generateToken({ _id: createdUser._id, email: createdUser.email })
    await request(app)
      .post('/v1/cards')
      .set('Cookie', [`accessToken= ${token}`])
      .send({ title: 'Card title', columnId: createdColumn._id.toString(), boardId: createdBoard._id.toString() })
      .expect(201)
  })
})
