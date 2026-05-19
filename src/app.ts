import { Hono } from 'hono'
import commonRoute from './routes/common.route'
import studentRoute from './routes/student.route'
import { notFoundHandler } from './routes/notFound'
import { csrf } from 'hono/csrf'
import { requestId } from 'hono/request-id'
import { cors } from 'hono/cors'
import { configure, getConsoleSink } from '@logtape/logtape'
import { honoLogger } from '@logtape/hono'
import { useApitally } from 'apitally/hono'

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [{ category: ['hono'], sinks: ['console'], lowestLevel: 'info' }],
})

const app = new Hono()
app.use(csrf())
app.use(
  honoLogger({
    format: 'combined',
    level: 'info',
  }),
)
app.use(requestId())
app.use(
  cors({
    origin: '*',
  }),
)
useApitally(app, {
  clientId: 'ec68841b-a9e8-4e3c-a740-3c6627487de3',
  env: 'dev', // or "prod"

  // Optionally enable and configure request logging
  requestLogging: {
    enabled: true,
    logRequestHeaders: true,
    logRequestBody: true,
    logResponseBody: true,
    captureLogs: true,
  },
})

app.route('/', commonRoute)

app.route('/students', studentRoute)

app.notFound(notFoundHandler)

export default app
