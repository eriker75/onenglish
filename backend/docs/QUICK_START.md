# 🚀 Quick Start - OnEnglish Backend

## ⚡ Setup en 3 Pasos

### Paso 1: Copiar Variables de Entorno
```bash
# Opción A: Usando Make (recomendado)
make copy-env

# Opción B: Manualmente
cp .env.example .env
```

### Paso 2: Validar Configuración (Opcional)
```bash
make validate-env
```

El script verificará:
- ✅ Todas las variables requeridas están configuradas
- ✅ Los hosts usan nombres de contenedor Docker (`postgres`, `mongo`, `redis`) y NO `localhost`
- ⚠️ Advertencias sobre contraseñas por defecto (cambiar en producción)

### Paso 3: Levantar la Aplicación
```bash
make up-dev
```

## 🎯 ¿Qué hace el `runner.sh` automáticamente?

Cuando ejecutas `make up-dev`, el script `runner.sh` se encarga de:

1. ⏳ **Esperar a que los servicios estén listos**
   - PostgreSQL
   - MongoDB
   - Redis

2. 🗄️ **Crear la base de datos MongoDB**
   - Crea `onenglishdb` si no existe

3. 🔧 **Configurar Prisma**
   - Ejecuta `prisma generate`
   - Ejecuta `prisma migrate deploy`

4. 🚀 **Iniciar la aplicación**
   - `npm run start:dev`

## 📋 Variables de Entorno Principales

### PostgreSQL
```bash
POSTGRES_USER=onenglish_user
POSTGRES_PASSWORD=onenglish_secure_password_2024
POSTGRES_DB=onenglishdb
# ⚠️ IMPORTANTE: Usa 'postgres' NO 'localhost'
DATABASE_URL=postgresql://onenglish_user:onenglish_secure_password_2024@postgres:5432/onenglishdb?schema=public
```

### MongoDB
```bash
MONGO_USERNAME=mongoadmin
MONGO_PASSWORD=mongo_secure_password_2024
# ⚠️ IMPORTANTE: Usa 'mongo' NO 'localhost'
MONGODB_URI=mongodb://mongoadmin:mongo_secure_password_2024@mongo:27017/onenglishdb?authSource=admin
```

### Redis
```bash
# ⚠️ IMPORTANTE: Usa 'redis' NO 'localhost'
REDIS_URL=redis://redis:6379
```

### JWT
```bash
JWT_SECRET=onenglish_jwt_secret_change_in_production_2024
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=onenglish_jwt_refresh_secret_change_in_production_2024
JWT_REFRESH_EXPIRATION=30d
```

## 🌐 Servicios Disponibles

Una vez levantada la aplicación:

| Servicio | URL | Usuario | Contraseña |
|----------|-----|---------|------------|
| **Backend API** | http://localhost:3000 | - | - |
| **pgAdmin** | http://localhost:5050 | admin@onenglish.com | pgadmin_password_2024 |
| **Mongo Express** | http://localhost:8081 | admin | mongoexpress_password_2024 |
| **PostgreSQL** | localhost:5432 | onenglish_user | onenglish_secure_password_2024 |
| **MongoDB** | localhost:27017 | mongoadmin | mongo_secure_password_2024 |
| **Redis** | localhost:6379 | - | - |

## 🛠️ Comandos Útiles

```bash
# Ver logs de todos los servicios
make logs-dev

# Ver logs solo del backend
make logs-backend-dev

# Detener todos los servicios
make down-dev

# Reiniciar servicios
make restart-dev

# Reconstruir y levantar de nuevo
make destroy-dev && make up-dev

# Validar configuración del .env
make validate-env

# Ver todos los comandos disponibles
make help
```

## 🔧 Solución de Problemas

### Error: Can't reach database server at `localhost:5432`

**Causa**: Tu `.env` usa `localhost` en lugar del nombre del contenedor.

**Solución**: Ejecuta `make validate-env` para verificar tu configuración.

```bash
# ❌ INCORRECTO:
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# ✅ CORRECTO:
DATABASE_URL=postgresql://user:pass@postgres:5432/db
```

### Los contenedores no se levantan

```bash
# Limpiar todo y empezar de nuevo
make destroy-dev
docker system prune -f
make up-dev
```

### Ver qué está fallando

```bash
# Ver estado de contenedores
docker ps -a

# Ver logs detallados
make logs-dev
```

## 📚 Documentación Completa

- **[SETUP.md](./SETUP.md)** - Guía completa de configuración
- **[README.md](../README.md)** - Documentación general del proyecto
- **[docs/](./)** - Arquitectura y documentación técnica

## 🎉 ¡Listo!

Si todo está configurado correctamente, verás algo como:

```
========================================
   Starting OnEnglish Backend Setup    
========================================
Step 1: Waiting for services...
✓ PostgreSQL is ready!
✓ MongoDB is ready!
✓ Redis is ready!
Step 2: Initializing MongoDB database...
✓ MongoDB database initialized!
Step 3: Running Prisma operations...
✓ Prisma Client generated successfully!
✓ Database migrations completed successfully!
========================================
   Setup Complete - Starting App      
========================================
```

**¡Tu backend está corriendo en http://localhost:3000! 🚀**
