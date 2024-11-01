/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from './routes/v1'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'

const START_SERVER = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())

  app.use(cors(corsOptions))

  // Use APIs V1
  app.use('/v1', APIs_V1)

  // Centralized error handling
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello World, I am running at http://${ env.APP_HOST }:${ env.APP_PORT }`)
  })

  // Doing a cleanup action just before Node.js exits
  // https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
  exitHook(() => {
    console.log('Server is shutting down...')
    CLOSE_DB()
  })
}

(async () => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(err => {
//     console.error(err)
//     process.exit(0)
//   })
