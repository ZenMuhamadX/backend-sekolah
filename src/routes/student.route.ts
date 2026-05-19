import { Hono } from 'hono'
import { response } from '../utils/response'
import { getAllStudentsWithRelations } from '../services/getAllStudent'

const studentRoute = new Hono()

studentRoute.get('/', async (c) => {
  const students = await getAllStudentsWithRelations()
  c.status(200)
  return c.json(response(200, true, 'List of students', students, null))
})

export default studentRoute
