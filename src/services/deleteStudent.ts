import { mysql } from '../lib/mysql'

export const deleteStudent = async (id: number) => {
  const existingSiswa = await mysql.siswa.findFirst({
    where: {
      id,
      status: 'ACTIVE',
    },
  })
  console.log(existingSiswa)
  if (!existingSiswa) {
    return null
  }

  const deletedSiswa = await mysql.siswa.update({
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
