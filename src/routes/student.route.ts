import { Hono } from 'hono'
import { getAllStudents } from '../services/getAllStudent'
import { getStudentById } from '../services/getStudentById'
import { createStudent } from '../services/createStudent'
import { deleteStudent } from '../services/deleteStudent'
import { restoreStudent } from '../services/restoreStudents'
import { response } from '../utils/response'

// Membuat instance route khusus untuk semua endpoint yang berhubungan dengan data siswa
const studentRoute = new Hono()

// Metadata standar yang akan dikirim pada setiap response endpoint siswa
// Tujuannya agar client/frontend tahu konteks API yang sedang diakses
const metadata = {
  name: 'Student API',
  description: 'API untuk mengelola data siswa',
  version: '0.1.0',
}

/**
 * GET /
 *
 * Mengambil semua data siswa yang masih aktif.
 * Data siswa yang sudah dihapus secara soft delete tidak akan ditampilkan
 * karena filtering dilakukan di service getAllStudents().
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

/**
 * GET /getById?id=1
 *
 * Mengambil detail satu siswa berdasarkan ID yang dikirim melalui query string.
 * Contoh request:
 * /students/getById?id=1
 *
 * Kenapa pakai query?
 * Karena struktur route kamu saat ini memang memakai pola getById/deleteById.
 * Nanti kalau mau lebih RESTful, bisa diubah ke /students/:id.
 */
studentRoute.get('/getById', async (c) => {
  try {
    const id = Number(c.req.query('id'))

    // Validasi agar ID wajib berupa angka valid
    // Number(undefined) menghasilkan NaN, jadi query id kosong juga akan tertangkap
    if (Number.isNaN(id)) {
      return c.json(
        response(400, false, 'ID siswa tidak valid', 0, null, metadata),
        400,
      )
    }

    const siswa = await getStudentById(id)

    // Jika service mengembalikan null, berarti siswa tidak ditemukan
    // atau siswa sudah berstatus deleted
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
 * Body dikirim dalam bentuk JSON dari frontend/Postman.
 *
 * Service createStudent sebaiknya menangani:
 * - validasi data unik seperti NISN/NIK
 * - error siswa sudah aktif
 * - error siswa sudah pernah dihapus dan perlu direstore
 */
studentRoute.post('/', async (c) => {
  try {
    const body = await c.req.json()

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return c.json(
        response(400, false, 'Payload siswa tidak valid', 0, null, metadata),
        400,
      )
    }

    const siswa = await createStudent(body)

    return c.json(
      response(201, true, 'Siswa berhasil dibuat', 1, siswa, metadata),
      201,
    )
  } catch (error) {
    console.error(error)

    // Menangkap error custom dari service.
    // Misalnya:
    // - 409 SISWA_ALREADY_EXISTS
    // - 409 SISWA_ALREADY_DELETED
    //
    // Kalau tidak ada statusCode, default-nya tetap 500.
    const err = error as Error & {
      statusCode?: number
      code?: string
      siswaId?: number
    }

    const data = {
      code: err.code ?? 'CREATE_STUDENT_FAILED',
      siswaId: err.siswaId ?? null,
    }

    return c.json(
      response(
        err.statusCode ?? 500,
        false,
        err.message || 'Gagal membuat siswa',
        0,
        data,
        metadata,
      ),
    )
  }
})

/**
 * DELETE /deleteById?id=1
 *
 * Menghapus siswa berdasarkan ID melalui query string.
 * Penghapusan yang disarankan adalah soft delete, bukan hard delete.
 *
 * Artinya data tidak benar-benar hilang dari database,
 * tetapi hanya diubah menjadi:
 * - status: DELETED
 * - deletedAt: tanggal saat dihapus
 */
studentRoute.delete('/deleteById', async (c) => {
  try {
    const id = Number(c.req.query('id'))

    // Validasi ID agar tidak menerima nilai kosong, teks, atau NaN
    if (Number.isNaN(id)) {
      return c.json(
        response(400, false, 'ID siswa tidak valid', 0, null, metadata),
        400,
      )
    }

    const siswa = await deleteStudent(id)

    // Jika siswa null, kemungkinan ID tidak ada
    // atau siswa tersebut sudah dihapus sebelumnya
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
 * PATCH /restoreById?id=1
 *
 * Mengembalikan siswa yang sebelumnya sudah dihapus secara soft delete.
 *
 * Restore akan mengubah data menjadi:
 * - status: ACTIVE
 * - deletedAt: null
 *
 * Endpoint ini hanya berhasil jika siswa memang ada dan statusnya DELETED.
 */
studentRoute.patch('/restoreById', async (c) => {
  try {
    const id = Number(c.req.query('id'))

    // Validasi ID dari query string
    if (Number.isNaN(id)) {
      return c.json(
        response(400, false, 'ID siswa tidak valid', 0, null, metadata),
        400,
      )
    }

    const siswa = await restoreStudent(id)

    // Jika null, berarti siswa tidak ditemukan
    // atau siswa tersebut tidak dalam kondisi deleted
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
