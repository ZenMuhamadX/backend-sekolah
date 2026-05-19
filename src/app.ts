import { Hono } from 'hono'

import commonRoute from './routes/common.route'

import studentRoute from './routes/student.route'

const app = new Hono()

app.route('/', commonRoute)

app.route('/students', studentRoute)

export default app
