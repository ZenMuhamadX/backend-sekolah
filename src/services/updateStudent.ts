import { Student } from '../interface/student.interface'
import { prisma } from '../lib/prisma'

export async function updateStudent(id: number, data: Partial<Student>) {
  // 1. Cek apakah siswa ada dan aktif
  const existingSiswa = await prisma.siswa.findFirst({
    where: {
      id,
      status: 'ACTIVE',
    },
  })

  if (!existingSiswa) {
    const err = new Error('Siswa tidak ditemukan atau sudah dihapus') as Error & { statusCode: number }
    err.statusCode = 404
    throw err
  }

  // 2. Cek keunikan NISN jika di-update dan berbeda dengan NISN sebelumnya
  if (data.nisn && data.nisn !== existingSiswa.nisn) {
    const duplicateNisn = await prisma.siswa.findFirst({
      where: {
        nisn: data.nisn,
        id: { not: id },
      },
    })

    if (duplicateNisn) {
      const err = new Error(
        duplicateNisn.status === 'DELETED'
          ? 'Siswa lain dengan NISN tersebut telah dihapus, silakan lakukan restore.'
          : 'NISN sudah digunakan oleh siswa lain'
      ) as Error & { statusCode: number; code: string; siswaId?: number }
      err.statusCode = 409
      err.code = duplicateNisn.status === 'DELETED' ? 'SISWA_ALREADY_DELETED' : 'NISN_ALREADY_EXISTS'
      err.siswaId = duplicateNisn.id
      throw err
    }
  }

  // 3. Cek keunikan NIK jika di-update dan berbeda dengan NIK sebelumnya
  if (data.nik && data.nik !== existingSiswa.nik) {
    const duplicateNik = await prisma.siswa.findFirst({
      where: {
        nik: data.nik,
        id: { not: id },
      },
    })

    if (duplicateNik) {
      const err = new Error(
        duplicateNik.status === 'DELETED'
          ? 'Siswa lain dengan NIK tersebut telah dihapus, silakan lakukan restore.'
          : 'NIK sudah digunakan oleh siswa lain'
      ) as Error & { statusCode: number; code: string; siswaId?: number }
      err.statusCode = 409
      err.code = duplicateNik.status === 'DELETED' ? 'SISWA_ALREADY_DELETED' : 'NIK_ALREADY_EXISTS'
      err.siswaId = duplicateNik.id
      throw err
    }
  }

  // 4. Konversi tanggalLahir jika berupa string
  const finalData = { ...data }
  if (finalData.tanggalLahir && typeof finalData.tanggalLahir === 'string') {
    finalData.tanggalLahir = new Date(finalData.tanggalLahir)
  }

  // 5. Update data siswa
  const updatedSiswa = await prisma.siswa.update({
    where: { id },
    data: finalData as any,
  })

  return updatedSiswa as Student
}
