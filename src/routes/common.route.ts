import { response } from '../utils/response'
import { Hono } from 'hono'

const commonRoute = new Hono()

commonRoute.get('/', (c) => {
  return c.json(response(200, true, 'Service is running'))
})
export default commonRoute
