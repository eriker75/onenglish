import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor para métricas de rendimiento y monitoreo.
 * Registra tiempos de respuesta, códigos de estado, y endpoints.
 * Compatible con Prometheus, Grafana, y Loki.
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Log estructurado para Loki/Grafana
          console.log(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              level: 'info',
              service: 'onenglish-api',
              type: 'http_request',
              method,
              url,
              statusCode,
              responseTime,
              userAgent,
              success: true,
            }),
          );

          // Aquí puedes agregar métricas para Prometheus
          // Ejemplo: httpRequestDuration.observe({ method, route: url, status_code: statusCode }, responseTime);
          // Ejemplo: httpRequestTotal.inc({ method, route: url, status_code: statusCode });
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Log estructurado de errores para Loki/Grafana
          console.log(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              level: 'error',
              service: 'onenglish-api',
              type: 'http_request',
              method,
              url,
              statusCode,
              responseTime,
              userAgent,
              success: false,
              error: {
                message: error.message,
                name: error.name,
                stack: error.stack,
              },
            }),
          );

          // Aquí puedes agregar métricas de errores para Prometheus
          // Ejemplo: httpRequestErrors.inc({ method, route: url, status_code: statusCode });
        },
      }),
    );
  }
}
