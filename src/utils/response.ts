import {
  ErrorResponse,
  responseInterface,
} from '../interface/response.interface'

export const response = (
  status: number,
  success: boolean,
  message: string,
  totalData?: number,
  data?: any,
  meta?: any,
): responseInterface => {
  return {
    status,
    success,
    message,
    total: totalData ?? 0,
    data: data ?? null,
    meta: meta ?? null,
  }
}
export const errorResponse = (
  status: number,
  message: string,
  success: boolean = false,
  errors: any = null,
): ErrorResponse => {
  return { status, success, message, errors }
}
