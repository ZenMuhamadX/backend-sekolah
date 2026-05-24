import {
  ErrorResponse,
  responseInterface,
} from '../interface/response.interface'
import { HttpStatusCode } from './../../node_modules/axios/index.d'
export const response = (
  status: HttpStatusCode,
  success: boolean,
  message: string,
  totalData: number = 0,
  data: any,
  meta: any,
): responseInterface => {
  return { status, success, message, total: totalData, data, meta }
}
export const errorResponse = (
  status: HttpStatusCode,
  message: string,
  success: boolean = false,
  errors: any = null,
): ErrorResponse => {
  return { status, success, message, errors }
}
