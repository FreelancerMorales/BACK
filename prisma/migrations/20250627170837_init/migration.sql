-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuenta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `montoInicial` DOUBLE NULL,
    `usuarioId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoMovimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TipoMovimiento_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `icono` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `tipoMovimientoId` INTEGER NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `padreId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `monto` DOUBLE NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cuentaId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `tipoMovimientoId` INTEGER NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `tipoPagoId` INTEGER NULL,
    `plantillaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoPago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `TipoPago_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etiqueta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `usuarioId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EtiquetaOnTransaccion` (
    `transaccionId` INTEGER NOT NULL,
    `etiquetaId` INTEGER NOT NULL,

    PRIMARY KEY (`transaccionId`, `etiquetaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plantilla` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `monto` DOUBLE NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `categoriaId` INTEGER NOT NULL,
    `cuentaId` INTEGER NOT NULL,
    `tipoMovimientoId` INTEGER NOT NULL,
    `tipoPagoId` INTEGER NULL,
    `usuarioId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EtiquetaOnPlantilla` (
    `plantillaId` INTEGER NOT NULL,
    `etiquetaId` INTEGER NOT NULL,

    PRIMARY KEY (`plantillaId`, `etiquetaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proyeccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `monto` DOUBLE NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'pendiente',
    `cuentaId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `tipoMovimientoId` INTEGER NOT NULL,
    `tipoPagoId` INTEGER NULL,
    `usuarioId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cuenta` ADD CONSTRAINT `Cuenta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categoria` ADD CONSTRAINT `Categoria_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `TipoMovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categoria` ADD CONSTRAINT `Categoria_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categoria` ADD CONSTRAINT `Categoria_padreId_fkey` FOREIGN KEY (`padreId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_cuentaId_fkey` FOREIGN KEY (`cuentaId`) REFERENCES `Cuenta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `TipoMovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_tipoPagoId_fkey` FOREIGN KEY (`tipoPagoId`) REFERENCES `TipoPago`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_plantillaId_fkey` FOREIGN KEY (`plantillaId`) REFERENCES `Plantilla`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Etiqueta` ADD CONSTRAINT `Etiqueta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtiquetaOnTransaccion` ADD CONSTRAINT `EtiquetaOnTransaccion_transaccionId_fkey` FOREIGN KEY (`transaccionId`) REFERENCES `Transaccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtiquetaOnTransaccion` ADD CONSTRAINT `EtiquetaOnTransaccion_etiquetaId_fkey` FOREIGN KEY (`etiquetaId`) REFERENCES `Etiqueta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantilla` ADD CONSTRAINT `Plantilla_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantilla` ADD CONSTRAINT `Plantilla_cuentaId_fkey` FOREIGN KEY (`cuentaId`) REFERENCES `Cuenta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantilla` ADD CONSTRAINT `Plantilla_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantilla` ADD CONSTRAINT `Plantilla_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `TipoMovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantilla` ADD CONSTRAINT `Plantilla_tipoPagoId_fkey` FOREIGN KEY (`tipoPagoId`) REFERENCES `TipoPago`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtiquetaOnPlantilla` ADD CONSTRAINT `EtiquetaOnPlantilla_plantillaId_fkey` FOREIGN KEY (`plantillaId`) REFERENCES `Plantilla`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtiquetaOnPlantilla` ADD CONSTRAINT `EtiquetaOnPlantilla_etiquetaId_fkey` FOREIGN KEY (`etiquetaId`) REFERENCES `Etiqueta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyeccion` ADD CONSTRAINT `Proyeccion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyeccion` ADD CONSTRAINT `Proyeccion_cuentaId_fkey` FOREIGN KEY (`cuentaId`) REFERENCES `Cuenta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyeccion` ADD CONSTRAINT `Proyeccion_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyeccion` ADD CONSTRAINT `Proyeccion_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `TipoMovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proyeccion` ADD CONSTRAINT `Proyeccion_tipoPagoId_fkey` FOREIGN KEY (`tipoPagoId`) REFERENCES `TipoPago`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
