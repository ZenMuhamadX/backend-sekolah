import { Hono } from 'hono'
import { getAllStudents } from '../services/getAllStudent'
import { getStudentById } from '../services/getStudentById'
import { createStudent } from '../services/createStudent'
import { updateStudent } from '../services/updateStudent'
import { deleteStudent } from '../services/deleteStudent'
import { restoreStudent } from '../services/restoreStudents'
import { response } from '../utils/response'
import { validateBody } from '../utils/validate'
import {
  createStudentSchema,
  updateStudentSchema,
} from '../validators/student.validator'
import { getStudentByName } from '../services/getStudentByName'

// Membuat instance route khusus untuk semua endpoint yang berhubungan dengan data siswa
const studentRoute = new Hono()

// Metadata standar yang akan dikirim pada setiap response endpoint siswa
const metadata = {
  name: 'Student API',
  description: 'API untuk mengelola data siswa',
  version: '0.1.0',
}

// ─── Helper: validasi path param :id ─────────────────────────────────────────
function parseId(raw: string): number | null {
  const n = Number(raw)
  return Number.isNaN(n) || n <= 0 ? null : n
}

/**
 * GET /
 *
 * Mengambil semua data siswa yang masih aktif.
 */
studentRoute.get('/', async (c) => {
  try {
    const siswa = await getAllStudents()

    return c.json(
      response(
        200,
        true,
        'Berhasil mengambil data siswa',
        siswa.total,
        siswa.data,
        metadata,
      ),
      200,
    )
  } catch (error) {
    console.error(error)

    return c.json(
      response(500, false, 'Gagal mengambil data siswa', 0, null, metadata),
      500,
    )
  }
})

// /**
//  * GET /:name
//  *
//  * Mengambil detail satu siswa berdasarkan ID dari path parameter.
//  */
// studentRoute.get('/:name', async (c) => {
//   try {
//     const name = c.req.param('name')

//     if (!name) {
//       return c.json(
//         response(
//           400,
//           false,
//           'ID siswa tidak valid, harus berupa angka positif',
//           0,
//           null,
//           metadata,
//         ),
//         400,
//       )
//     }

//     const student = await getStudentByName(name)

//     if (!student) {
//       return c.json(
//         response(404, false, 'Siswa tidak ditemukan', 0, null, metadata),
//         404,
//       )
//     }

//     return c.json(
//       response(
//         200,
//         true,
//         'Detail siswa berhasil diambil',
//         1,
//         student,
//         metadata,
//       ),
//       200,
//     )
//   } catch (error) {
//     console.error(error)

//     return c.json(
//       response(500, false, 'Gagal mengambil detail siswa', 0, null, metadata),
//       500,
//     )
//   }
// })

/**
 * GET /:id
 *
 * Mengambil detail satu siswa berdasarkan ID dari path parameter.
 */
studentRoute.get('/:id', async (c) => {
  try {
    const id = parseId(c.req.param('id'))

    if (!id) {
      return c.json(
        response(
          400,
          false,
          'ID siswa tidak valid, harus berupa angka positif',
          0,
          null,
          metadata,
        ),
        400,
      )
    }

    const siswa = await getStudentById(id)

    if (!siswa) {
      return c.json(
        response(404, false, 'Siswa tidak ditemukan', 0, null, metadata),
        404,
      )
    }

    return c.json(
      response(200, true, 'Detail siswa berhasil diambil', 1, siswa, metadata),
      200,
    )
  } catch (error) {
    console.error(error)

    return c.json(
      response(500, false, 'Gagal mengambil detail siswa', 0, null, metadata),
      500,
    )
  }
})

/**
 * POST /
 *
 * Membuat data siswa baru.
 * Validasi menggunakan Joi:
 *   - `nama` WAJIB diisi
 *   - Semua field lain opsional namun divalidasi tipe & formatnya
 *   - Field tidak dikenal akan ditolak (allowUnknown: false)
 *   - Semua error dikembalikan sekaligus (abortEarly: false)
 */
