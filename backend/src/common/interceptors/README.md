# Interceptors vs Middleware - Guía de Uso

## 🔄 Orden de ejecución en NestJS

```
Request Flow:
1. Middleware          ← Express level (raw request)
2. Guards              ← Authentication/Authorization
3. Interceptors (pre)  ← BEFORE handler
4. Pipes               ← Validation & Transformation
5. Handler             ← Your controller method
6. Interceptors (post) ← AFTER handler (can see response)
7. Exception Filters   ← Error handling
8. Response
```

## 📁 Interceptors en este proyecto

### 1. **LoggingInterceptor** (Global)
- **Archivo**: `logging.interceptor.ts`
- **Registro**: `app.module.ts` (APP_INTERCEPTOR)
- **Uso**: Requests normales (JSON, urlencoded)
- **Cuándo se ejecuta**: Después del handler
- **Ve**: Body parseado, response data, errores

```typescript
// Registrado globalmente en app.module.ts
{
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
}
```

### 2. **FormDataLoggingInterceptor** (Por controlador)
- **Archivo**: `form-data-logging.interceptor.ts`
- **Registro**: En controladores específicos con `@UseInterceptors()`
- **Uso**: Solo para endpoints con `@FormDataRequest()`
- **Cuándo se ejecuta**: Después del handler
- **Ve**: Archivos procesados, form fields, response

```typescript
// Aplicado en controladores
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

### 3. **MetricsInterceptor** (Opcional - Para producción)
- **Archivo**: `metrics.interceptor.ts`
- **Registro**: Global o por módulo
- **Uso**: Logs estructurados para Loki/Grafana
- **Cuándo se ejecuta**: Siempre
- **Ve**: Tiempos de respuesta, status codes, errores

## ❌ Por qué NO usar Middleware para logging

### Problema con Middleware:
```typescript
// ❌ PROBLEMA: No ve el body procesado
app.use((req, res, next) => {
  console.log(req.body); // Puede estar vacío con multipart/form-data
  next();
});
```

### Solución con Interceptor:
```typescript
// ✅ SOLUCIÓN: Ve el body después de procesamiento
intercept(context, next) {
  return next.handle().pipe(
    tap(() => {
      console.log(request.body); // Body completamente procesado
    })
  );
}
```

## 🎯 Configuración recomendada

### Para Desarrollo (debugging):
```typescript
// app.module.ts
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor, // Para JSON requests
  },
]

// questions-creation.controller.ts
@UseInterceptors(FormDataLoggingInterceptor) // Para form-data
export class QuestionsCreationController {}
```

### Para Producción (métricas):
```typescript
// app.module.ts
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: MetricsInterceptor, // Solo métricas estructuradas
  },
]
```

## 📝 Variables de entorno

```bash
# Activar logging de desarrollo
NODE_ENV=development

# Opcionales
LOG_RESPONSE_DATA=true    # Mostrar response data
LOG_ERROR_STACK=true      # Mostrar stack traces completos
```

## 🔍 Ejemplo de output

### Request normal (JSON):
```
[HTTP] ================================================================================
[HTTP] 📥 Incoming Request: POST /api/v1/questions/create/debate
[HTTP] --------------------------------------------------------------------------------
[HTTP] 📦 Body: {
  "challengeId": "...",
  "stage": "SPEAKING",
  ...
}
[HTTP] 📋 Headers: {...}
[HTTP] ✅ Response sent in 60ms
[HTTP] ================================================================================
```

### Request con form-data:
```
[FORM-DATA] ================================================================================
[FORM-DATA] 📥 Form-Data Request: POST /api/v1/questions/create/image_to_multiple_choices
[FORM-DATA] --------------------------------------------------------------------------------
[FORM-DATA] 📝 Form Fields: {
  "challengeId": "...",
  "options": ["Apple", "Orange", "Banana"],
  "answer": "Apple"
}
[FORM-DATA] 📎 Files: {
  "media": {
    "originalName": "apple.jpg",
    "mimetype": "image/jpeg",
    "size": 245678,
    "path": "/tmp/formidable_xyz123"
  }
}
[FORM-DATA] ✅ Response sent in 123ms
[FORM-DATA] ================================================================================
```

## 🚀 Cuándo usar cada uno

| Situación | Usar |
|-----------|------|
| Request JSON/URLEncoded | LoggingInterceptor (global) |
| Request con archivos (@FormDataRequest) | FormDataLoggingInterceptor (controlador) |
| Métricas de producción | MetricsInterceptor (global) |
| Transformar responses | Custom Interceptor |
| CORS, rate limiting | Middleware |
| Autenticación | Guard + Interceptor |

## 📚 Recursos

- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
- [NestJS Middleware](https://docs.nestjs.com/middleware)
- [Request Lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
