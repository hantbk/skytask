/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from './routes/v1'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import axios from 'axios'

const urlToPing = WEBSITE_DOMAIN
const interval = 300000 // 5 minutes

// Function to reload the server by pinging the server's health check URL
function reloadWebsite() {
  axios
    .get(urlToPing)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`)
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message)
    })
}

const START_SERVER = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())

  app.use(cors(corsOptions))

  // Use APIs V1
  app.use('/v1', APIs_V1)

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'Server is healthy',
      timestamp: new Date().toISOString()
    })
  })

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

  // Start periodic ping to keep the server alive
  setInterval(reloadWebsite, interval)
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
