-- CreateTable
CREATE TABLE `dokumen_siswa` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `siswa_id` BIGINT UNSIGNED NOT NULL,
    `jenis_dokumen_id` BIGINT UNSIGNED NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `uploaded_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ket` TEXT NULL,

    INDEX `dokumen_siswa_jenis_dokumen_id_foreign`(`jenis_dokumen_id`),
    INDEX `dokumen_siswa_siswa_id_foreign`(`siswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guru` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `nip` VARCHAR(255) NOT NULL,
    `no_hp` VARCHAR(255) NOT NULL,
    `alamat` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jenis_dokumen` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_kelas` VARCHAR(255) NOT NULL,
    `wali_kelas_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `kelas_wali_kelas_id_foreign`(`wali_kelas_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orang_tua` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `hubungan` VARCHAR(255) NOT NULL,
    `no_hp` VARCHAR(255) NOT NULL,
    `alamat` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayat_kelas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `siswa_id` BIGINT UNSIGNED NOT NULL,
    `kelas_id` BIGINT UNSIGNED NOT NULL,
    `tahun_ajaran_id` BIGINT UNSIGNED NOT NULL,
    `tanggal_masuk` DATE NOT NULL,
    `tanggal_keluar` DATE NULL,

    INDEX `riwayat_kelas_kelas_id_foreign`(`kelas_id`),
    INDEX `riwayat_kelas_siswa_id_foreign`(`siswa_id`),
    INDEX `riwayat_kelas_tahun_ajaran_id_foreign`(`tahun_ajaran_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `siswa` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `NIS` VARCHAR(255) NOT NULL,
    `nama_lengkap` VARCHAR(255) NOT NULL,
    `jenis_kelamin` VARCHAR(255) NOT NULL,
    `tanggal_lahir` DATE NOT NULL,
    `Alamat` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `siswa_orang_tua` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `siswa_id` BIGINT UNSIGNED NOT NULL,
    `orang_tua_id` BIGINT UNSIGNED NOT NULL,

    INDEX `siswa_orang_tua_orang_tua_id_foreign`(`orang_tua_id`),
    INDEX `siswa_orang_tua_siswa_id_foreign`(`siswa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tahun_ajaran` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `aktif` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `guru_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `users_guru_id_foreign`(`guru_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dokumen_siswa` ADD CONSTRAINT `dokumen_siswa_jenis_dokumen_id_foreign` FOREIGN KEY (`jenis_dokumen_id`) REFERENCES `jenis_dokumen`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dokumen_siswa` ADD CONSTRAINT `dokumen_siswa_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_wali_kelas_id_foreign` FOREIGN KEY (`wali_kelas_id`) REFERENCES `guru`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `riwayat_kelas` ADD CONSTRAINT `riwayat_kelas_kelas_id_foreign` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `riwayat_kelas` ADD CONSTRAINT `riwayat_kelas_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `riwayat_kelas` ADD CONSTRAINT `riwayat_kelas_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `siswa_orang_tua` ADD CONSTRAINT `siswa_orang_tua_orang_tua_id_foreign` FOREIGN KEY (`orang_tua_id`) REFERENCES `orang_tua`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `siswa_orang_tua` ADD CONSTRAINT `siswa_orang_tua_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `guru`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
