import express from 'express'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { APIs_V1 } from './routes/v1'

const app = express()

const hostname = 'localhost'
const port = 8888

app.use(express.json())

app.get('/', (req, res) => {
  res.end('<h1>Hello World!</h1>')
})

app.use('/v1', APIs_V1)

app.use(errorHandlingMiddleware)

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Hello World, I am running at http://${ hostname }:${ port }`)
})
