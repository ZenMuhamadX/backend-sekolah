import { Student } from '../interface/student.interface'
import { mysql } from '../lib/mysql'

export const getStudentById = async (id: number): Promise<Student | null> => {
  const siswa = await mysql.siswa.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  })

  return siswa as Student | null
}
