# BACK HoneyMoney

Repositorio principal para el proyecto Backend de **HoneyMoney**.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Instalación](#instalación)
- [Uso](#uso)
- [Configuración](#configuración)
- [Scripts disponibles](#scripts-disponibles)
- [Dependencias](#dependencias)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Descripción

> Este proyecto maneja la lógica de backend para una aplicación web, proporcionando endpoints para autenticación, gestión de usuarios y operaciones CRUD sobre recursos.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/FreelancerMorales/BACK.git
   cd BACK
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

Indica aquí cómo iniciar la aplicación:

```bash
npm run dev
```

> El servidor se ejecutará en `http://localhost:3001`.

## Configuración

Describe si es necesario crear archivos de entorno (`.env`) o modificar configuraciones.

Es necesario crear archivo de entorno (`.env`):
```
DATABASE_URL="mysql://root@localhost:3306/honey_money"

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=
```

## Scripts disponibles

- `npm start`: Inicia la aplicación en modo producción.
- `npm run dev`: Inicia la aplicación en modo desarrollo (con recarga automática).

## Dependencias

- Node.js
- Express
- MySQL
- Prisma

(Utiliza el comando `npm list --depth=0` para ver todas las dependencias.)

---

# Documentación de Consumo

## Información General

- **Base URL**: `http://localhost:3001` (desarrollo)
- **Autenticación**: Google OAuth (requerida para la mayoría de endpoints)
- **Formato de respuesta**: JSON
- **Middleware de autenticación**: `autenticarGoogle` (protege rutas con token JWT)

## Endpoints por Módulo

### 1. Usuarios (`/usuarios`)

#### GET `/usuarios/me`
**Descripción**: Obtiene información del usuario autenticado
- **Autenticación**: Requerida
- **Método**: GET
- **Respuesta**: Datos del usuario actual

#### GET `/usuarios`
**Descripción**: Obtiene lista de todos los usuarios (solo admin)
- **Autenticación**: Requerida + Admin
- **Método**: GET

#### POST `/usuarios`
**Descripción**: Crear nuevo usuario
- **Autenticación**: Requerida
- **Método**: POST
- **Body**: Se crea automáticamente con datos de Google OAuth

#### PUT `/usuarios/:id`
**Descripción**: Actualizar usuario
- **Autenticación**: Requerida
- **Método**: PUT
- **Body**:
```json
{
  "nombre": "string (opcional)",
  "foto": "string (URL válida, opcional)"
}
```

#### DELETE `/usuarios/:id`
**Descripción**: Eliminar usuario (soft delete)
- **Autenticación**: Requerida
- **Método**: DELETE

#### PUT `/usuarios/:id/reactivar`
**Descripción**: Reactivar usuario eliminado
- **Autenticación**: Requerida
- **Método**: PUT

---

### 2. Cuentas (`/cuentas`)

#### GET `/cuentas`
**Descripción**: Obtiene todas las cuentas del usuario autenticado
- **Autenticación**: Requerida
- **Método**: GET

#### GET `/cuentas/:id`
**Descripción**: Obtiene una cuenta específica
- **Autenticación**: Requerida
- **Método**: GET

#### GET `/cuentas/:id/saldo`
**Descripción**: Obtiene el saldo actual de una cuenta
- **Autenticación**: Requerida
- **Método**: GET

#### GET `/cuentas/:id/resumen`
**Descripción**: Obtiene resumen detallado de una cuenta
- **Autenticación**: Requerida
- **Método**: GET

#### POST `/cuentas`
**Descripción**: Crear nueva cuenta
- **Autenticación**: Requerida
- **Método**: POST
- **Body**:
```json
{
  "nombre": "string (requerido)",
  "tipo": "string (requerido)",
  "color": "string (formato #RRGGBB, opcional)",
  "montoInicial": "number (>=0, opcional)"
}
```

#### PUT `/cuentas/:id`
**Descripción**: Actualizar cuenta
- **Autenticación**: Requerida
- **Método**: PUT
- **Body**: Igual que POST pero todos los campos son opcionales

#### DELETE `/cuentas/:id`
**Descripción**: Eliminar cuenta (soft delete)
- **Autenticación**: Requerida
- **Método**: DELETE

#### PUT `/cuentas/:id/reactivar`
**Descripción**: Reactivar cuenta eliminada
- **Autenticación**: Requerida
- **Método**: PUT

---

### 3. Tipos de Movimiento (`/tipos-movimiento`)

#### GET `/tipos-movimiento`
**Descripción**: Obtiene todos los tipos de movimiento
- **Autenticación**: Requerida
- **Método**: GET

#### GET `/tipos-movimiento/:id`
**Descripción**: Obtiene un tipo de movimiento específico
- **Autenticación**: Requerida
- **Método**: GET

#### GET `/tipos-movimiento/:id/categorias`
**Descripción**: Obtiene categorías asociadas a un tipo de movimiento
- **Autenticación**: Requerida
- **Método**: GET

#### GET `/tipos-movimiento/:id/estadisticas`
**Descripción**: Obtiene estadísticas de un tipo de movimiento
- **Autenticación**: Requerida
- **Método**: GET

#### POST `/tipos-movimiento` (ADMIN)
**Descripción**: Crear nuevo tipo de movimiento
- **Autenticación**: Requerida + Admin
- **Método**: POST
- **Body**:
```json
{
  "nombre": "string (2-50 caracteres, solo letras y espacios)"
}
```

#### PUT `/tipos-movimiento/:id` (ADMIN)
**Descripción**: Actualizar tipo de movimiento
- **Autenticación**: Requerida + Admin
- **Método**: PUT
- **Body**:
```json
{
  "nombre": "string (opcional, 2-50 caracteres, solo letras y espacios)"
}
```

#### DELETE `/tipos-movimiento/:id` (ADMIN)
**Descripción**: Eliminar tipo de movimiento
- **Autenticación**: Requerida + Admin
- **Método**: DELETE

---

### 4. Categorías (`/categorias`)

#### GET `/categorias`
**Descripción**: Obtiene todas las categorías del usuario
- **Autenticación**: Requerida
- **Método**: GET

#### GET `/categorias/jerarquia`
**Descripción**: Obtiene categorías organizadas en jerarquía (padre-hijo)
- **Autenticación**: Requerida
- **Método**: GET

#### GET `/categorias/:id`
**Descripción**: Obtiene una categoría específica
- **Autenticación**: Requerida
- **Método**: GET

#### GET `/categorias/:id/estadisticas`
**Descripción**: Obtiene estadísticas de una categoría
- **Autenticación**: Requerida
- **Método**: GET

#### POST `/categorias`
**Descripción**: Crear nueva categoría
- **Autenticación**: Requerida
- **Método**: POST
- **Body**:
```json
{
  "nombre": "string (2-50 caracteres, requerido)",
  "icono": "string (máximo 100 caracteres, opcional)",
  "color": "string (formato #RRGGBB, opcional)",
  "tipoMovimientoId": "number (entero >0, requerido)",
  "padreId": "number (entero >0, opcional)"
}
```

#### PUT `/categorias/:id`
**Descripción**: Actualizar categoría
- **Autenticación**: Requerida
- **Método**: PUT
- **Body**:
```json
{
  "nombre": "string (2-50 caracteres, opcional)",
  "icono": "string (máximo 100 caracteres, opcional)",
  "color": "string (formato #RRGGBB, opcional)",
  "tipoMovimientoId": "number (entero >0, opcional)",
  "padreId": "number (entero >0 o null, opcional)"
}
```

#### DELETE `/categorias/:id`
**Descripción**: Eliminar categoría
- **Autenticación**: Requerida
- **Método**: DELETE

---

### 5. Transacciones (`/transacciones`)

#### GET `/transacciones`
**Descripción**: Obtiene transacciones con filtros
- **Autenticación**: Requerida
- **Método**: GET
- **Query Parameters**:
  - `fechaInicio`: ISO 8601 date (opcional)
  - `fechaFin`: ISO 8601 date (opcional)
  - `cuentaId`: number (opcional)
  - `categoriaId`: number (opcional)
  - `tipoMovimientoId`: number (opcional)

#### GET `/transacciones/estadisticas`
**Descripción**: Obtiene estadísticas de transacciones
- **Autenticación**: Requerida
- **Método**: GET
- **Query Parameters**: Mismos que GET `/transacciones`

#### GET `/transacciones/:id`
**Descripción**: Obtiene una transacción específica
- **Autenticación**: Requerida
- **Método**: GET

#### POST `/transacciones`
**Descripción**: Crear nueva transacción
- **Autenticación**: Requerida
- **Método**: POST
- **Body**:
```json
{
  "monto": "number (>0, máximo 2 decimales, requerido)",
  "descripcion": "string (máximo 255 caracteres, opcional)",
  "fecha": "string (ISO 8601, opcional - default: now)",
  "cuentaId": "number (entero >0, requerido)",
  "categoriaId": "number (entero >0, requerido)",
  "tipoMovimientoId": "number (entero >0, requerido)",
  "tipoPagoId": "number (entero >0, opcional)",
  "plantillaId": "number (entero >0, opcional)",
  "etiquetaIds": "array de numbers (enteros >0, sin duplicados, opcional)"
}
```

#### PUT `/transacciones/:id`
**Descripción**: Actualizar transacción
- **Autenticación**: Requerida
- **Método**: PUT
- **Body**: Igual que POST pero todos los campos son opcionales

#### DELETE `/transacciones/:id`
**Descripción**: Eliminar transacción
- **Autenticación**: Requerida
- **Método**: DELETE

---

## Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "ok": true,
  "data": {
    // Datos solicitados
  }
}
```

### Respuesta de Error
```json
{
  "ok": false,
  "error": {
    "mensaje": "Descripción del error",
    "errores": [
      {
        "field": "campo",
        "message": "mensaje específico"
      }
    ]
  }
}
```

## Validaciones Importantes

### Formatos de Datos
- **Fechas**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
- **Colores**: Hexadecimal (#RRGGBB)
- **Montos**: Números positivos con máximo 2 decimales
- **URLs**: Formato válido de URL

### Reglas de Negocio
1. **Usuarios**: ID único de Google OAuth
2. **Cuentas**: Pertenecen al usuario autenticado
3. **Categorías**: Pueden tener jerarquía (padre-hijo), únicas por usuario
4. **Transacciones**: Deben pertenecer a cuenta y categoría del usuario
5. **Tipos de Movimiento**: Gestionados por administradores
6. **Etiquetas**: Sin duplicados en transacciones

### Middlewares Aplicados
- `autenticarGoogle`: Valida token JWT de Google
- `verificarAdmin`: Valida permisos de administrador
- Validadores específicos por entidad usando express-validator

## Ejemplos de Uso

### Crear una transacción de gasto
```javascript
const response = await fetch('/transacciones', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    monto: 25.50,
    descripcion: 'Almuerzo en restaurante',
    cuentaId: 1,
    categoriaId: 5,
    tipoMovimientoId: 2,
    tipoPagoId: 1,
    etiquetaIds: [1, 3]
  })
});
```

### Obtener transacciones filtradas
```javascript
const response = await fetch('/transacciones?fechaInicio=2024-01-01&fechaFin=2024-12-31&cuentaId=1', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

## Contribuir

¡Las contribuciones son bienvenidas!  
Por favor, abre un Issue o Pull Request para sugerencias o mejoras.

1. Haz un fork del repositorio.
2. Crea una rama nueva: `git checkout -b feature/mi-nueva-feature`
3. Realiza tus cambios y haz commit: `git commit -m 'Agrega nueva feature'`
4. Haz push a tu rama: `git push origin feature/mi-nueva-feature`
5. Abre un Pull Request.

## Licencia

MIT © FreelancerMorales

## Contacto

- Email: circuitosapiens34@gmail.com
- GitHub: [FreelancerMorales](https://github.com/FreelancerMorales)
