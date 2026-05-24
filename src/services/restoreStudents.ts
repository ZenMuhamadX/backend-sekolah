import { mysql } from '../lib/mysql'

export async function restoreStudent(id: number) {
  const existingSiswa = await mysql.siswa.findFirst({
    where: {
      id,
      status: 'DELETED',
    },
  })

  if (!existingSiswa) {
    return null
  }

  const restoredSiswa = await mysql.siswa.update({
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
