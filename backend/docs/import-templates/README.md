# Import Templates

Este directorio contiene plantillas CSV para importar datos masivos al sistema OnEnglish.

## Archivos Disponibles

### 1. `students-template.csv`
Plantilla para importar estudiantes con todos los campos disponibles.

### 2. `teachers-template.csv`
Plantilla para importar profesores con todos los campos disponibles.

### 3. `schools-template.csv`
Plantilla para importar escuelas con todos los campos disponibles.

### 4. `coordinators-template.csv`
Plantilla para importar coordinadores con todos los campos disponibles.

## Cómo Usar las Plantillas

1. **Descargar la plantilla** correspondiente a la entidad que deseas importar
2. **Abrir con Excel** o tu editor de CSV favorito
3. **Rellenar los datos** respetando el formato de cada columna
4. **Guardar como CSV** (UTF-8 encoding recomendado)
5. **Subir el archivo** usando el endpoint correspondiente en la API

## Notas Importantes

### Campos Obligatorios vs Opcionales

Cada plantilla muestra TODOS los campos disponibles. Sin embargo:
- Los campos **obligatorios** deben tener valores en todas las filas
- Los campos **opcionales** pueden dejarse vacíos
- Consulta la documentación completa en `IMPORTS_MODULE.md` para detalles

### schoolId (UUID)

Para estudiantes, profesores y coordinadores, el campo `schoolId` debe ser un UUID válido de una escuela existente en el sistema.

**Para obtener el UUID de una escuela:**
```bash
GET /api/schools
```

### Formato de Datos

- **Emails**: Deben ser únicos en todo el sistema
- **Passwords**: Mínimo 6 caracteres
- **Phone**: Máximo 20 caracteres
- **URLs**: Deben ser URLs válidas (avatar, website)
- **Boolean**: Usar `true` o `false` (no TRUE, FALSE, 1, 0)

### Codificación

Se recomienda usar **UTF-8** encoding para asegurar compatibilidad con caracteres especiales (tildes, ñ, etc.)

### Excel vs CSV

Ambos formatos son aceptados:
- **CSV (.csv)**: Más simple, mejor para grandes volúmenes
- **Excel (.xlsx, .xls)**: Más visual, mejor para edición

## Ejemplos de Uso

### Con cURL
```bash
curl -X POST http://localhost:3000/api/imports/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@students-template.csv"
```

### Con Postman
1. POST a `/api/imports/students`
2. Authorization: Bearer Token
3. Body: form-data
4. Key: `file`, Type: File
5. Seleccionar archivo

## Validación Previa

Antes de subir tu archivo, verifica:
- [ ] Los headers coinciden exactamente con la plantilla
- [ ] Todos los campos obligatorios tienen valores
- [ ] Los emails son únicos
- [ ] Los schoolId existen en el sistema
- [ ] El formato de datos es correcto
- [ ] El archivo es menor a 100MB

## Soporte

Para más información, consulta la documentación completa en:
- `/docs/IMPORTS_MODULE.md` - Documentación completa del módulo
- `/docs/API_EXAMPLES.md` - Ejemplos de uso de la API

