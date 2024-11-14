/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from './routes/v1'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()

  // https://stackoverflow.com/a/53240717/8324172
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Cookie Parser
  app.use(cookieParser())

  // Enable req.body json data
  app.use(express.json())

  app.use(cors(corsOptions))

  // Use APIs V1
  app.use('/v1', APIs_V1)

  // Centralized error handling
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    // Production development
    app.listen(process.env.PORT, () => {
      console.log(`Prod: Server is running at port: ${process.env.PORT}`)
    })
  } else {
    // Localhost development
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Local: Server is running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}`)
    })
  }


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
