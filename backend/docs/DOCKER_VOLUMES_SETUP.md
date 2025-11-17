# 📦 Configuración de Volúmenes Docker para Archivos

## ✅ Cambios Aplicados

Se han configurado volúmenes Docker para vincular las carpetas de archivos entre tu sistema local y los contenedores.

### 📁 Carpetas Creadas

```
onenglishbackend/
├── uploads/          # Archivos subidos por usuarios
│   └── .gitkeep
└── tmp/              # Archivos de backup temporales
    └── .gitkeep
```

### 🔧 Configuración por Ambiente

#### Desarrollo (`docker-compose.dev.yml`)

```yaml
backend:
  volumes:
    - ./src:/usr/src/app/src
    - ./prisma:/usr/src/app/prisma
    - ./uploads:/usr/src/app/uploads    # ✨ NUEVO
    - ./tmp:/usr/src/app/tmp            # ✨ NUEVO
```

**Beneficios en desarrollo:**
- ✅ Los archivos subidos se guardan en tu carpeta local `./uploads`
- ✅ Puedes ver y acceder a los archivos directamente desde tu explorador
- ✅ Los archivos persisten aunque reconstruyas el contenedor
- ✅ Fácil de respaldar y versionar

#### Producción (`docker-compose.prod.yml`)

```yaml
backend:
  volumes:
    - uploads:/usr/src/app/uploads      # ✨ Volumen nombrado
    - ./tmp:/usr/src/app/tmp            # ✨ Bind mount

volumes:
  uploads:
    name: onenglish-uploads
    external: false
```

**Beneficios en producción:**
- ✅ Volumen nombrado de Docker para mejor rendimiento
- ✅ Los datos persisten incluso si eliminas el contenedor
- ✅ Fácil de respaldar con comandos de Docker
- ✅ Mejor aislamiento y seguridad

## 🚀 Cómo Aplicar los Cambios

### Paso 1: Detener los Contenedores

```bash
docker-compose -f docker-compose.dev.yml down
```

### Paso 2: Reconstruir los Contenedores (Opcional pero Recomendado)

```bash
docker-compose -f docker-compose.dev.yml build --no-cache backend
```

### Paso 3: Iniciar los Contenedores

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Paso 4: Verificar los Volúmenes

```bash
# Ver los logs del backend
docker logs nestjs_backend

# Deberías ver mensajes como:
# [LocalStorageService] Upload root directory: /usr/src/app/uploads
# [FileService] Storage service initialized: local
```

### Paso 5: Probar la Subida de Archivos

```bash
# Subir un archivo de prueba
curl -X POST http://localhost:3000/files/upload \
  -F "file=@/path/to/test/image.png"
```

Luego verifica que el archivo aparezca en tu carpeta local:
```bash
ls -la uploads/
```

## 📂 Estructura de Carpetas Resultante

Después de subir archivos, verás algo como:

```
uploads/
├── .gitkeep
├── image/
│   ├── uuid-123.png
│   └── uuid-456.jpg
├── voice/
│   └── uuid-789.mp3
├── document/
│   └── uuid-abc.pdf
└── video/
    └── uuid-def.mp4

tmp/
├── .gitkeep
└── backup-uuid-123.png  # Backups temporales durante actualizaciones
```

## 🔍 Comandos Útiles

### Ver Volúmenes de Docker

```bash
# Listar todos los volúmenes
docker volume ls

# Ver detalles del volumen de uploads (producción)
docker volume inspect onenglish-uploads
```

### Respaldar Archivos (Producción)

```bash
# Crear backup del volumen de uploads
docker run --rm \
  -v onenglish-uploads:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/uploads-backup-$(date +%Y%m%d).tar.gz /data
```

### Restaurar Archivos (Producción)

```bash
# Restaurar desde backup
docker run --rm \
  -v onenglish-uploads:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/uploads-backup-YYYYMMDD.tar.gz -C /
```

### Limpiar Archivos Temporales

```bash
# Limpiar carpeta tmp (desarrollo)
rm -rf tmp/*
echo "# Temporary files directory for backups" > tmp/.gitkeep

# Dentro del contenedor
docker exec nestjs_backend rm -rf /usr/src/app/tmp/*
```

### Ver Espacio Usado

```bash
# Desarrollo (carpeta local)
du -sh uploads/

# Producción (volumen Docker)
docker system df -v | grep onenglish-uploads
```

## ⚠️ Importante

### Desarrollo
- Las carpetas `uploads/` y `tmp/` están en `.gitignore`
- Solo `.gitkeep` se versiona para mantener la estructura
- Los archivos son accesibles desde tu sistema de archivos local

### Producción
- El volumen `onenglish-uploads` es administrado por Docker
- Asegúrate de hacer backups regulares
- Los backups temporales en `tmp/` no persisten entre reinicios

## 🔐 Seguridad

### Permisos de Archivos

Si tienes problemas de permisos, ejecuta:

```bash
# Dar permisos correctos (desarrollo)
chmod -R 755 uploads/
chmod -R 755 tmp/

# Cambiar propietario si es necesario (Linux)
sudo chown -R $USER:$USER uploads/ tmp/
```

### En Producción

Considera:
- ✅ Configurar límites de tamaño por usuario
- ✅ Escanear archivos subidos en busca de malware
- ✅ Implementar políticas de retención (eliminar archivos antiguos)
- ✅ Encriptar archivos sensibles
- ✅ Usar S3 para almacenamiento en la nube

## 🎯 Próximos Pasos

1. ✅ Volúmenes configurados
2. ⬜ Configurar variables de entorno en `.env`
3. ⬜ Probar subida de archivos
4. ⬜ Probar actualización de archivos (con backup/rollback)
5. ⬜ Probar eliminación de archivos
6. ⬜ Configurar backup automático (producción)
7. ⬜ Considerar migración a S3 para escalar

## 📚 Referencias

- [Docker Volumes Documentation](https://docs.docker.com/storage/volumes/)
- [Docker Compose Volumes](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes)
- Documentación del módulo: `src/files/README.md`

