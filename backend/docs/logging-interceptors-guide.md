# Logging Interceptors - Guía de Uso

## 🎯 Arquitectura de Logging

Este proyecto utiliza **interceptors** para logging en lugar de middleware, porque los interceptors tienen acceso al body procesado y la respuesta del handler.

## 📁 Interceptors Disponibles

### 1. LoggingInterceptor (Global)

**Ubicación:** `src/common/interceptors/logging.interceptor.ts`

**Uso:** Requests normales (JSON, urlencoded)

**Activación:** Solo en desarrollo (`NODE_ENV=development`)

**Características:**
- ✅ Muestra método, URL, params, query
- ✅ Muestra body JSON parseado
- ✅ Muestra headers relevantes
- ✅ Tiempo de respuesta
- ✅ Detalles de errores con validación

**Ejemplo de output:**
```
[HTTP] ================================================================================
[HTTP] 📥 Incoming Request: POST /api/v1/questions/create/debate
[HTTP] --------------------------------------------------------------------------------
[HTTP] 📍 Params: {}
[HTTP] 🔍 Query: {}
[HTTP] 📋 Headers: {
  "content-type": "application/json",
  "user-agent": "PostmanRuntime/7.49.1",
  "authorization": "[NOT PRESENT]"
}
[HTTP] 📦 Body: {
  "challengeId": "2a53985d-fe58-4f1f-9743-bcdeabd563c1",
  "stage": "SPEAKING",
  "phase": "phase_3",
  "order": 3,
  "points": 20,
  "timeLimit": 240,
  "maxAttempts": 1,
  "text": "Defend or oppose the provided statement.",
  "content": "Bubble gum",
  "validationMethod": "IA",
  "stance": "support"
}
[HTTP] ✅ Response sent in 60ms
[HTTP] ================================================================================
```

**Registro:**
```typescript
// app.module.ts
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
]
```

### 2. FormDataLoggingInterceptor (Por Controlador)

**Ubicación:** `src/common/interceptors/form-data-logging.interceptor.ts`

**Uso:** Endpoints con `@FormDataRequest()` (multipart/form-data)

**Activación:** Solo en desarrollo (`NODE_ENV=development`)

**Características:**
- ✅ Muestra archivos subidos (nombre, tipo, tamaño, path)
- ✅ Muestra form fields separados
- ✅ Detecta automáticamente FileSystemStoredFile
- ✅ Tiempo de respuesta
- ✅ Detalles de errores de validación

**Ejemplo de output:**
```
[FORM-DATA] ================================================================================
[FORM-DATA] 📥 Form-Data Request: POST /api/v1/questions/create/image_to_multiple_choices
[FORM-DATA] --------------------------------------------------------------------------------
[FORM-DATA] 📝 Form Fields: {
  "challengeId": "2a53985d-fe58-4f1f-9743-bcdeabd563c1",
  "stage": "VOCABULARY",
  "phase": "phase_1",
  "order": "1",
  "points": "10",
  "options": ["Apple", "Orange", "Grapes", "Banana"],
  "answer": "Apple"
}
[FORM-DATA] 📎 Files: {
  "media": {
    "originalName": "apple.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "size": 245678,
    "path": "/tmp/formidable_xyz123"
  }
}
[FORM-DATA] ✅ Response sent in 123ms
[FORM-DATA] ================================================================================
```

**Registro:**
```typescript
// questions-creation.controller.ts
@Controller('questions/create')
@UseInterceptors(FormDataLoggingInterceptor)
export class QuestionsCreationController {
  @Post('image_to_multiple_choices')
  @FormDataRequest()
  createImageToMultipleChoices(@Body() dto: CreateImageToMultipleChoicesDto) {
    // ...
  }
}
```

### 3. MetricsInterceptor (Opcional - Producción)

**Ubicación:** `src/common/interceptors/metrics.interceptor.ts`

**Uso:** Logs estructurados para Prometheus, Grafana, Loki

**Activación:** Siempre (producción y desarrollo)

**Características:**
- ✅ Logs en formato JSON estructurado
- ✅ Timestamps ISO
- ✅ Métricas de rendimiento
- ✅ Compatible con Loki/Grafana
- ✅ Información de errores

