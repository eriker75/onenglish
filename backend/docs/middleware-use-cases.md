# Middleware - Casos de Uso

## 🎯 ¿Cuándo usar Middleware?

Los middlewares se ejecutan a nivel de Express, **antes** de que NestJS procese el request. Son ideales para operaciones que necesitan:
- Acceso al request RAW (sin parsear)
- Modificar headers de respuesta
- Interceptar antes de cualquier procesamiento
- Operaciones de seguridad a nivel de red

## 📋 Casos de Uso Prácticos

### 1. Rate Limiting (Limitar peticiones)

Protege tu API de abuso limitando el número de requests por IP.

```typescript
// src/common/middleware/rate-limit.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests = new Map<string, number[]>();

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 60000; // 1 minuto
    const maxRequests = 100;

    if (!this.requests.has(ip)) {
      this.requests.set(ip, []);
    }

    const requestTimes = this.requests.get(ip)!;
    const recentRequests = requestTimes.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests',
        retryAfter: windowMs / 1000,
      });
    }

    recentRequests.push(now);
    this.requests.set(ip, recentRequests);
    next();
  }
}
```

**Uso:**
```typescript
// app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('api/v1/public/*');
  }
}
```

### 2. Request ID / Correlation ID (Trazabilidad)

Genera un ID único para cada request, útil para rastrear logs y debugging.

```typescript
// src/common/middleware/request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] || uuidv4();

    // Agregar a request para usar en toda la app
    req['requestId'] = requestId;

    // Agregar a response headers
    res.setHeader('X-Request-ID', requestId);

    next();
  }
}
```

**Integración con Logger:**
```typescript
this.logger.log(`[${req['requestId']}] Processing request...`);
```

### 3. Custom CORS (Control fino)

Implementa CORS con lógica personalizada más allá del módulo estándar.

```typescript
// src/common/middleware/cors.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ||
      ['http://localhost:3000'];
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    next();
  }
}
```

### 4. Request Sanitization (Seguridad)

Limpia inputs peligrosos antes de que lleguen a tu aplicación.

```typescript
// src/common/middleware/sanitize.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body) {
      req.body = this.sanitize(req.body);
    }

    if (req.query) {
      req.query = this.sanitize(req.query);
    }

    next();
  }

  private sanitize(obj: any): any {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitize(item));
    }

    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = this.sanitize(obj[key]);
      }
      return sanitized;
    }

    return obj;
  }
}
```

### 5. Performance Monitoring (Timing)

Detecta requests lentas y registra métricas de rendimiento.

```typescript
// src/common/middleware/timing.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('TIMING');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { method, originalUrl } = req;
      const { statusCode } = res;

      // Alertar si una request toma mucho tiempo
      if (duration > 5000) {
        this.logger.warn(
          `⚠️  SLOW REQUEST: ${method} ${originalUrl} - ${statusCode} - ${duration}ms`
        );
      }
    });

    next();
  }
}
```

### 6. IP Whitelist/Blacklist

Controla acceso basado en direcciones IP.

```typescript
// src/common/middleware/ip-filter.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpFilterMiddleware implements NestMiddleware {
  private blacklist = new Set(['192.168.1.100']);
  private whitelist = new Set(['192.168.1.1']);

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;

    if (this.whitelist.size > 0 && !this.whitelist.has(ip)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (this.blacklist.has(ip)) {
      return res.status(403).json({ message: 'IP blocked' });
    }

    next();
  }
}
```

### 7. Security Headers

Agrega headers de seguridad HTTP.

```typescript
// src/common/middleware/security-headers.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Prevenir clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Prevenir MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // HSTS
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'");

    next();
  }
}
```

## 📊 Comparación: Middleware vs Interceptor vs Guard

| Característica | Middleware | Interceptor | Guard |
|----------------|------------|-------------|-------|
| **Orden de ejecución** | 1º | 3º y 6º | 2º |
| **Ve body parseado** | ❌ | ✅ | ✅ |
| **Ve response** | ❌ | ✅ | ❌ |
| **Puede transformar response** | ❌ | ✅ | ❌ |
| **Puede bloquear request** | ✅ | ✅ | ✅ |
| **Acceso a ExecutionContext** | ❌ | ✅ | ✅ |
| **Uso típico** | CORS, Rate limit, Headers | Logging, Transformación | Autenticación |

## 🎯 Registro de Middlewares

### Global (todas las rutas):
```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, SecurityHeadersMiddleware)
      .forRoutes('*');
  }
}
```

### Por ruta específica:
```typescript
consumer
  .apply(RateLimitMiddleware)
  .forRoutes('api/v1/public/*');
```

### Con exclusiones:
```typescript
consumer
  .apply(SanitizeMiddleware)
  .exclude('api/v1/webhooks/(.*)')
  .forRoutes('*');
```

### Por método HTTP:
```typescript
consumer
  .apply(RateLimitMiddleware)
  .forRoutes({ path: 'api/v1/users', method: RequestMethod.POST });
```

## 💡 Mejores Prácticas

1. ✅ **Usa middleware para**: Seguridad, rate limiting, headers
2. ✅ **Usa interceptors para**: Logging, transformaciones, métricas
3. ✅ **Usa guards para**: Autenticación, autorización
4. ✅ **Mantén middlewares simples y enfocados**
5. ✅ **Documenta el orden de ejecución**
6. ❌ **NO uses middleware para logging de body/response**
7. ❌ **NO uses middleware para validación de negocio**

## 🔗 Referencias

- [NestJS Middleware Docs](https://docs.nestjs.com/middleware)
- [Request Lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
