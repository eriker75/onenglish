# Tests - Questions Module

Suite completa de tests para el módulo de Questions del backend de OnEnglish.

## 📋 Contenido

- **Tests E2E**: Tests de extremo a extremo que prueban el flujo completo de creación de preguntas
- **Tests Unitarios**: Tests del servicio y controlador con mocks
- **Fixtures**: Archivos de prueba para imágenes, audio y video

## 🎯 Cobertura

### Tests E2E (`questions.e2e-spec.ts`)
- ✅ 4 tipos de preguntas VOCABULARY
- ✅ 5 tipos de preguntas GRAMMAR
- ✅ 4 tipos de preguntas LISTENING
- ✅ 3 tipos de preguntas WRITING
- ✅ 3 tipos de preguntas SPEAKING
- ✅ Validación de métodos de validación por defecto
- ✅ Override de métodos de validación
- ✅ Verificación de persistencia en BD
- ✅ Validación de subida de archivos
- ✅ Casos de error (autenticación, validación, etc.)
- ✅ Tests de integración (queries, filtros)

**Total E2E**: ~70 tests

### Tests Unitarios del Servicio (`questions.service.spec.ts`)
- ✅ Tests del método `getDefaultValidationMethod()` (19 tests)
- ✅ Tests de métodos create representativos (6 tipos)
- ✅ Tests de validación de datos
- ✅ Tests de casos de error
- ✅ Tests de métodos de query (findAll, findOne)

**Total Servicio**: ~35 tests

### Tests Unitarios del Controlador (`questions.controller.spec.ts`)
- ✅ Tests para todos los 18 endpoints de creación
- ✅ Tests de endpoints de query
- ✅ Tests de filtros
- ✅ Tests de manejo de errores

**Total Controlador**: ~25 tests

## 🚀 Preparación

### 1. Configurar Base de Datos de Test

Crea un archivo `.env.test` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/test_db"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="test-key"
AWS_SECRET_ACCESS_KEY="test-secret"
AWS_S3_BUCKET_NAME="test-bucket"
```

### 2. Crear Base de Datos de Test

```bash
# Crear base de datos
createdb test_db

# Ejecutar migraciones
DATABASE_URL="postgresql://user:password@localhost:5432/test_db" npm run prisma:migrate:deploy
```

### 3. Agregar Fixtures

Coloca los siguientes archivos en `test/fixtures/`:

- `test-image.png` - Imagen de prueba (< 5MB)
- `test-audio.mp3` - Audio de prueba (< 10MB)
- `test-video.mp4` - Video de prueba (< 20MB)

**Nota**: Si no tienes estos archivos, los tests usarán buffers mínimos generados automáticamente.

## 🧪 Ejecutar Tests

### Tests E2E

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar solo tests de Questions
npm run test:e2e -- questions.e2e-spec.ts

# Ejecutar con modo verbose
npm run test:e2e -- --verbose
```

### Tests Unitarios

```bash
# Ejecutar todos los tests unitarios
npm test

# Ejecutar tests del servicio
npm test -- questions.service.spec.ts

# Ejecutar tests del controlador
npm test -- questions.controller.spec.ts

# Ejecutar en modo watch
npm run test:watch
```

### Tests con Cobertura

```bash
# Generar reporte de cobertura
npm run test:cov

# Ver reporte en navegador
open coverage/lcov-report/index.html
```

### Tests en Modo Debug

```bash
# Debug tests unitarios
npm run test:debug

# Luego en Chrome: chrome://inspect
```

## 📊 Comandos Útiles

```bash
# Ejecutar todos los tests (unitarios + E2E)
npm test && npm run test:e2e

# Ejecutar solo tests rápidos (unitarios)
npm test

# Ejecutar tests con timeout extendido
npm run test:e2e -- --testTimeout=120000

# Ejecutar un test específico por nombre
npm test -- -t "should create question with default AUTO validation"

# Ver tests sin ejecutarlos
npm test -- --listTests
```

## 🔧 Troubleshooting

### Error: Cannot find module 'src/...'

Si ves errores como "Cannot find module 'src/database/prisma.service'":

**Causa**: Jest no puede resolver los path aliases de TypeScript (`src/...`).

**Solución**: Ya está configurado en `test/jest-e2e.json` con `moduleNameMapper`. Si persiste, verifica que el path sea correcto.

### Error: FormDataInterceptor dependencies

Si ves errores como "Nest can't resolve dependencies of the FormDataInterceptor":

**Solución**: Los tests unitarios del controlador ya incluyen la importación de `NestjsFormDataModule`. Si ves este error en otros controladores, agrega:

```typescript
imports: [NestjsFormDataModule.config({ isGlobal: true })],
```

en el módulo de prueba.

### Error: Cannot connect to database

```bash
# Verificar que PostgreSQL esté corriendo
pg_isready

# Verificar variables de entorno
cat .env.test
```

### Error: Timeout de 60000ms excedido

Los tests de subida de archivos pueden tardar. Aumenta el timeout:

```bash
npm run test:e2e -- --testTimeout=120000
```

### Error: Fixtures no encontrados

Los tests funcionarán con buffers mínimos, pero para tests más realistas:

```bash
# Crear directorio de fixtures
mkdir -p test/fixtures

# Descargar archivos de ejemplo
curl -o test/fixtures/test-image.png https://picsum.photos/200
curl -o test/fixtures/test-audio.mp3 https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3
```

### Error: Question validation failed

Verifica que las migraciones estén actualizadas:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/test_db" npm run prisma:migrate:deploy
```

## 📈 Métricas Esperadas

- **Total de Tests**: ~130 tests
- **Tiempo de Ejecución**:
  - Tests Unitarios: ~5-10 segundos
  - Tests E2E: ~60-120 segundos
- **Cobertura Esperada**:
  - Questions Service: >85%
  - Questions Controller: >90%
  - DTOs: 100%

## 🎯 Validaciones Incluidas

Cada tipo de pregunta valida:

1. ✅ **Creación exitosa** con valores por defecto
2. ✅ **Override** de validationMethod
3. ✅ **Persistencia en BD** (incluye media si aplica)
4. ✅ **Datos inválidos** (respuestas, opciones, etc.)
5. ✅ **Falta de autenticación**
6. ✅ **ChallengeId inválido**

## 📝 Notas Importantes

- Los tests E2E requieren una BD funcional y limpian los datos al finalizar
- Los tests unitarios usan mocks y no requieren BD
- Los fixtures de archivos son opcionales (se generan buffers si faltan)
- El timeout por defecto es 60 segundos (configurable)
- Los tests crean y limpian sus propios datos de prueba

## 🤝 Contribuir

Al agregar nuevos tipos de preguntas:

1. Agregar DTO factory en `test/utils/test-helpers.ts`
2. Agregar tests E2E en `test/questions.e2e-spec.ts`
3. Agregar tests unitarios si hay lógica específica
4. Actualizar este README con el nuevo tipo

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)