**Ejemplo de output:**
```json
{
  "timestamp": "2025-11-18T17:56:49.123Z",
  "level": "info",
  "service": "onenglish-api",
  "type": "http_request",
  "method": "POST",
  "url": "/api/v1/questions/create/debate",
  "statusCode": 201,
  "responseTime": 245,
  "userAgent": "PostmanRuntime/7.49.1",
  "success": true
}
```

**Registro:**
```typescript
// app.module.ts (producción)
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: MetricsInterceptor,
  },
]
```

## 🔧 Variables de Entorno

```bash
# Activar logging de desarrollo
NODE_ENV=development

# Mostrar response data completa (opcional)
LOG_RESPONSE_DATA=true

# Mostrar stack traces completos (opcional)
LOG_ERROR_STACK=true
```

## 🎯 Configuración Recomendada

### Desarrollo (Debugging):
```typescript
// app.module.ts
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor, // JSON requests
  },
]

// questions-creation.controller.ts
@UseInterceptors(FormDataLoggingInterceptor) // Form-data requests
```

### Producción (Métricas):
```typescript
// app.module.ts
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: MetricsInterceptor, // Logs estructurados
  },
]
```

## 📊 Flujo de Ejecución

```
1. Request llega al servidor
2. Middleware (si hay) → Headers, CORS, etc.
3. Guards → Autenticación
4. Interceptor (PRE) → logRequestStart()
5. Pipes → Validación de DTO
6. Handler → Tu método del controlador
7. Interceptor (POST) → logRequestBody() + Response
8. Response enviada al cliente
```

## 🔍 Debugging de Errores

Los interceptors capturan errores y muestran:

```
[HTTP] ❌ Error after 20ms: Bad Request Exception
[HTTP] Error details: {
  "message": [
    "Field \"media\" does not contain file",
    "File must be of one of the types image/jpeg, image/png",
    "Maximum file size is 5000000"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Con `LOG_ERROR_STACK=true`:
```
[HTTP] Stack: BadRequestException: Validation failed
    at ValidationPipe.transform (/app/node_modules/@nestjs/common/pipes/validation.pipe.js:54:23)
    at async /app/node_modules/@nestjs/core/router/router-execution-context.js:176:29
```

## 💡 Mejores Prácticas

### 1. Separa interceptors por tipo de contenido
- ✅ `LoggingInterceptor` para JSON
- ✅ `FormDataLoggingInterceptor` para archivos
- ❌ NO intentes manejar todo en un solo interceptor

### 2. Usa niveles de log apropiados
```typescript
this.logger.log('Info message');      // Información general
this.logger.warn('Warning message');  // Advertencias
this.logger.error('Error message');   // Errores
this.logger.debug('Debug message');   // Debugging detallado
```

### 3. Protege datos sensibles
```typescript
const relevantHeaders = {
  'content-type': headers['content-type'],
  authorization: headers['authorization'] ? '[PRESENT]' : '[NOT PRESENT]', // ✅ No mostrar token
};
```

### 4. Limita tamaño de logs
```typescript
// ❌ NO hagas esto en producción
if (data && process.env.LOG_RESPONSE_DATA === 'true') {
  this.logger.log(`Response: ${JSON.stringify(data)}`);
}

// ✅ Mejor
if (data && process.env.LOG_RESPONSE_DATA === 'true') {
  const preview = JSON.stringify(data).substring(0, 500);
  this.logger.log(`Response preview: ${preview}...`);
}
```

### 5. Usa request ID para correlación
```typescript
// Combina con RequestIdMiddleware
this.logger.log(`[${req['requestId']}] Processing request...`);
```

## 🚀 Integración con Monitoreo

### Prometheus
Ver: `docs/METRICS_SETUP.md`

### Grafana + Loki
```bash
# Los logs estructurados van directamente a Loki
docker-compose -f docker-compose.metrics.yml up
```

### JMeter
Los interceptors no afectan JMeter. JMeter mide desde el cliente.

## 🔗 Archivos Relacionados

- [`logging.interceptor.ts`](../src/common/interceptors/logging.interceptor.ts)
- [`form-data-logging.interceptor.ts`](../src/common/interceptors/form-data-logging.interceptor.ts)
- [`metrics.interceptor.ts`](../src/common/interceptors/metrics.interceptor.ts)
- [`app.module.ts`](../src/app.module.ts)
- [`METRICS_SETUP.md`](../METRICS_SETUP.md)

## 📚 Referencias

- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
- [Request Lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [NestJS Logger](https://docs.nestjs.com/techniques/logger)
