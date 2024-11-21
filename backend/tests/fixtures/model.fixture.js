import { GET_DB } from '~/config/mongodb'
import { faker } from '@faker-js/faker'
import bcryptjs from 'bcryptjs'
import { slugify } from '~/utils/formatters'

const userExample = {
  email: faker.internet.email(),
  password: 'Password123'
}

const verifyUserExample = async () => {
  await GET_DB().collection('users').updateOne(
    { email: userExample.email },
    { $set:  {
      email: userExample.email,
      password: bcryptjs.hashSync(userExample.password, 8),
      isActive: true
    }
    },
    { upsert: true }
  )
  return await GET_DB().collection('users').findOne({ email: userExample.email })
}

const boardExample = {
  title: 'Board title',
  description: 'This is board description',
  type: 'public'
}

const createBoardExample = async () => {
  const createdUser = await verifyUserExample()

  const result = await GET_DB().collection('boards').insertOne({
    ...boardExample,
    slug: slugify(boardExample.title),
    orderColumnIds: [],
    ownerIds: [createdUser._id],
    memberIds: [],
    createdAt: Date.now(),
    updatedAt: null,
    _destroy: false
  })

  const createdBoard = await GET_DB().collection('boards').findOne({ _id: result.insertedId })

  return { createdUser, createdBoard }
}

const createColumnExample = async () => {
  const { createdUser, createdBoard } = await createBoardExample()
  const column = {
    title: 'Column title',
    boardId: createdBoard._id
  }

  const result = await GET_DB().collection('columns').insertOne(column)

  const createdColumn = await GET_DB().collection('columns').findOne({ _id: result.insertedId })
  return { createdUser, createdBoard, createdColumn }
}

export { userExample, verifyUserExample, boardExample, createBoardExample, createColumnExample }
