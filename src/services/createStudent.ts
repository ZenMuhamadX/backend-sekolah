import { mysql } from "../lib/mysql";

// Interface untuk menampung semua input dari Form Frontend
interface CreateStudentLengkapInput {
  // Data Siswa
  nis: string;
  namaLengkap: string;
  jenisKelamin: string;
  tanggalLahir: Date;
  alamatSiswa: string;

  // Data Kelas & Tahun Ajaran (Asumsi ID Kelas & Tahun Ajaran sudah ada dipilih via Dropdown)
  kelasId: number;       
  tahunAjaranId: number; 

  // Data Orang Tua Baru (Diinput manual di form yang sama)
  namaOrangTua: string;
  hubungan: string; // contoh: "Ayah", "Ibu", "Wali"
  noHpOrangTua: string;
  alamatOrangTua: string;
}

const createStudentLengkap = async (input: CreateStudentLengkapInput) => {
  try {
    const result = await mysql.siswa.create({
      data: {
        NIS: input.nis,
        nama_lengkap: input.namaLengkap,
        jenis_kelamin: input.jenisKelamin,
        tanggal_lahir: input.tanggalLahir,
        alamat: input.alamatSiswa,
        
        // 1. OTOMATIS SEKALIGUS BUAT RIWAYAT KELAS
        riwayat_kelas: {
          create: {
            kelas_id: input.kelasId,
            tahun_ajaran_id: input.tahunAjaranId,
            tanggal_masuk: new Date(),
          }
        },

        // 2. OTOMATIS BUAT DATA ORANG TUA BARU DAN MENGHUBUNGKANNYA
        siswa_orang_tua: {
          create: {
            orang_tua: {
              create: {
                nama: input.namaOrangTua,
                hubungan: input.hubungan,
                no_hp: input.noHpOrangTua,
                alamat: input.alamatOrangTua
              }
            }
          }
        }
      },
      // Include ini agar setelah sukses, data yang di-return langsung lengkap untuk response API
      include: {
        riwayat_kelas: true,
        siswa_orang_tua: {
          include: {
            orang_tua: true
          }
        }
      }
    });

    return result;
  } catch (error) {
    console.error("Gagal membuat data siswa dan relasinya:", error);
    throw error;
  }
};

createStudentLengkap({
  nis: "123456789",
  namaLengkap: "Budi Santoso",
  jenisKelamin: "Laki-laki",
  tanggalLahir: new Date("2005-05-15"),
  alamatSiswa: "Jl. Merdeka No. 10",
  kelasId: 1, // Asumsi kelas dengan ID 1 sudah ada
  tahunAjaranId: 1, // Asumsi tahun ajaran dengan ID 1 sudah ada
  namaOrangTua: "Slamet Santoso",
  hubungan: "Ayah",
  noHpOrangTua: "08123456789",
  alamatOrangTua: "Jl. Merdeka No. 10",
}).then((data) => {
  console.log(`Data Siswa Lengkap yang Baru Dibuat: ${JSON.stringify(data)}`)
})