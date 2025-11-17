# Files Module - Gestión de Archivos

## 📋 Descripción

Módulo robusto para la gestión de archivos con detección automática de tipo, sistema de backup/restore y soporte para almacenamiento local y S3.

## ✨ Características

### 🔍 Detección Automática de Tipo
- **No necesitas especificar el tipo de archivo manualmente**
- El sistema detecta automáticamente el tipo basándose en:
  - Extensión del archivo (`.jpg`, `.mp3`, `.pdf`, etc.)
  - MIME type (`image/jpeg`, `audio/mpeg`, etc.)
- Tipos soportados:
  - `image`: JPG, PNG, GIF, WebP, SVG, BMP, ICO
  - `voice`: MP3, WAV, OGG, M4A, AAC, FLAC
  - `video`: MP4, WebM, AVI, MOV, MKV, FLV
  - `document`: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV

### 🛡️ Sistema de Backup y Rollback
- **Update seguro con rollback automático**:
  1. Crea un backup del archivo original en `/tmp`
  2. Sube el nuevo archivo
  3. Verifica que el nuevo archivo se creó correctamente
  4. Solo entonces elimina el archivo antiguo
  5. Si algo falla en cualquier paso, restaura automáticamente desde el backup

### 💾 Almacenamiento Dual
- Soporte para almacenamiento **local** y **S3**
- Configuración mediante variable de entorno `STORAGE_TYPE`

## 🚀 Uso de los Endpoints

### 1. Subir un Archivo

**POST** `/files/upload`

```bash
curl -X POST http://localhost:3000/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/image.png"
```

**Respuesta:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "url": "/uploads/image/unique-filename.png",
  "filename": "unique-filename.png",
  "type": "image"
}
```

### 2. Actualizar un Archivo

**PUT** `/files/update`

```bash
curl -X PUT http://localhost:3000/files/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/new/image.png" \
  -F "fileId=a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
```

**Respuesta:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "url": "/uploads/image/new-unique-filename.png",
  "filename": "new-unique-filename.png",
  "type": "image"
}
```

### 3. Eliminar un Archivo

**DELETE** `/files/:fileId`

```bash
curl -X DELETE http://localhost:3000/files/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta:**
```json
{
  "message": "File deleted successfully"
}
```

## 🔐 Autenticación

Todos los endpoints requieren autenticación JWT con Bearer token.

**Roles permitidos:**
- `ADMIN`
- `COORDINATOR`
- `TEACHER`
- `STUDENT`

## 📊 Documentación Swagger

Visita `/api` en tu aplicación para ver la documentación interactiva completa con todos los detalles de:
- Parámetros de entrada
- Respuestas posibles
- Códigos de estado HTTP
- Ejemplos de uso

## 🗂️ Estructura del Módulo

```
src/files/
├── controllers/
│   └── files.controller.ts       # Controlador con los 3 endpoints
├── services/
│   ├── file.service.ts            # Lógica principal con backup/rollback
│   ├── local-storage.service.ts   # Almacenamiento local
│   ├── s3-storage.service.ts      # Almacenamiento S3
│   └── media-file.service.ts      # Gestión de registros en BD
├── dtos/
│   ├── upload-file.dto.ts         # DTO para subir
│   ├── update-file.dto.ts         # DTO para actualizar
│   ├── file-response.dto.ts       # DTOs de respuesta
│   └── index.ts                   # Exportaciones
├── utils/
│   └── file-type-detector.util.ts # Detector automático de tipos
├── definitions/
│   └── storage.interface.ts       # Interfaz para servicios de storage
└── files.module.ts                # Módulo principal
```

## ⚙️ Configuración

### Variables de Entorno (Todas Opcionales)

```env
# Tipo de almacenamiento: 'local' o 's3'
# Default: 'local'
STORAGE_TYPE=local

# Para almacenamiento local
# Default: './uploads' (carpeta en la raíz del proyecto)
UPLOAD_ROOT=./uploads

# Para almacenamiento S3 (solo si STORAGE_TYPE=s3)
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_S3_BUCKET=your-bucket-name
```

### Configuración de Docker

Las carpetas están vinculadas entre tu sistema local y el contenedor:

#### Desarrollo (`docker-compose.dev.yml`)
```yaml
volumes:
  - ./uploads:/usr/src/app/uploads  # Archivos subidos
  - ./tmp:/usr/src/app/tmp          # Backups temporales
```

#### Producción (`docker-compose.prod.yml`)
```yaml
volumes:
  - uploads:/usr/src/app/uploads    # Volumen nombrado (persiste datos)
  - ./tmp:/usr/src/app/tmp          # Bind mount para temporales
```

**Diferencias:**
- **Desarrollo**: Usa bind mounts (carpetas locales) para fácil acceso
- **Producción**: Usa volúmenes nombrados de Docker para mejor persistencia

## 📝 Notas Importantes

### Tamaño Máximo de Archivo
- **50 MB** por archivo
- Configurable en los DTOs modificando `@MaxFileSize()`

### Directorios Ignorados en Git
Los siguientes directorios están en `.gitignore`:
- `/uploads` - Archivos subidos
- `/tmp` - Backups temporales

### Tipos de Archivo Soportados

#### Imágenes
- JPG/JPEG, PNG, GIF, WebP, SVG, BMP, ICO

#### Audio (Voice)
- MP3, WAV, OGG, M4A, AAC, FLAC

#### Video
- MP4, WebM, AVI, MOV, MKV, FLV

#### Documentos
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV

## 🔧 Agregar Nuevos Tipos de Archivo

Para agregar soporte para nuevos tipos de archivo, edita:

`src/files/utils/file-type-detector.util.ts`

```typescript
const FILE_TYPE_MAPPINGS: Record<FileType, FileTypeMapping> = {
  // Agregar nuevo tipo aquí
  nuevotipo: {
    extensions: ['.ext1', '.ext2'],
    mimeTypes: ['application/new-type'],
  },
};
```

## 🐛 Manejo de Errores

### Errores Comunes

| Código | Error | Solución |
|--------|-------|----------|
| 400 | Invalid or unsupported file type | Verifica que la extensión y MIME type estén soportados |
| 401 | Unauthorized access | Proporciona un Bearer token válido |
| 404 | File not found | Verifica que el ID del archivo sea correcto |
| 500 | Internal server error | Revisa los logs del servidor |

### Logs

El módulo registra todas las operaciones importantes:
- Creación de backups
- Subida de archivos
- Verificación de archivos
- Eliminación de archivos antiguos
- Errores y rollbacks

## 🧪 Testing

Para probar el módulo en Swagger UI:

1. Inicia la aplicación: `npm run start:dev`
2. Visita: `http://localhost:3000/api`
3. Busca la sección **Files**
4. Usa "Try it out" en cada endpoint

## 🤝 Contribución

Al modificar el módulo, asegúrate de:
- ✅ Mantener el código en inglés
- ✅ Actualizar los tests si es necesario
- ✅ Documentar cambios en este README
- ✅ Seguir los principios SOLID
- ✅ Usar tipos de TypeScript apropiados

