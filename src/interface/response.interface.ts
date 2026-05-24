import { HttpStatusCode } from 'axios'

export interface responseInterface {
  status: HttpStatusCode
  success: boolean
  message: string
  total: number
  data: any
  meta: any
}
export interface ErrorResponse {
  status: HttpStatusCode
  success: boolean
  message: string
  errors: any
}
