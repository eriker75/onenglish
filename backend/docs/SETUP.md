# 🚀 Setup Guide - OnEnglish Backend

## ⚙️ Configuración de Variables de Entorno

### Paso 1: Crear el archivo .env

Copia el archivo de ejemplo y configúralo:

```bash
# Opción 1: Copiar el archivo de ejemplo
cp .env.example .env

# Opción 2: Crear manualmente
nano .env  # o usa tu editor favorito
```

### Paso 2: Configurar las Variables

El archivo `.env.example` ya tiene valores por defecto funcionales. Si lo copiaste, puedes usarlo directamente para desarrollo. Para producción, **CAMBIA TODAS LAS CONTRASEÑAS Y SECRETOS**.

#### Variables Principales (ya configuradas en .env.example):

```bash
# ========================================
# GENERAL SETTINGS
# ========================================
TZ=America/Caracas
NODE_ENV=development

# ========================================
# BACKEND CONFIGURATION
# ========================================
BACKEND_PORT=3000

# ========================================
# POSTGRESQL CONFIGURATION
# ========================================
POSTGRES_USER=onenglish_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=onenglishdb
POSTGRES_EXT_PORT=5432

# ⚠️ IMPORTANTE: Usar 'postgres' como host para Docker
DATABASE_URL=postgresql://onenglish_user:your_secure_password_here@postgres:5432/onenglishdb?schema=public

# ========================================
# PGADMIN CONFIGURATION
# ========================================
PGADMIN_DEFAULT_EMAIL=admin@onenglish.com
PGADMIN_DEFAULT_PASSWORD=admin_password_here
PGADMIN_PORT=5050

# ========================================
# MONGODB CONFIGURATION
# ========================================
MONGO_USERNAME=mongoadmin
MONGO_PASSWORD=your_mongo_password_here
MONGO_EXT_PORT=27017

# ⚠️ IMPORTANTE: Usar 'mongo' como host para Docker
MONGODB_URI=mongodb://mongoadmin:your_mongo_password_here@mongo:27017/onenglishdb?authSource=admin

# ========================================
# MONGO EXPRESS CONFIGURATION
# ========================================
MONGO_EXPRESS_PORT=8081
MONGO_EXPRESS_USERNAME=admin
MONGO_EXPRESS_PASSWORD=admin_password_here

# ========================================
# REDIS CONFIGURATION
# ========================================
REDIS_EXT_PORT=6379
REDIS_URL=redis://redis:6379

# ========================================
# JWT CONFIGURATION
# ========================================
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here_change_in_production
JWT_REFRESH_EXPIRATION=30d

# ========================================
# APPLICATION CONFIGURATION
# ========================================
APP_NAME="OnEnglish Platform"
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# ========================================
# CORS CONFIGURATION
# ========================================
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# ========================================
# LOGGING
# ========================================
LOG_LEVEL=debug
```

## 🏃 Comandos Disponibles

### Desarrollo

```bash
# Levantar todos los servicios en modo desarrollo
make up-dev

# Ver logs de todos los servicios
docker-compose -f docker-compose.dev.yml -p onenglish_dev logs -f

# Ver logs solo del backend
docker-compose -f docker-compose.dev.yml -p onenglish_dev logs -f backend

# Detener todos los servicios
make down-dev

# Reconstruir y levantar servicios
make rebuild-dev
```

### Prisma

```bash
# Generar Prisma Client
npm run prisma:generate

# Crear una nueva migración
npm run prisma:migrate

# Aplicar migraciones pendientes
npm run prisma:migrate:deploy

# Abrir Prisma Studio
npm run prisma:studio

# Resetear la base de datos (⚠️ cuidado en producción)
npm run prisma:reset
```

## 🔄 Flujo de Inicio Automático

El archivo `runner.sh` maneja automáticamente:

1. ✅ **Espera de servicios**: Verifica que PostgreSQL, MongoDB y Redis estén listos
2. ✅ **Inicialización de MongoDB**: Crea la base de datos `onenglishdb` si no existe
3. ✅ **Generación de Prisma Client**: Ejecuta `prisma generate`
4. ✅ **Migraciones**: Aplica las migraciones pendientes con `prisma migrate deploy`
5. ✅ **Inicio de la aplicación**: Ejecuta `npm run start:dev`

## 📦 Servicios Incluidos

| Servicio | Puerto | URL | Credenciales |
|----------|--------|-----|--------------|
| **Backend (NestJS)** | 3000 | http://localhost:3000 | - |
| **PostgreSQL** | 5432 | localhost:5432 | Ver `.env` |
| **MongoDB** | 27017 | localhost:27017 | Ver `.env` |
| **Redis** | 6379 | localhost:6379 | Sin autenticación |
| **pgAdmin** | 5050 | http://localhost:5050 | Ver `.env` |
| **Mongo Express** | 8081 | http://localhost:8081 | Ver `.env` |

## 🐛 Solución de Problemas

### Error: Can't reach database server at `localhost:5432`

**Causa**: El `DATABASE_URL` está usando `localhost` en lugar del nombre del contenedor.

**Solución**: Asegúrate de que tu `.env` tenga:
```bash
DATABASE_URL=postgresql://user:password@postgres:5432/onenglishdb?schema=public
```
⚠️ Nota: Usa `postgres` (nombre del contenedor), NO `localhost`

### Error: ERESOLVE could not resolve

**Causa**: Conflicto de dependencias de NestJS.

**Solución**: 
```bash
rm -f package-lock.json
npm cache clean --force
npm install
```

### Los contenedores no se levantan

**Solución**:
```bash
# Detener y limpiar todo
make down-dev
docker system prune -f

# Volver a levantar
make up-dev
```

### Prisma Client no está generado

**Solución**:
```bash
# Dentro del contenedor
docker exec -it nestjs_backend npx prisma generate

# O reconstruir la imagen
make rebuild-dev
```

## 📚 Estructura de Bases de Datos

### PostgreSQL (Relacional)
- Usuarios, roles y permisos
- Schools, teachers, students, coordinators
- Challenges y asignaciones
- Audit logs

### MongoDB (NoSQL)
- Preguntas y respuestas de challenges
- Chat y mensajes
- Datos de sesión y actividad en tiempo real

### Redis (Cache)
- Sesiones de usuario
- Cache de datos frecuentes
- Rate limiting

## 🔐 Seguridad

1. **Cambia todas las contraseñas** en el archivo `.env`
2. **No subas el archivo `.env`** a Git (ya está en `.gitignore`)
3. **Usa contraseñas seguras** en producción
4. **Cambia los secretos JWT** antes de deployar

## 📖 Documentación Adicional

- [Arquitectura del Proyecto](./ARCHITECTURE.md)
- [Configuración de Base de Datos](./DATABASE_ARCHITECTURE.md)
- [Desarrollo Local](./LOCAL_DEVELOPMENT.md)
- [Configuración de Prisma](./PRISMA_SETUP.md)

---

**¿Necesitas ayuda?** Revisa la documentación en la carpeta `docs/` o abre un issue en el repositorio.

