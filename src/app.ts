import { Hono } from 'hono'
import commonRoute from './routes/common.route'
import studentRoute from './routes/student.route'
import { notFoundHandler } from './routes/notFound'
import { csrf } from 'hono/csrf'
import { requestId } from 'hono/request-id'
import { cors } from 'hono/cors'
import { configure, getConsoleSink } from '@logtape/logtape'
import { honoLogger } from '@logtape/hono'

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [{ category: ['hono'], sinks: ['console'], lowestLevel: 'info' }],
})

const app = new Hono()
app.use(
  csrf({
    origin: (origin) => {
      if (!origin) return true
      return (
        origin === 'http://localhost:5173' ||
        origin.startsWith('http://localhost:')
      )
    },
  }),
)
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
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
)

app.route('/', commonRoute)
// app.post('/', (c) => c.text('Hello World!'))

app.route('/students', studentRoute)

app.notFound(notFoundHandler)

export default app
