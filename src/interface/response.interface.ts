import { HttpStatusCode } from 'axios'

export interface response {
  status: HttpStatusCode
  succes: boolean
  message: string
  data: any
  meta: any
}
export interface ErrorResponse {
  status: HttpStatusCode
  succes: boolean
  message: string
  errors: any
}
