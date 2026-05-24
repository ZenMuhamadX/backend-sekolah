import { Student } from '../interface/student.interface'
import { mysql } from '../lib/mysql'

export async function createStudent(data: Student) {
  const existingSiswa = await mysql.siswa.findFirst({
    where: {
      nama: data.nama,
      nisn: data.nisn,
    },
  })

  if (existingSiswa) {
    throw new Error('Siswa dengan nama dan NISN tersebut sudah ada')
  }

  const siswa = await mysql.siswa.create({ data })

  return siswa as Student
}
