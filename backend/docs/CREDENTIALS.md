# 🔐 Credenciales de OneEnglish Backend

> **⚠️ IMPORTANTE**: Este archivo contiene credenciales sensibles. NO lo subas a Git.

---

## 📊 PostgreSQL

**Puerto**: 5432

```
Usuario:       postgres
Contraseña:    PgSecure_Pass2024_OneEnglish
Base de Datos: onenglishdb
```

**Connection String**:
```
postgresql://postgres:PgSecure_Pass2024_OneEnglish@localhost:5432/onenglishdb
```

---

## 🔧 PgAdmin

**URL**: http://localhost:5050

```
Email:      admin@onenglish.com
Contraseña: PgAdmin_Secure_2024
```

### Conectar PgAdmin a PostgreSQL:
1. Click en "Add New Server"
2. **General** → Name: `OneEnglish DB`
3. **Connection**:
   - Host: `postgres` (o `localhost`)
   - Port: `5432`
   - Database: `onenglishdb`
   - Username: `postgres`
   - Password: `PgSecure_Pass2024_OneEnglish`

---

## 🍃 MongoDB

**Puerto**: 27017

```
Usuario:    mongoadmin
Contraseña: MongoSecure_Pass2024_OneEnglish
```

**Connection String**:
```
mongodb://mongoadmin:MongoSecure_Pass2024_OneEnglish@localhost:27017/onenglishdb?authSource=admin
```

---

## 📦 Mongo Express

**URL**: http://localhost:8081

```
Usuario:    mongoadmin
Contraseña: MongoExpress_Admin_2024
```

---

## 🔴 Redis

**Puerto**: 6379

```
URL: redis://localhost:6379
(Sin contraseña)
```

---

## 🔐 JWT Tokens

### Access Token:
```
Secret: JWT_SecretKey_2024_OneEnglish_Project_SuperSecure
Expiration: 24h
```

### Refresh Token:
```
Secret: JWT_RefreshToken_2024_OneEnglish_Secure_Key
Expiration: 7d
```

---

## 📝 Notas de Seguridad

- ✅ Contraseñas optimizadas para uso en URLs (sin caracteres problemáticos)
- ✅ Longitud mínima de 25+ caracteres
- ✅ Incluyen mayúsculas, minúsculas y guiones bajos
- ⚠️ Para producción, genera contraseñas aún más largas y aleatorias
- ⚠️ No compartas estas credenciales públicamente
- ⚠️ Cambia las contraseñas periódicamente

---

## 🔄 Comandos Útiles

### Reiniciar con nuevas credenciales:
```bash
make clean-services  # Limpiar volúmenes
make up-services     # Levantar servicios
```

### Verificar estado:
```bash
docker ps
make ps-services
```

### Ver logs:
```bash
make logs-services
```

---

**Última actualización**: $(date)
