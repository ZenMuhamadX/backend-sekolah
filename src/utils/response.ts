import { HttpStatusCode } from './../../node_modules/axios/index.d'
export const succesResponse = (
  status: HttpStatusCode,
  message: string,
  data: any,
  meta: any,
) => {
  return { status, succes: true, message, data, meta }
}
export const errorResponse = (
  status: HttpStatusCode,
  message: string,
  errors: any = null,
) => {
  return { status, succes: false, message, errors }
}
