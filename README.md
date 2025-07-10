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
