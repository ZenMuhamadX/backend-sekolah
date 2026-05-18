import { mysql } from "../lib/mysql";

// Fungsi untuk mengambil semua siswa beserta seluruh relasinya
export const getAllStudentsWithRelations = async () => {
  try {
    const students = await mysql.siswa.findMany({
      include: {
        // 1. Ambil data dari tabel riwayat_kelas
        riwayat_kelas: true, 
        
        // 2. Ambil data dari tabel dokumen_siswa
        dokumen_siswa: true, 
        
        // 3. Ambil data relasi orang tua, sekaligus data detail orang tuanya (Nested Include)
        siswa_orang_tua: {
          include: {
            orang_tua: true // Ini akan menarik data nama, no_hp, dll dari tabel orang_tua
          }
        }
      }
    });

    return students;
  } catch (error) {
    console.error("Gagal mengambil data siswa:", error);
    throw error;
  }
};

// Contoh pemanggilan fungsi
getAllStudentsWithRelations().then((data) => {
  console.log("Data Siswa Lengkap:", JSON.stringify(data, null, 2));
});