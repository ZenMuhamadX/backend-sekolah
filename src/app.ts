import { Hono } from 'hono'

import commonRoute from './routes/common.route'

import studentRoute from './routes/student.route'
import { notFoundHandler } from './routes/notFound'

const app = new Hono()

app.route('/', commonRoute)

app.route('/students', studentRoute)

app.notFound(notFoundHandler)

export default app
