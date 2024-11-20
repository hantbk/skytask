import { app, STOP_SERVER } from '~/server'
import request from 'supertest'
import { CLOSE_DB, CONNECT_DB, DELETE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { generateToken } from '../utils/token.gererator'
import { createBoardExample } from '../fixtures/model.fixture'

beforeAll(async () => {
  await CONNECT_DB(env.TEST_DATABASE_NAME)
})

afterAll(async () => {
  await DELETE_DB(env.TEST_DATABASE_NAME)
  await CLOSE_DB()
  STOP_SERVER()
})

let columnId = ''

describe('POST /v1/columns', function () {
  it('should return 201 for created column', async function () {
    const { createdUser, createdBoard } = await createBoardExample()
    const token = await generateToken({ _id: createdUser._id, email: createdUser.email })

    const response = await request(app)
      .post('/v1/columns')
      .set('Cookie', [`accessToken= ${token}`])
      .send({ title: 'Column title', boardId: createdBoard._id })
      .expect(201)
    expect(response.body.boardId).toContain(createdBoard._id.toString())
    columnId = response.body._id
  })
})

describe('PUT /v1/columns', function () {
  it('should return 200 for update successfully', async function () {
    const { createdUser } = await createBoardExample()
    const token = await generateToken({ _id: createdUser._id, email: createdUser.email })
    const response = await request(app)
      .put(`/v1/columns/${columnId}`)
      .send({ title: 'New column title', cardOrderIds: [] })
      .set('Cookie', [`accessToken= ${token}`])
      .expect(200)

    expect(response.body.title).toBe('New column title')
    expect(response.body.cardOrderIds).toEqual([])
  })
})


describe('DELETE /v1/columns/:columnId', function () {
  it('should return 200 for delete successfully', async function () {
    const { createdUser } = await createBoardExample()
    const token = await generateToken({ _id: createdUser._id, email: createdUser.email })

    await request(app)
      .delete(`/v1/columns/${columnId}`)
      .set('Cookie', [`accessToken= ${token}`])
      .expect(200)
  })
})
