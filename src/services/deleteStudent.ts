import { prisma } from '../lib/prisma'

export const deleteStudent = async (id: number) => {
  const existingSiswa = await prisma.siswa.findFirst({
    where: {
      id,
      status: 'ACTIVE',
    },
  })
  console.log(existingSiswa)
  if (!existingSiswa) {
    return null
  }

  const deletedSiswa = await prisma.siswa.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      status: 'DELETED',
    },
  })

  return deletedSiswa
}
