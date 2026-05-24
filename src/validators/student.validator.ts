import Joi from 'joi'

// ─── Field helper ────────────────────────────────────────────────────────────

/** Nama lengkap: wajib, min 3 karakter, hanya huruf & spasi */
const namaField = Joi.string()
  .min(3)
  .max(150)
  .pattern(/^[a-zA-Z\s'.-]+$/)
  .messages({
    'string.base': 'Nama harus berupa teks',
    'string.min': 'Nama minimal 3 karakter',
    'string.max': 'Nama maksimal 150 karakter',
    'string.pattern.base': 'Nama hanya boleh mengandung huruf, spasi, tanda kutip, titik, atau tanda hubung',
    'any.required': 'Nama siswa wajib diisi',
  })

/** NISN: 10 digit angka */
const nisnField = Joi.string()
  .length(10)
  .pattern(/^\d+$/)
  .messages({
    'string.base': 'NISN harus berupa teks angka',
    'string.length': 'NISN harus tepat 10 digit',
    'string.pattern.base': 'NISN hanya boleh mengandung angka',
  })

/** NIK: 16 digit angka */
const nikField = Joi.string()
  .length(16)
  .pattern(/^\d+$/)
  .messages({
    'string.base': 'NIK harus berupa teks angka',
    'string.length': 'NIK harus tepat 16 digit',
    'string.pattern.base': 'NIK hanya boleh mengandung angka',
  })

/** NIPD: maks 50 karakter */
const nipdField = Joi.string()
  .max(50)
  .messages({
    'string.base': 'NIPD harus berupa teks',
    'string.max': 'NIPD maksimal 50 karakter',
  })

/** Jenis kelamin: hanya L atau P */
const jkField = Joi.string()
  .valid('L', 'P')
  .messages({
    'any.only': 'Jenis kelamin harus L (Laki-laki) atau P (Perempuan)',
  })

/** Nomor HP: angka, boleh diawali +, min 8 maks 15 digit */
const hpField = Joi.string()
  .pattern(/^\+?[\d\s-]{8,15}$/)
  .messages({
    'string.pattern.base': 'Format nomor HP tidak valid (contoh: 08123456789)',
  })

/** Tanggal: menerima string ISO maupun objek Date */
const dateField = Joi.alternatives().try(
  Joi.date().iso(),
  Joi.string().isoDate(),
).messages({
  'alternatives.match': 'Format tanggal tidak valid, gunakan format ISO 8601 (contoh: 2005-04-12)',
})

/** Tahun lahir: 4 digit, antara 1900 dan tahun sekarang */
const tahunLahirField = Joi.number()
  .integer()
  .min(1900)
  .max(new Date().getFullYear())
  .messages({
    'number.base': 'Tahun lahir harus berupa angka',
    'number.integer': 'Tahun lahir harus bilangan bulat',
    'number.min': 'Tahun lahir tidak boleh sebelum 1900',
    'number.max': `Tahun lahir tidak boleh lebih dari ${new Date().getFullYear()}`,
  })

/** Field string pendek generik (maks 100 karakter) */
const shortStringField = (maxLen = 100) =>
  Joi.string().max(maxLen).messages({
    'string.base': 'Field harus berupa teks',
    'string.max': `Field maksimal ${maxLen} karakter`,
  })

/** Field nama file/path (maks 255 karakter) */
const fileField = Joi.string()
  .max(255)
  .messages({
    'string.max': 'Path file maksimal 255 karakter',
  })

// ─── Schema CREATE (POST /students) ──────────────────────────────────────────
// Field `nama` WAJIB, semua lainnya opsional

export const createStudentSchema = Joi.object({
  // Nomor urut
  no: Joi.number().integer().positive().optional().messages({
    'number.base': 'Nomor urut harus berupa angka',
    'number.integer': 'Nomor urut harus bilangan bulat',
    'number.positive': 'Nomor urut harus bernilai positif',
  }),

  // Identitas utama
  nama: namaField.required(),
  nipd: nipdField.optional(),
  nisn: nisnField.optional(),
  nik: nikField.optional(),
  jk: jkField.optional(),

  // Lahir
  tempatLahir: shortStringField(100).optional(),
  tanggalLahir: dateField.optional(),

  // Sosial & agama
  agama: shortStringField(50).optional(),

  // Alamat
  alamat: Joi.string().max(5000).optional().messages({
    'string.max': 'Alamat maksimal 5000 karakter',
  }),
  rt: Joi.string().max(10).optional(),
  rw: Joi.string().max(10).optional(),
  dusun: shortStringField(100).optional(),
  kelurahan: shortStringField(100).optional(),
  kecamatan: shortStringField(100).optional(),
  kodePos: Joi.string().max(10).pattern(/^\d+$/).optional().messages({
    'string.pattern.base': 'Kode pos hanya boleh berisi angka',
  }),

  // Tinggal & transportasi
  jenisTinggal: shortStringField(100).optional(),
  alatTransportasi: shortStringField(100).optional(),

  // Kontak
  hp: hpField.optional(),

  // Data ayah
  ayahNama: shortStringField(150).optional(),
  ayahTahunLahir: tahunLahirField.optional(),
  ayahJenjangPendidikan: shortStringField(100).optional(),
  ayahPekerjaan: shortStringField(100).optional(),
  ayahPenghasilan: shortStringField(100).optional(),
  ayahNik: nikField.optional(),

  // Data ibu
  ibuNama: shortStringField(150).optional(),
  ibuTahunLahir: tahunLahirField.optional(),
  ibuJenjangPendidikan: shortStringField(100).optional(),
  ibuPekerjaan: shortStringField(100).optional(),
  ibuPenghasilan: shortStringField(100).optional(),
  ibuNik: nikField.optional(),

  // Data sekolah
  rombelSaatIni: shortStringField(100).optional(),
  noRegistrasiAktaLahir: shortStringField(100).optional(),
  anakKeberapa: Joi.number().integer().min(1).max(20).optional().messages({
    'number.base': 'Anak ke-berapa harus berupa angka',
    'number.integer': 'Anak ke-berapa harus bilangan bulat',
    'number.min': 'Anak ke-berapa minimal 1',
    'number.max': 'Anak ke-berapa maksimal 20',
  }),
  kip: shortStringField(100).optional(),

  // File dokumen
  fileKk: fileField.optional(),
  fileAkta: fileField.optional(),
  fileKtpAyah: fileField.optional(),
  fileKtpIbu: fileField.optional(),
  fileKip: fileField.optional(),
  fileLainnya: fileField.optional(),

  // Status siswa — biasanya dikelola oleh sistem (ACTIVE/DELETED),
  // tapi boleh diset secara eksplisit jika diperlukan
  status: Joi.string()
    .valid('ACTIVE', 'DELETED')
    .optional()
    .messages({
      'any.only': 'Status siswa hanya boleh bernilai ACTIVE atau DELETED',
    }),
}).options({
  // Field tidak dikenal (mis. status, id, createdAt) akan dibuang secara diam-diam,
  // BUKAN ditolak — agar testing via Postman lebih fleksibel dan tidak mengganggu.
  stripUnknown: true,
  abortEarly: false, // Tampilkan SEMUA error validasi sekaligus
})

// ─── Schema UPDATE (PUT /students/:id) ───────────────────────────────────────
// Sama dengan CREATE, tapi semua field opsional + minimal 1 field wajib dikirim

export const updateStudentSchema = createStudentSchema
  .fork(Object.keys(createStudentSchema.describe().keys), (schema) =>
    schema.optional(),
  )
  .min(1) // minimal 1 field harus dikirim
  .messages({
    'object.min': 'Setidaknya satu field harus dikirim untuk diperbarui',
  })
