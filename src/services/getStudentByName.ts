import { prisma } from '../lib/prisma'
import { Student } from '../interface/student.interface'

export const getStudentByName = async (
  name: string,
): Promise<Student | null> => {
  const siswa = await prisma.siswa.findFirst({
    where: {
      nama: name,
      status: 'ACTIVE',
    },
  })

  return siswa as Student | null
}
