/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, GET_DB } from '~/config/mongodb'

const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8888

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())

    res.end('<h1>Hello World!</h1>')
  })

  app.listen(port, hostname, () => {
    console.log(`Hello World, I am running at http://${ hostname }:${ port }`)
  })
}

CONNECT_DB()
  .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
  .then(() => START_SERVER())
  .catch(err => {
    console.error(err)
    process.exit(0)
  })