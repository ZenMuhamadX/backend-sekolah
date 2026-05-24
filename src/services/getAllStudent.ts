import { prisma } from '../lib/prisma'
import { Student } from '../interface/student.interface'

export const getAllStudents = async (): Promise<{
  data: Student[]
  total: number
}> => {
  const where = {
    status: 'ACTIVE' as const,
  }

  const [siswa, total] = await prisma.$transaction([
    prisma.siswa.findMany({
      where,
      orderBy: {
        id: 'desc',
      },
    }),

    prisma.siswa.count({
      where,
    }),
  ])

  return {
    data: siswa as Student[],
    total,
  }
}
