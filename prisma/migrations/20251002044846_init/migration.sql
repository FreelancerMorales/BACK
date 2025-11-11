-- CreateTable
CREATE TABLE `categoriabase` (
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

    INDEX `CategoriaBase_activo_esSubcategoria_idx`(`activo`, `esSubcategoria`),
    INDEX `CategoriaBase_colorId_fkey`(`colorId`),
    INDEX `CategoriaBase_iconoId_fkey`(`iconoId`),
    INDEX `CategoriaBase_nivel_orden_idx`(`nivel`, `orden`),
    INDEX `CategoriaBase_padreId_orden_idx`(`padreId`, `orden`),
    INDEX `CategoriaBase_tipoMovimientoId_activo_orden_idx`(`tipoMovimientoId`, `activo`, `orden`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `color` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `hex` VARCHAR(7) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Color_hex_key`(`hex`),
    INDEX `Color_activo_idx`(`activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuenta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `tipo` ENUM('CORRIENTE', 'AHORROS', 'CREDITO', 'EFECTIVO', 'INVERSION') NOT NULL,
    `color` VARCHAR(7) NULL,
    `montoInicial` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `usuarioId` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `actualizadoEn` DATETIME(3) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orden` INTEGER NOT NULL DEFAULT 0,
    `saldoActual` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,

    INDEX `Cuenta_usuarioId_activo_idx`(`usuarioId`, `activo`),
    INDEX `Cuenta_usuarioId_orden_idx`(`usuarioId`, `orden`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etiqueta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `color` VARCHAR(7) NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `descripcion` VARCHAR(200) NULL,

    INDEX `Etiqueta_usuarioId_activo_idx`(`usuarioId`, `activo`),
    UNIQUE INDEX `Etiqueta_usuarioId_nombre_key`(`usuarioId`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etiquetaontransaccion` (
    `transaccionId` INTEGER NOT NULL,
    `etiquetaId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EtiquetaOnTransaccion_etiquetaId_idx`(`etiquetaId`),
    PRIMARY KEY (`transaccionId`, `etiquetaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `icono` (
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
CREATE TABLE `proyeccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `estado` ENUM('PENDIENTE', 'CONFIRMADA', 'OMITIDA', 'VENCIDA') NOT NULL DEFAULT 'PENDIENTE',
    `cuentaId` INTEGER NOT NULL,
    `tipoMovimientoId` INTEGER NOT NULL,
    `tipoPagoId` INTEGER NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `actualizadoEn` DATETIME(3) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diasNotificacion` INTEGER NOT NULL DEFAULT 1,
    `fechaVencimiento` DATETIME(3) NULL,
    `frecuencia` VARCHAR(20) NULL,
    `notificar` BOOLEAN NOT NULL DEFAULT true,
    `proximaFecha` DATETIME(3) NULL,
    `recurrente` BOOLEAN NOT NULL DEFAULT false,
    `titulo` VARCHAR(100) NOT NULL,
    `usuarioCategoriaId` INTEGER NOT NULL,

    INDEX `Proyeccion_cuentaId_estado_idx`(`cuentaId`, `estado`),
    INDEX `Proyeccion_fecha_estado_notificar_idx`(`fecha`, `estado`, `notificar`),
    INDEX `Proyeccion_proximaFecha_recurrente_idx`(`proximaFecha`, `recurrente`),
    INDEX `Proyeccion_tipoMovimientoId_fkey`(`tipoMovimientoId`),
    INDEX `Proyeccion_tipoPagoId_fkey`(`tipoPagoId`),
    INDEX `Proyeccion_usuarioCategoriaId_fkey`(`usuarioCategoriaId`),
    INDEX `Proyeccion_usuarioId_estado_fecha_idx`(`usuarioId`, `estado`, `fecha`),
    INDEX `Proyeccion_usuarioId_fecha_idx`(`usuarioId`, `fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipomovimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `descripcion` VARCHAR(200) NULL,
    `transferencia` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `TipoMovimiento_nombre_key`(`nombre`),
    INDEX `TipoMovimiento_activo_idx`(`activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipopago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `descripcion` VARCHAR(200) NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `requiereReferencia` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `TipoPago_nombre_key`(`nombre`),
    INDEX `TipoPago_activo_orden_idx`(`activo`, `orden`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `monto` DECIMAL(15, 2) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cuentaId` INTEGER NOT NULL,
    `tipoMovimientoId` INTEGER NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `tipoPagoId` INTEGER NULL,
    `actualizadoEn` DATETIME(3) NOT NULL,
    `confirmada` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notas` TEXT NULL,
    `usuarioCategoriaId` INTEGER NOT NULL,

    INDEX `Transaccion_cuentaId_fecha_idx`(`cuentaId`, `fecha`),
    INDEX `Transaccion_fecha_confirmada_idx`(`fecha`, `confirmada`),
    INDEX `Transaccion_tipoMovimientoId_fecha_idx`(`tipoMovimientoId`, `fecha`),
    INDEX `Transaccion_tipoPagoId_fkey`(`tipoPagoId`),
    INDEX `Transaccion_usuarioCategoriaId_fecha_idx`(`usuarioCategoriaId`, `fecha`),
    INDEX `Transaccion_usuarioId_confirmada_fecha_idx`(`usuarioId`, `confirmada`, `fecha`),
    INDEX `Transaccion_usuarioId_fecha_idx`(`usuarioId`, `fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(150) NOT NULL,
    `foto` VARCHAR(500) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    INDEX `Usuario_activo_idx`(`activo`),
    INDEX `Usuario_correo_idx`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuariocategoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` VARCHAR(191) NOT NULL,
    `categoriaBaseId` INTEGER NOT NULL,
    `tipoMovimientoId` INTEGER NOT NULL,

    INDEX `UsuarioCategoria_categoriaBaseId_idx`(`categoriaBaseId`),
    INDEX `UsuarioCategoria_tipoMovimientoId_fkey`(`tipoMovimientoId`),
    INDEX `UsuarioCategoria_usuarioId_tipoMovimientoId_activo_idx`(`usuarioId`, `tipoMovimientoId`, `activo`),
    UNIQUE INDEX `UsuarioCategoria_usuarioId_categoriaBaseId_tipoMovimientoId_key`(`usuarioId`, `categoriaBaseId`, `tipoMovimientoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categoriabase` ADD CONSTRAINT `CategoriaBase_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categoriabase` ADD CONSTRAINT `CategoriaBase_iconoId_fkey` FOREIGN KEY (`iconoId`) REFERENCES `icono`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categoriabase` ADD CONSTRAINT `CategoriaBase_padreId_fkey` FOREIGN KEY (`padreId`) REFERENCES `categoriabase`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categoriabase` ADD CONSTRAINT `CategoriaBase_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `tipomovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cuenta` ADD CONSTRAINT `Cuenta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etiqueta` ADD CONSTRAINT `Etiqueta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etiquetaontransaccion` ADD CONSTRAINT `EtiquetaOnTransaccion_etiquetaId_fkey` FOREIGN KEY (`etiquetaId`) REFERENCES `etiqueta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etiquetaontransaccion` ADD CONSTRAINT `EtiquetaOnTransaccion_transaccionId_fkey` FOREIGN KEY (`transaccionId`) REFERENCES `transaccion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyeccion` ADD CONSTRAINT `Proyeccion_cuentaId_fkey` FOREIGN KEY (`cuentaId`) REFERENCES `cuenta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyeccion` ADD CONSTRAINT `Proyeccion_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `tipomovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyeccion` ADD CONSTRAINT `Proyeccion_tipoPagoId_fkey` FOREIGN KEY (`tipoPagoId`) REFERENCES `tipopago`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyeccion` ADD CONSTRAINT `Proyeccion_usuarioCategoriaId_fkey` FOREIGN KEY (`usuarioCategoriaId`) REFERENCES `usuariocategoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyeccion` ADD CONSTRAINT `Proyeccion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaccion` ADD CONSTRAINT `Transaccion_cuentaId_fkey` FOREIGN KEY (`cuentaId`) REFERENCES `cuenta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaccion` ADD CONSTRAINT `Transaccion_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `tipomovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaccion` ADD CONSTRAINT `Transaccion_tipoPagoId_fkey` FOREIGN KEY (`tipoPagoId`) REFERENCES `tipopago`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaccion` ADD CONSTRAINT `Transaccion_usuarioCategoriaId_fkey` FOREIGN KEY (`usuarioCategoriaId`) REFERENCES `usuariocategoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaccion` ADD CONSTRAINT `Transaccion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuariocategoria` ADD CONSTRAINT `UsuarioCategoria_categoriaBaseId_fkey` FOREIGN KEY (`categoriaBaseId`) REFERENCES `categoriabase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuariocategoria` ADD CONSTRAINT `UsuarioCategoria_tipoMovimientoId_fkey` FOREIGN KEY (`tipoMovimientoId`) REFERENCES `tipomovimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuariocategoria` ADD CONSTRAINT `UsuarioCategoria_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
