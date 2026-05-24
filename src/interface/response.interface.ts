export interface responseInterface {
  status: number
  success: boolean
  message: string
  total: number
  data: any
  meta: any
}
export interface ErrorResponse {
  status: number
  success: boolean
  message: string
  errors: any
}
