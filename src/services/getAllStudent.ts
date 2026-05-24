import { Student } from '../interface/student.interface'
import { mysql } from '../lib/mysql'

export const getAllStudents = async (): Promise<{
  data: Student[]
  total: number
}> => {
  const where = {
    status: 'ACTIVE' as const,
  }

  const [siswa, total] = await mysql.$transaction([
    mysql.siswa.findMany({
      where,
      orderBy: {
        id: 'desc',
      },
    }),

    mysql.siswa.count({
      where,
    }),
  ])

  return {
    data: siswa as Student[],
    total,
  }
}
