/*
  Warnings:

  - You are about to drop the column `Alamat` on the `siswa` table. All the data in the column will be lost.
  - Added the required column `alamat` to the `siswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `siswa` DROP COLUMN `Alamat`,
    ADD COLUMN `alamat` TEXT NOT NULL;
