import { Student } from '../interface/student.interface'
import { prisma } from '../lib/prisma'

export async function createStudent(data: Student) {
  // 1. Cek duplikasi NISN (jika dikirim)
  if (data.nisn) {
    const existingNisn = await prisma.siswa.findFirst({
      where: { nisn: data.nisn },
    })

    if (existingNisn) {
      const err = new Error(
        existingNisn.status === 'DELETED'
          ? 'Siswa dengan NISN tersebut telah dihapus, silakan lakukan restore.'
          : 'Siswa dengan NISN tersebut sudah terdaftar'
      ) as Error & { statusCode: number; code: string; siswaId?: number }
      err.statusCode = 409
      err.code = existingNisn.status === 'DELETED' ? 'SISWA_ALREADY_DELETED' : 'NISN_ALREADY_EXISTS'
      err.siswaId = existingNisn.id
      throw err
    }
  }

  // 2. Cek duplikasi NIK (jika dikirim)
  if (data.nik) {
    const existingNik = await prisma.siswa.findFirst({
      where: { nik: data.nik },
    })

    if (existingNik) {
      const err = new Error(
        existingNik.status === 'DELETED'
          ? 'Siswa dengan NIK tersebut telah dihapus, silakan lakukan restore.'
          : 'Siswa dengan NIK tersebut sudah terdaftar'
      ) as Error & { statusCode: number; code: string; siswaId?: number }
      err.statusCode = 409
      err.code = existingNik.status === 'DELETED' ? 'SISWA_ALREADY_DELETED' : 'NIK_ALREADY_EXISTS'
      err.siswaId = existingNik.id
      throw err
    }
  }

  // 3. Cek duplikasi nama jika berstatus ACTIVE untuk mencegah pendaftaran ganda
  const existingNama = await prisma.siswa.findFirst({
    where: {
      nama: data.nama,
      status: 'ACTIVE',
    },
  })

  if (existingNama) {
    const err = new Error('Siswa dengan nama tersebut sudah aktif terdaftar') as Error & { statusCode: number; code: string }
    err.statusCode = 409
    err.code = 'SISWA_ALREADY_EXISTS'
    throw err
  }

  // Konversi tanggalLahir jika berupa string
  const finalData = { ...data }
  if (finalData.tanggalLahir && typeof finalData.tanggalLahir === 'string') {
    finalData.tanggalLahir = new Date(finalData.tanggalLahir)
  }

  const siswa = await prisma.siswa.create({
    data: finalData as any,
  })

  return siswa as Student
}
