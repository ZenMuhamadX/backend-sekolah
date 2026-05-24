import Joi from 'joi'
import { Context } from 'hono'
import { response } from '../utils/response'

/**
 * validateBody
 *
 * Middleware helper: memvalidasi `req.json()` menggunakan schema Joi yang diberikan.
 * Jika validasi gagal, langsung kembalikan 422 Unprocessable Entity beserta
 * daftar error yang terstruktur.
 *
 * Penggunaan di route:
 *   import { validateBody } from '../utils/validate'
 *   import { createStudentSchema } from '../validators/student.validator'
 *
 *   studentRoute.post('/', async (c) => {
 *     const body = await validateBody(c, createStudentSchema)
 *     if (!body) return   // respons 422 sudah dikirim oleh helper
 *     ...
 *   })
 */
export async function validateBody<T>(
  c: Context,
  schema: Joi.ObjectSchema<T>,
): Promise<T | null> {
  let raw: unknown

  try {
    raw = await c.req.json()
  } catch {
    c.res = c.json(
      response(400, false, 'Body request harus berupa JSON yang valid'),
      400,
    )
    return null
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    c.res = c.json(
      response(400, false, 'Payload tidak valid, harus berupa objek JSON'),
      400,
    )
    return null
  }

  const { error, value } = schema.validate(raw, { abortEarly: false })

  if (error) {
    // Ubah Joi ValidationError menjadi format response yang ramah
    const errors = error.details.map((d) => ({
      field: d.path.join('.') || 'unknown',
      message: d.message,
    }))

    c.res = c.json(
      response(422, false, 'Validasi gagal, periksa kembali data yang dikirim', 0, { errors }),
      422,
    )
    return null
  }

  return value as T
}
