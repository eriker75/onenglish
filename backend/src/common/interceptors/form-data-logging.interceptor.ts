import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor específico para logging de multipart/form-data.
 * Se ejecuta DESPUÉS de que nestjs-form-data procesa el body,
 * por lo que puede ver todos los campos y archivos.
 */
@Injectable()
export class FormDataLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('FORM-DATA');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (process.env.NODE_ENV !== 'development') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url, headers } = request;
    const now = Date.now();

    this.logger.log('='.repeat(80));
    this.logger.log(JSON.stringify(headers));
    this.logger.log(`📥 Form-Data Request: ${method} ${url}`);
    this.logger.log('-'.repeat(80));

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;

          // AQUÍ es donde el body ya está procesado por @FormDataRequest()
          this.logFormDataBody(request);

          this.logger.log(`✅ Response sent in ${responseTime}ms`);

          // Opcional: mostrar response data
          if (data && process.env.LOG_RESPONSE_DATA === 'true') {
            this.logger.log(`📤 Response: ${JSON.stringify(data, null, 2)}`);
          }

          this.logger.log('='.repeat(80));
        },
        error: (error) => {
          const responseTime = Date.now() - now;

          // Intentar mostrar el body incluso en error
          this.logFormDataBody(request);

          this.logger.error(
            `❌ Error after ${responseTime}ms: ${error.message}`,
          );

          // Mostrar detalles del error de validación
          if (error.response) {
            this.logger.error(
              `❌ Validation Error: ${JSON.stringify(error.response, null, 2)}`,
            );
          }

          // Mostrar stack trace si está disponible
          if (error.stack && process.env.LOG_ERROR_STACK === 'true') {
            this.logger.error(`Stack: ${error.stack}`);
          }

          this.logger.log('='.repeat(80));
        },
      }),
    );
  }

  private logFormDataBody(request: any) {
    const body = request.body || {};

    // Log de todos los campos del body
    const bodyFields: any = {};
    const fileFields: any = {};

    Object.keys(body).forEach((key) => {
      const value = body[key];

      // Detectar si es un archivo (FileSystemStoredFile)
      if (
        value &&
        typeof value === 'object' &&
        (value.path || value.buffer || value.originalName)
      ) {
        fileFields[key] = {
          originalName: value.originalName,
          encoding: value.encoding,
          mimetype: value.mimetype || value.mimeType,
          size: value.size,
          path: value.path,
        };
      } else {
        // Es un campo normal
        bodyFields[key] = value;
      }
    });

    // Mostrar campos normales
    if (Object.keys(bodyFields).length > 0) {
      this.logger.log(`📝 Form Fields: ${JSON.stringify(bodyFields, null, 2)}`);
    }

    // Mostrar archivos
    if (Object.keys(fileFields).length > 0) {
      this.logger.log(`📎 Files: ${JSON.stringify(fileFields, null, 2)}`);
    }

    // Si no hay nada en el body
    if (
      Object.keys(bodyFields).length === 0 &&
      Object.keys(fileFields).length === 0
    ) {
      this.logger.warn('⚠️  Body is empty or not yet processed');
      this.logger.log(
        `Raw body keys: ${Object.keys(request.body || {}).join(', ')}`,
      );
    }
  }
}
