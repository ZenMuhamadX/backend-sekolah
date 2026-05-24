import { prisma } from '../lib/prisma'

export async function restoreStudent(id: number) {
  const existingSiswa = await prisma.siswa.findFirst({
    where: {
      id,
      status: 'DELETED',
    },
  })

  if (!existingSiswa) {
    return null
  }

  const restoredSiswa = await prisma.siswa.update({
    where: {
      id,
    },
    data: {
      deletedAt: null,
      status: 'ACTIVE',
    },
  })

  return restoredSiswa
}
