import express from 'express'

const app = express()

const hostname = 'localhost'
const port = 8888

app.get('/', (req, res) => {
  res.end('<h1>Hello World!</h1>')
})

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Hello World, I am running at http://${ hostname }:${ port }`)
})
