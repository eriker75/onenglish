# Configuración de Métricas: Prometheus, Grafana y Loki

## 🎯 Resumen

- **LoggingInterceptor**: Para debugging en desarrollo (logs detallados)
- **MetricsInterceptor**: Para métricas de producción (Prometheus, Grafana, Loki)

## 📦 Instalación de dependencias

Para integrar Prometheus con NestJS:

```bash
npm install @willsoto/nestjs-prometheus prom-client
```

## 🔧 Configuración

### 1. Crear módulo de métricas

```typescript
// src/common/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: '/metrics', // Endpoint para Prometheus
    }),
  ],
})
export class MetricsModule {}
```

### 2. Crear servicio de métricas

```typescript
// src/common/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestTotal: Counter;
  private readonly httpRequestDuration: Histogram;
  private readonly httpRequestErrors: Counter;

  constructor() {
    // Total de requests
    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [register],
    });

    // Duración de requests
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_ms',
      help: 'Duration of HTTP requests in milliseconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000],
      registers: [register],
    });

    // Total de errores
    this.httpRequestErrors = new Counter({
      name: 'http_requests_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'status_code', 'error_type'],
      registers: [register],
    });
  }

  recordRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestTotal.inc({ method, route, status_code: statusCode });
    this.httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
  }

  recordError(method: string, route: string, statusCode: number, errorType: string) {
    this.httpRequestErrors.inc({ method, route, status_code: statusCode, error_type: errorType });
  }
}
```

### 3. Interceptor con Prometheus

```typescript
// src/common/interceptors/prometheus.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method } = request;
    const route = this.getRoute(context);
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          this.metricsService.recordRequest(method, route, statusCode, duration);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          this.metricsService.recordRequest(method, route, statusCode, duration);
          this.metricsService.recordError(method, route, statusCode, error.name);
        },
      }),
    );
  }

  private getRoute(context: ExecutionContext): string {
    const handler = context.getHandler();
    const controller = context.getClass();
    return `${controller.name}.${handler.name}`;
  }
}
```

### 4. Registrar en AppModule

```typescript
// app.module.ts
import { MetricsModule } from './common/metrics/metrics.module';
import { PrometheusInterceptor } from './common/interceptors/prometheus.interceptor';

@Module({
  imports: [
    // ... otros imports
    MetricsModule,
  ],
  providers: [
    // Para desarrollo - debugging
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Para producción - métricas
    {
      provide: APP_INTERCEPTOR,
      useClass: PrometheusInterceptor,
    },
  ],
})
export class AppModule {}
```

## 🐳 Docker Compose con Prometheus, Grafana y Loki

```yaml
# docker-compose.metrics.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3001:3000'
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false

  loki:
    image: grafana/loki:latest
    ports:
      - '3100:3100'
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml
      - loki_data:/loki
    command: -config.file=/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

volumes:
  prometheus_data:
  grafana_data:
  loki_data:
```

### Configuración de Prometheus

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'onenglish-api'
    static_configs:
      - targets: ['nestjs_backend:3000']
    metrics_path: '/metrics'
```

### Configuración de Loki

```yaml
# loki-config.yml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2020-05-15
      store: boltdb
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 168h

storage_config:
  boltdb:
    directory: /loki/index
  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
```

## 📊 Métricas disponibles en Prometheus

Visita: `http://localhost:9090`

Queries útiles:
```promql
# Requests por segundo
rate(http_requests_total[5m])

# Latencia promedio por endpoint
rate(http_request_duration_ms_sum[5m]) / rate(http_request_duration_ms_count[5m])

# Tasa de errores
rate(http_requests_errors_total[5m])

# Percentil 95 de latencia
histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))
```

## 📈 Dashboards en Grafana

Visita: `http://localhost:3001` (admin/admin)

### Panel de ejemplo para HTTP Requests:

```json
{
  "title": "HTTP Requests Per Second",
  "targets": [
    {
      "expr": "rate(http_requests_total[5m])",
      "legendFormat": "{{method}} {{route}} {{status_code}}"
    }
  ]
}
```

## 🔥 Para JMeter

JMeter puede leer las métricas de Prometheus directamente:

1. **Backend Listener**: Configura el `Backend Listener` en JMeter
2. **InfluxDB**: Exporta métricas a InfluxDB (alternativa a Prometheus)
3. **Grafana**: Visualiza ambos (JMeter + API metrics) en un solo dashboard

### Configuración JMeter Test Plan:

```xml
<BackendListener>
  <stringProp name="classname">org.apache.jmeter.visualizers.backend.influxdb.InfluxdbBackendListenerClient</stringProp>
  <elementProp name="arguments">
    <stringProp name="influxdbUrl">http://localhost:8086/write?db=jmeter</stringProp>
    <stringProp name="application">onenglish-load-test</stringProp>
  </elementProp>
</BackendListener>
```

## 🎯 Resumen de uso

1. **Desarrollo**: Usa `LoggingInterceptor` para debugging detallado
2. **Producción**: Usa `MetricsInterceptor` o `PrometheusInterceptor`
3. **Load Testing**: JMeter → InfluxDB → Grafana
4. **Monitoreo**: App → Prometheus → Grafana
5. **Logs centralizados**: App → Loki → Grafana

## 📝 Logs estructurados para Loki

El `MetricsInterceptor` ya genera logs en formato JSON, perfectos para Loki.

Para enviar logs a Loki, configura tu aplicación para escribir a stdout/stderr y usa Promtail para recolectar los logs.
