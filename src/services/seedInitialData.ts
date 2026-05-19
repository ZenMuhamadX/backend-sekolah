import { mysql } from '../lib/mysql'

const seedInitialData = async () => {
  try {
    console.log('Memulai pengisian data master...')

    // 1. INPUT DATA GURU (Wajib pertama karena Kelas butuh Wali Kelas)
    const guruBaru = await mysql.guru.create({
      data: {
        nama: 'Budi Setiawan, S.Pd.',
        nip: '198504122010011002',
        no_hp: '081234567890',
        alamat: 'Jl. Pendidikan No. 10',
      },
    })
    console.log('✅ Data Guru berhasil dibuat dengan ID:', guruBaru.id)

    // 2. INPUT DATA TAHUN AJARAN
    const tahunAjaranBaru = await mysql.tahun_ajaran.create({
      data: {
        nama: '2026/2027',
        aktif: true,
      },
    })
    console.log(
      '✅ Data Tahun Ajaran berhasil dibuat dengan ID:',
      tahunAjaranBaru.id,
    )

    // 3. INPUT DATA KELAS (Menggunakan ID Guru yang baru dibuat di atas)
    const kelasBaru = await mysql.kelas.create({
      data: {
        nama_kelas: 'X-RPL-1',
        wali_kelas_id: guruBaru.id, // Menghubungkan ke guru Budi
      },
    })
    console.log('✅ Data Kelas berhasil dibuat dengan ID:', kelasBaru.id)

    // 4. (Opsional) INPUT JENIS DOKUMEN
    await mysql.jenis_dokumen.createMany({
      data: [
        { nama: 'Kartu Keluarga' },
        { nama: 'Akte Kelahiran' },
        { nama: 'Ijazah SMP' },
      ],
    })
    console.log('✅ Data Jenis Dokumen berhasil dibuat')

    console.log('\n🚀 DATABASE SIAP! Kamu sekarang bisa menginput data Siswa.')

    // Kembalikan ID yang dibutuhkan untuk input siswa nanti
    return {
      kelasId: kelasBaru.id,
      tahunAjaranId: tahunAjaranBaru.id,
    }
  } catch (error) {
    console.error('❌ Gagal mengisi data master:', error)
  }
}

// Jalankan fungsi seed
seedInitialData()
