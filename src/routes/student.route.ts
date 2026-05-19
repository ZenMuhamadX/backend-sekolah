import { Hono } from 'hono'
import { succesResponse } from '../utils/response'

const studentRoute = new Hono()

studentRoute.get('/', (c) => {
  return c.json(succesResponse(200, 'List of students', null, null))
})

export default studentRoute
