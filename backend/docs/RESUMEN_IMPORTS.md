# Módulo de Importación de Archivos - Resumen

## ✅ Implementación Completa

Se ha implementado exitosamente un sistema completo de importación masiva de datos mediante archivos CSV y Excel usando procesamiento por streams.

## 📁 Archivos Creados

### Estructura del Módulo
```
src/imports/
├── imports.module.ts              # Módulo principal
├── imports.controller.ts          # Controlador con 4 endpoints
├── imports.service.ts             # Servicio con lógica de procesamiento
├── imports.controller.spec.ts     # Tests del controlador
├── imports.service.spec.ts        # Tests del servicio
├── index.ts                       # Exportaciones del módulo
├── dto/
│   ├── import-file.dto.ts        # DTO para validación de archivos
│   └── import-response.dto.ts    # DTO para respuesta de importación
└── interfaces/
    ├── import-result.interface.ts # Interface para resultados
    └── row-data.interface.ts      # Interfaces para datos de filas
```

### Documentación
```
docs/
├── IMPORTS_MODULE.md              # Documentación completa en inglés
├── RESUMEN_IMPORTS.md            # Este archivo (resumen en español)
└── import-templates/
    ├── README.md                  # Guía de uso de plantillas
    ├── students-template.csv      # Plantilla para estudiantes
    ├── teachers-template.csv      # Plantilla para profesores
    ├── schools-template.csv       # Plantilla para escuelas
    └── coordinators-template.csv  # Plantilla para coordinadores
```

## 🚀 Características Principales

### 1. Formatos Soportados
- ✅ CSV (.csv)
- ✅ Excel (.xlsx, .xls)
- ✅ Tamaño máximo: 100MB

### 2. Procesamiento Eficiente
- ✅ **Lectura por streams**: No carga todo el archivo en memoria
- ✅ **Iteración asíncrona**: Usa `for await` para procesamiento eficiente
- ✅ **Validación por fila**: Cada fila se valida individualmente
- ✅ **Registro de progreso**: Logs cada 100 filas procesadas

### 3. Manejo de Errores
- ✅ Colecta errores por fila (máximo 1000)
- ✅ Retorna los primeros 100 errores en la respuesta
- ✅ Permite identificar exactamente qué filas fallaron
- ✅ Procesa todas las filas aunque haya errores

### 4. Seguridad
- ✅ Autenticación JWT requerida
- ✅ Control de acceso por roles
- ✅ Validación de tipo MIME
- ✅ Limpieza automática de archivos temporales

## 📡 Endpoints Disponibles

### 1. Importar Estudiantes
```
POST /api/imports/students
Roles permitidos: admin, coordinator
```

**Columnas requeridas**:
- `firstName`, `lastName`, `email`, `schoolId`

**Columnas opcionales**:
- `username`, `password`, `phone`, `avatar`, `bio`, `isActive`

### 2. Importar Profesores
```
POST /api/imports/teachers
Roles permitidos: admin, coordinator
```

**Columnas requeridas**:
- `firstName`, `lastName`, `email`, `schoolId`

**Columnas opcionales**:
- `username`, `password`, `phone`, `avatar`, `bio`, `isActive`

### 3. Importar Escuelas
```
POST /api/imports/schools
Roles permitidos: admin
```

**Columnas requeridas**:
- `name`, `email`, `phone`, `city`, `state`, `type`

**Columnas opcionales**:
- `website`, `address`, `postalCode`, `description`, `isActive`

### 4. Importar Coordinadores
```
POST /api/imports/coordinators
Roles permitidos: admin
```

**Columnas requeridas**:
- `firstName`, `lastName`, `email`, `schoolId`

**Columnas opcionales**:
- `username`, `password`, `phone`, `avatar`, `bio`, `isActive`

## 💡 Cómo Usar

### Paso 1: Preparar el Archivo

1. Descarga una plantilla desde `docs/import-templates/`
2. Rellena los datos respetando el formato de cada columna
3. Guarda como CSV (UTF-8) o Excel

**Ejemplo de CSV para estudiantes**:
```csv
firstName,lastName,email,schoolId,isActive
Juan,Pérez,juan.perez@example.com,550e8400-e29b-41d4-a716-446655440000,true
María,García,maria.garcia@example.com,550e8400-e29b-41d4-a716-446655440000,true
```

### Paso 2: Obtener Token JWT

```bash
# Login para obtener token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Paso 3: Subir el Archivo

```bash
# Importar estudiantes
curl -X POST http://localhost:3000/api/imports/students \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -F "file=@students.csv"
```

### Respuesta Esperada

```json
{
  "success": true,
  "totalRows": 100,
  "successCount": 95,
  "errorCount": 5,
  "errors": [
    {
      "row": 10,
      "error": "email must be a valid email",
      "data": {
        "firstName": "Juan",
        "email": "correo-invalido"
      }
    }
  ],
  "message": "Import completed with 5 errors out of 100 rows",
  "processingTime": 1234
}
```

## 🔧 Configuración

### En `app.module.ts`
```typescript
NestjsFormDataModule.config({
  isGlobal: true,
  storage: FileSystemStoredFile,
  fileSystemStoragePath: '/tmp/nestjs-form-data',
  cleanupAfterSuccessHandle: true,
  cleanupAfterFailedHandle: true,
})
```

### Validación Global
Ya está configurada en `main.ts`:
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  })
);
```

