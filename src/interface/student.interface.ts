export type Student = {
  no?: number

  // Identitas siswa
  nama: string
  nipd?: string
  nisn?: string
  nik?: string

  jk?: 'L' | 'P'

  tempatLahir?: string
  tanggalLahir?: Date

  agama?: string

  // Alamat
  alamat?: string
  rt?: string
  rw?: string
  dusun?: string
  kelurahan?: string
  kecamatan?: string
  kodePos?: string

  // Tinggal & transport
  jenisTinggal?: string
  alatTransportasi?: string

  // Kontak
  hp?: string

  // Ayah
  ayahNama?: string
  ayahTahunLahir?: number
  ayahJenjangPendidikan?: string
  ayahPekerjaan?: string
  ayahPenghasilan?: string
  ayahNik?: string

  // Ibu
  ibuNama?: string
  ibuTahunLahir?: number
  ibuJenjangPendidikan?: string
  ibuPekerjaan?: string
  ibuPenghasilan?: string
  ibuNik?: string

  // Data tambahan
  rombelSaatIni?: string

  noRegistrasiAktaLahir?: string

  anakKeberapa?: number

  kip?: string

  // File dokumen
  fileKk?: string
  fileAkta?: string
  fileKtpAyah?: string
  fileKtpIbu?: string
  fileKip?: string
  fileLainnya?: string
}
