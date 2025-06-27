/*
  Warnings:

  - A unique constraint covering the columns `[nombre,usuarioId]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Categoria_nombre_usuarioId_key` ON `Categoria`(`nombre`, `usuarioId`);