studentRoute.post('/', async (c) => {
  // Validasi Joi — jika gagal, helper mengirim 422 + daftar error
  const body = await validateBody(c, createStudentSchema)
  if (body === null) return c.res

  try {
    const siswa = await createStudent(body as any)

    return c.json(
      response(201, true, 'Siswa berhasil dibuat', 1, siswa, metadata),
      201,
    )
  } catch (error) {
    console.error(error)

    const err = error as Error & {
      statusCode?: number
      code?: string
      siswaId?: number
    }

    const statusCode = err.statusCode ?? 500

    return c.json(
      response(
        statusCode,
        false,
        err.message || 'Gagal membuat siswa',
        0,
        {
          code: err.code ?? 'CREATE_STUDENT_FAILED',
          siswaId: err.siswaId ?? null,
        },
        metadata,
      ),
      statusCode as any,
    )
  }
})

/**
 * PUT /:id
 *
 * Memperbarui data siswa berdasarkan ID.
 * Validasi menggunakan Joi:
 *   - Minimal 1 field harus dikirim
 *   - Semua field opsional namun divalidasi tipe & formatnya
 */
studentRoute.put('/:id', async (c) => {
  const id = parseId(c.req.param('id'))

  if (!id) {
    return c.json(
      response(
        400,
        false,
        'ID siswa tidak valid, harus berupa angka positif',
        0,
        null,
        metadata,
      ),
      400,
    )
  }

  // Validasi Joi — jika gagal, helper mengirim 422 + daftar error
  const body = await validateBody(c, updateStudentSchema)
  if (body === null) return c.res

  try {
    const siswa = await updateStudent(id, body as any)

    return c.json(
      response(200, true, 'Siswa berhasil diperbarui', 1, siswa, metadata),
      200,
    )
  } catch (error) {
    console.error(error)

    const err = error as Error & {
      statusCode?: number
      code?: string
      siswaId?: number
    }

    const statusCode = err.statusCode ?? 500

    return c.json(
      response(
        statusCode,
        false,
        err.message || 'Gagal memperbarui siswa',
        0,
        {
          code: err.code ?? 'UPDATE_STUDENT_FAILED',
          siswaId: err.siswaId ?? null,
        },
        metadata,
      ),
      statusCode as any,
    )
  }
})

/**
 * DELETE /:id
 *
 * Menghapus siswa berdasarkan ID (Soft Delete).
 */
studentRoute.delete('/:id', async (c) => {
  try {
    const id = parseId(c.req.param('id'))

    if (!id) {
      return c.json(
        response(
          400,
          false,
          'ID siswa tidak valid, harus berupa angka positif',
          0,
          null,
          metadata,
        ),
        400,
      )
    }

    const siswa = await deleteStudent(id)

    if (!siswa) {
      return c.json(
        response(404, false, 'Siswa tidak ditemukan', 0, null, metadata),
        404,
      )
    }

    return c.json(
      response(200, true, 'Siswa berhasil dihapus', 1, siswa, metadata),
      200,
    )
  } catch (error) {
    console.error(error)

    return c.json(
      response(500, false, 'Gagal menghapus siswa', 0, null, metadata),
      500,
    )
  }
})

/**
 * PATCH /:id/restore
 *
 * Mengembalikan siswa yang sebelumnya sudah dihapus secara soft delete.
 */
studentRoute.patch('/:id/restore', async (c) => {
  try {
    const id = parseId(c.req.param('id'))

    console.log(id)

    if (!id) {
      return c.json(
        response(
          400,
          false,
          'ID siswa tidak valid, harus berupa angka positif',
          0,
          null,
          metadata,
        ),
        400,
      )
    }

    const siswa = await restoreStudent(id)

    if (!siswa) {
      return c.json(
        response(
          404,
          false,
          'Siswa yang dihapus tidak ditemukan',
          0,
          null,
          metadata,
        ),
        404,
      )
    }

    return c.json(
      response(200, true, 'Siswa berhasil direstore', 1, siswa, metadata),
      200,
    )
  } catch (error) {
    console.error(error)

    return c.json(
      response(500, false, 'Gagal restore siswa', 0, null, metadata),
      500,
    )
  }
})

export default studentRoute
