import express from 'express'
import cors from 'cors'
import { getOrCreateDocAndToken } from '@y-sweet/sdk'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const app = express()
app.use(cors())
const PORT = 9090
const CONNECTION_STRING = process.env.CONNECTION_STRING

if (!CONNECTION_STRING) {
  console.error()
  console.error('CONNECTION_STRING environment variable is required')
  console.error(
    'You can get a connection string at https://app.y-sweet.cloud or by running a y-sweet server locally.',
  )
  console.error()
  console.error(
    'Provide the connection string as an environment variable when starting the server by running:',
  )
  console.error('    CONNECTION_STRING=<your-connection-string> npm run server')
  console.error()
  process.exit(1)
}

app.get('/client-token', async (req, res) => {
  const docId = req.query.doc ?? undefined
  if (docId) {
    console.log('Received client token request for doc', docId)
  } else {
    console.log('Received client token request for new doc')
  }
  const clientToken = await getOrCreateDocAndToken(CONNECTION_STRING, docId)
  res.send(clientToken)
})

app.listen(PORT, () => {
  console.log(`Y-Sweet VanillaJS demo server listening on port ${PORT}`)
})
