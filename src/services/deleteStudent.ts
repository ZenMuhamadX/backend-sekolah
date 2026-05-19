import { mysql } from '../lib/mysql'

export const deleteStudent = async (id: number): Promise<void> => {
  // Menggunakan $transaction agar jika ada yang gagal, semuanya di-rollback
  await mysql.$transaction([
    // 1. Hapus data di tabel-tabel relasi terlebih dahulu
    mysql.siswa_orang_tua.deleteMany({ where: { siswa_id: id } }),
    mysql.riwayat_kelas.deleteMany({ where: { siswa_id: id } }),
    mysql.dokumen_siswa.deleteMany({ where: { siswa_id: id } }),

    // 2. Terakhir, hapus data siswa
    mysql.siswa.delete({ where: { id } }),
  ])
}
