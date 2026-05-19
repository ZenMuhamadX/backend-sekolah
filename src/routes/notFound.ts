// src/handlers/notFound.ts
import { NotFoundHandler } from 'hono'
import { response } from '../utils/response'

export const notFoundHandler: NotFoundHandler = (c) => {
  return c.json(response(404, false, 'Not Found', null, null))
}
