import { succesResponse } from '../utils/response'
import { Hono } from 'hono'

const commonRoute = new Hono()

commonRoute.get('/', (c) => {
  return c.json(succesResponse(200, 'Service is running', null, null))
})
export default commonRoute
