/*
  Warnings:

  - You are about to alter the column `nombre` on the `cuenta` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `tipo` on the `cuenta` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `color` on the `cuenta` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(7)`.
  - You are about to alter the column `nombre` on the `etiqueta` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `color` on the `etiqueta` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(7)`.
  - You are about to drop the column `categoriaId` on the `proyeccion` table. All the data in the column will be lost.
  - You are about to alter the column `estado` on the `proyeccion` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `nombre` on the `tipomovimiento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `nombre` on the `tipopago` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the column `categoriaId` on the `transaccion` table. All the data in the column will be lost.
  - You are about to drop the column `plantillaId` on the `transaccion` table. All the data in the column will be lost.
  - You are about to alter the column `nombre` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `correo` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to drop the `categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `etiquetaonplantilla` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plantilla` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usuarioId,nombre]` on the table `Etiqueta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actualizadoEn` to the `Cuenta` table without a default value. This is not possible if the table is not empty.
  - Made the column `montoInicial` on table `cuenta` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `actualizadoEn` to the `Proyeccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Proyeccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioCategoriaId` to the `Proyeccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Transaccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioCategoriaId` to the `Transaccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `categoria` DROP FOREIGN KEY `Categoria_padreId_fkey`;

-- DropForeignKey
ALTER TABLE `categoria` DROP FOREIGN KEY `Categoria_tipoMovimientoId_fkey`;

-- DropForeignKey
ALTER TABLE `categoria` DROP FOREIGN KEY `Categoria_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `cuenta` DROP FOREIGN KEY `Cuenta_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `etiqueta` DROP FOREIGN KEY `Etiqueta_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `etiquetaonplantilla` DROP FOREIGN KEY `EtiquetaOnPlantilla_etiquetaId_fkey`;

-- DropForeignKey
ALTER TABLE `etiquetaonplantilla` DROP FOREIGN KEY `EtiquetaOnPlantilla_plantillaId_fkey`;

-- DropForeignKey
ALTER TABLE `etiquetaontransaccion` DROP FOREIGN KEY `EtiquetaOnTransaccion_etiquetaId_fkey`;

-- DropForeignKey
ALTER TABLE `etiquetaontransaccion` DROP FOREIGN KEY `EtiquetaOnTransaccion_transaccionId_fkey`;

-- DropForeignKey
ALTER TABLE `plantilla` DROP FOREIGN KEY `Plantilla_categoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `plantilla` DROP FOREIGN KEY `Plantilla_cuentaId_fkey`;

-- DropForeignKey
ALTER TABLE `plantilla` DROP FOREIGN KEY `Plantilla_tipoMovimientoId_fkey`;

-- DropForeignKey
ALTER TABLE `plantilla` DROP FOREIGN KEY `Plantilla_tipoPagoId_fkey`;

-- DropForeignKey
ALTER TABLE `plantilla` DROP FOREIGN KEY `Plantilla_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `proyeccion` DROP FOREIGN KEY `Proyeccion_categoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `proyeccion` DROP FOREIGN KEY `Proyeccion_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_categoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_plantillaId_fkey`;

-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_usuarioId_fkey`;

-- DropIndex
DROP INDEX `Cuenta_usuarioId_fkey` ON `cuenta`;

-- DropIndex
DROP INDEX `Etiqueta_usuarioId_fkey` ON `etiqueta`;

-- DropIndex
DROP INDEX `Proyeccion_categoriaId_fkey` ON `proyeccion`;

-- DropIndex
DROP INDEX `Proyeccion_usuarioId_fkey` ON `proyeccion`;

-- DropIndex
DROP INDEX `Transaccion_categoriaId_fkey` ON `transaccion`;

-- DropIndex
DROP INDEX `Transaccion_plantillaId_fkey` ON `transaccion`;

-- DropIndex
DROP INDEX `Transaccion_usuarioId_fkey` ON `transaccion`;

-- AlterTable
ALTER TABLE `cuenta` ADD COLUMN `actualizadoEn` DATETIME(3) NOT NULL,
    ADD COLUMN `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `orden` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `saldoActual` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    MODIFY `nombre` VARCHAR(100) NOT NULL,
    MODIFY `tipo` ENUM('CORRIENTE', 'AHORROS', 'CREDITO', 'EFECTIVO', 'INVERSION') NOT NULL,
    MODIFY `color` VARCHAR(7) NULL,
    MODIFY `montoInicial` DECIMAL(15, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `etiqueta` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `descripcion` VARCHAR(200) NULL,
    MODIFY `nombre` VARCHAR(100) NOT NULL,
    MODIFY `color` VARCHAR(7) NULL;

-- AlterTable
ALTER TABLE `etiquetaontransaccion` ADD COLUMN `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `proyeccion` DROP COLUMN `categoriaId`,
    ADD COLUMN `actualizadoEn` DATETIME(3) NOT NULL,
    ADD COLUMN `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `diasNotificacion` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `fechaVencimiento` DATETIME(3) NULL,
    ADD COLUMN `frecuencia` VARCHAR(20) NULL,
    ADD COLUMN `notificar` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `proximaFecha` DATETIME(3) NULL,
    ADD COLUMN `recurrente` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `titulo` VARCHAR(100) NOT NULL,
    ADD COLUMN `usuarioCategoriaId` INTEGER NOT NULL,
    MODIFY `monto` DECIMAL(15, 2) NOT NULL,
    MODIFY `descripcion` VARCHAR(500) NULL,
    MODIFY `estado` ENUM('PENDIENTE', 'CONFIRMADA', 'OMITIDA', 'VENCIDA') NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE `tipomovimiento` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `descripcion` VARCHAR(200) NULL,
    ADD COLUMN `transferencia` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `nombre` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `tipopago` ADD COLUMN `descripcion` VARCHAR(200) NULL,
    ADD COLUMN `orden` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `requiereReferencia` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `nombre` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `transaccion` DROP COLUMN `categoriaId`,
    DROP COLUMN `plantillaId`,
    ADD COLUMN `actualizadoEn` DATETIME(3) NOT NULL,
    ADD COLUMN `confirmada` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `notas` TEXT NULL,
    ADD COLUMN `usuarioCategoriaId` INTEGER NOT NULL,
    MODIFY `monto` DECIMAL(15, 2) NOT NULL,
    MODIFY `descripcion` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `actualizadoEn` DATETIME(3) NOT NULL,
    MODIFY `nombre` VARCHAR(100) NOT NULL,
    MODIFY `correo` VARCHAR(150) NOT NULL,
    MODIFY `foto` VARCHAR(500) NULL;

-- DropTable
DROP TABLE `categoria`;

-- DropTable
DROP TABLE `etiquetaonplantilla`;

-- DropTable
DROP TABLE `plantilla`;

-- CreateTable
CREATE TABLE `Icono` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `codigo` VARCHAR(100) NOT NULL,
    `categoria` VARCHAR(50) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    INDEX `Icono_categoria_activo_idx`(`categoria`, `activo`),
    INDEX `Icono_nombre_idx`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Color` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `hex` VARCHAR(7) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    INDEX `Color_activo_idx`(`activo`),
    UNIQUE INDEX `Color_hex_key`(`hex`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriaBase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(200) NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `esSubcategoria` BOOLEAN NOT NULL DEFAULT false,
    `nivel` INTEGER NOT NULL DEFAULT 0,
    `iconoId` INTEGER NOT NULL,
    `colorId` INTEGER NOT NULL,
    `tipoMovimientoId` INTEGER NOT NULL,
    `padreId` INTEGER NULL,

    INDEX `CategoriaBase_tipoMovimientoId_activo_orden_idx`(`tipoMovimientoId`, `activo`, `orden`),
    INDEX `CategoriaBase_padreId_orden_idx`(`padreId`, `orden`),
    INDEX `CategoriaBase_activo_esSubcategoria_idx`(`activo`, `esSubcategoria`),
    INDEX `CategoriaBase_nivel_orden_idx`(`nivel`, `orden`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuarioCategoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` VARCHAR(191) NOT NULL,
    `categoriaBaseId` INTEGER NOT NULL,
    `tipoMovimientoId` INTEGER NOT NULL,

    INDEX `UsuarioCategoria_usuarioId_tipoMovimientoId_activo_idx`(`usuarioId`, `tipoMovimientoId`, `activo`),
    INDEX `UsuarioCategoria_categoriaBaseId_idx`(`categoriaBaseId`),
    UNIQUE INDEX `UsuarioCategoria_usuarioId_categoriaBaseId_key`(`usuarioId`, `categoriaBaseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Cuenta_usuarioId_activo_idx` ON `Cuenta`(`usuarioId`, `activo`);

-- CreateIndex
CREATE INDEX `Cuenta_usuarioId_orden_idx` ON `Cuenta`(`usuarioId`, `orden`);

-- CreateIndex
CREATE INDEX `Etiqueta_usuarioId_activo_idx` ON `Etiqueta`(`usuarioId`, `activo`);

-- CreateIndex
CREATE UNIQUE INDEX `Etiqueta_usuarioId_nombre_key` ON `Etiqueta`(`usuarioId`, `nombre`);

-- CreateIndex
CREATE INDEX `Proyeccion_usuarioId_fecha_idx` ON `Proyeccion`(`usuarioId`, `fecha` ASC);

-- CreateIndex
CREATE INDEX `Proyeccion_usuarioId_estado_fecha_idx` ON `Proyeccion`(`usuarioId`, `estado`, `fecha` ASC);

-- CreateIndex
CREATE INDEX `Proyeccion_fecha_estado_notificar_idx` ON `Proyeccion`(`fecha`, `estado`, `notificar`);

-- CreateIndex
CREATE INDEX `Proyeccion_proximaFecha_recurrente_idx` ON `Proyeccion`(`proximaFecha`, `recurrente`);

-- CreateIndex
CREATE INDEX `Proyeccion_cuentaId_estado_idx` ON `Proyeccion`(`cuentaId`, `estado`);

-- CreateIndex
CREATE INDEX `TipoMovimiento_activo_idx` ON `TipoMovimiento`(`activo`);

-- CreateIndex
CREATE INDEX `TipoPago_activo_orden_idx` ON `TipoPago`(`activo`, `orden`);

-- CreateIndex
CREATE INDEX `Transaccion_usuarioId_fecha_idx` ON `Transaccion`(`usuarioId`, `fecha` DESC);

-- CreateIndex
CREATE INDEX `Transaccion_cuentaId_fecha_idx` ON `Transaccion`(`cuentaId`, `fecha` DESC);

-- CreateIndex
CREATE INDEX `Transaccion_usuarioCategoriaId_fecha_idx` ON `Transaccion`(`usuarioCategoriaId`, `fecha` DESC);

-- CreateIndex
CREATE INDEX `Transaccion_tipoMovimientoId_fecha_idx` ON `Transaccion`(`tipoMovimientoId`, `fecha` DESC);

-- CreateIndex
CREATE INDEX `Transaccion_fecha_confirmada_idx` ON `Transaccion`(`fecha` DESC, `confirmada`);

-- CreateIndex
CREATE INDEX `Transaccion_usuarioId_confirmada_fecha_idx` ON `Transaccion`(`usuarioId`, `confirmada`, `fecha` DESC);

-- CreateIndex
CREATE INDEX `Usuario_correo_idx` ON `Usuario`(`correo`);

-- CreateIndex
CREATE INDEX `Usuario_activo_idx` ON `Usuario`(`activo`);

-- AddForeignKey
ALTER TABLE `Cuenta` ADD CONSTRAINT `Cuenta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriaBase` ADD CONSTRAINT `CategoriaBase_padreId_fkey` FOREIGN KEY (`padreId`) REFERENCES `CategoriaBase`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriaBase` ADD CONSTRAINT `CategoriaBase_iconoId_fkey` FOREIGN KEY (`iconoId`) REFERENCES `Icono`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriaBase` ADD CONSTRAINT `CategoriaBase_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `Color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriaBase` ADD CONSTRAINT `CategoriaBase_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `TipoMovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioCategoria` ADD CONSTRAINT `UsuarioCategoria_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioCategoria` ADD CONSTRAINT `UsuarioCategoria_categoriaBaseId_fkey` FOREIGN KEY (`categoriaBaseId`) REFERENCES `CategoriaBase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioCategoria` ADD CONSTRAINT `UsuarioCategoria_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `TipoMovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_usuarioCategoriaId_fkey` FOREIGN KEY (`usuarioCategoriaId`) REFERENCES `UsuarioCategoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Etiqueta` ADD CONSTRAINT `Etiqueta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtiquetaOnTransaccion` ADD CONSTRAINT `EtiquetaOnTransaccion_transaccionId_fkey` FOREIGN KEY (`transaccionId`) REFERENCES `Transaccion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtiquetaOnTransaccion` ADD CONSTRAINT `EtiquetaOnTransaccion_etiquetaId_fkey` FOREIGN KEY (`etiquetaId`) REFERENCES `Etiqueta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyeccion` ADD CONSTRAINT `Proyeccion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyeccion` ADD CONSTRAINT `Proyeccion_usuarioCategoriaId_fkey` FOREIGN KEY (`usuarioCategoriaId`) REFERENCES `UsuarioCategoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `EtiquetaOnTransaccion_etiquetaId_idx` ON `EtiquetaOnTransaccion`(`etiquetaId`);
DROP INDEX `EtiquetaOnTransaccion_etiquetaId_fkey` ON `etiquetaontransaccion`;