## 📊 Ejemplo con Postman

1. **Método**: POST
2. **URL**: `http://localhost:3000/api/imports/students`
3. **Authorization**:
   - Type: `Bearer Token`
   - Token: Tu JWT
4. **Body**:
   - Selecciona `form-data`
   - Key: `file` (cambiar tipo a `File`)
   - Value: Selecciona tu archivo CSV o Excel
5. **Send**

## ⚠️ Puntos Importantes

### 1. schoolId para Usuarios
Para estudiantes, profesores y coordinadores, necesitas el UUID de una escuela existente:

```bash
# Obtener lista de escuelas
curl -X GET http://localhost:3000/api/schools \
  -H "Authorization: Bearer TU_TOKEN"
```

### 2. Validaciones
- **Emails**: Deben ser únicos en todo el sistema
- **Passwords**: Mínimo 6 caracteres
- **UUIDs**: Formato válido de UUID v4
- **URLs**: Formato válido de URL (http/https)
- **Booleanos**: Usar `true` o `false` (no 1, 0, TRUE, FALSE)

### 3. Codificación
- Usar **UTF-8** para archivos CSV
- Asegura compatibilidad con tildes, ñ y caracteres especiales

### 4. Tamaño de Archivos
- Máximo: 100MB
- Para archivos muy grandes (>50,000 filas), considera dividir en múltiples archivos

### 5. Manejo de Errores
- El sistema procesa TODAS las filas aunque haya errores
- Los errores se reportan por fila
- Las filas exitosas se insertan en la base de datos
- Las filas con error se omiten y se reportan

## 🔍 Troubleshooting

### Error: "File too large"
**Solución**: El archivo excede 100MB. Divídelo en archivos más pequeños.

### Error: "Invalid file type"
**Solución**: Solo se aceptan archivos .csv, .xlsx, .xls

### Error: "Invalid email format"
**Solución**: Verifica que todos los emails tengan formato válido

### Error: "schoolId not found"
**Solución**: Verifica que el schoolId existe en la base de datos

### Muchos errores de validación
**Solución**: 
1. Descarga y usa las plantillas oficiales
2. Verifica que los headers coincidan exactamente
3. Revisa los tipos de datos en cada columna

## 🎯 Casos de Uso

### Caso 1: Inicio de Ciclo Escolar
```bash
# 1. Importar escuelas nuevas
curl -X POST .../imports/schools -F "file=@escuelas.csv"

# 2. Importar coordinadores
curl -X POST .../imports/coordinators -F "file=@coordinadores.csv"

# 3. Importar profesores
curl -X POST .../imports/teachers -F "file=@profesores.csv"

# 4. Importar estudiantes
curl -X POST .../imports/students -F "file=@estudiantes.csv"
```

### Caso 2: Migración de Datos
```bash
# Importar datos desde sistema anterior
# usando archivos Excel exportados
curl -X POST .../imports/students -F "file=@migration_students.xlsx"
```

### Caso 3: Actualización Masiva
```bash
# Exportar datos actuales
curl -X GET .../students > current_students.json

# Modificar en Excel
# Importar con cambios
curl -X POST .../imports/students -F "file=@updated_students.xlsx"
```

## 📈 Performance

### Métricas Esperadas
- **Velocidad**: ~100-500 filas/segundo (depende del hardware)
- **Memoria**: Uso constante gracias a streaming
- **Logs**: Progress cada 100 filas

### Optimizaciones Implementadas
- ✅ Stream processing (no carga todo en memoria)
- ✅ Iteración asíncrona con `for await`
- ✅ Validación eficiente con `class-validator`
- ✅ Límite de 1000 errores colectados
- ✅ Limpieza automática de archivos temporales

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm test imports.service.spec.ts
npm test imports.controller.spec.ts

# Coverage
npm run test:cov
```

## 📚 Documentación Adicional

- **Documentación completa**: Ver `/docs/IMPORTS_MODULE.md`
- **Plantillas**: Ver `/docs/import-templates/`
- **Ejemplos de API**: Ver `/docs/API_EXAMPLES.md`
- **Swagger**: Disponible en `http://localhost:3000/docs`

## 🔐 Seguridad

### Roles y Permisos
- **Admin**: Puede importar todo (students, teachers, schools, coordinators)
- **Coordinator**: Puede importar students y teachers (solo de su escuela)

### Validaciones de Seguridad
1. Autenticación JWT requerida
2. Verificación de roles con `@Auth` decorator
3. Validación de tipo MIME de archivos
4. Validación de tamaño de archivo
5. Validación de datos por fila con DTOs
6. Sanitización automática de datos

## ✨ Próximas Mejoras Sugeridas

- [ ] Procesamiento asíncrono con Bull Queue
- [ ] Notificaciones en tiempo real vía WebSocket
- [ ] Descarga de plantillas desde la API
- [ ] Soporte para actualización (no solo inserción)
- [ ] Detección de duplicados
- [ ] Historial de importaciones
- [ ] Preview de datos antes de importar
- [ ] Rollback de importaciones

## 🤝 Soporte

Para preguntas o issues:
1. Revisa esta documentación
2. Consulta `/docs/IMPORTS_MODULE.md`
3. Revisa los logs del servidor
4. Usa Swagger UI para probar endpoints

---

**Desarrollado por**: OnEnglish Team  
**Fecha**: Noviembre 2025  
**Versión**: 1.0.0

