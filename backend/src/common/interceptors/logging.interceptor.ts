import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (process.env.NODE_ENV !== 'development') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const now = Date.now();

    // Log inicial (antes del handler)
    this.logRequestStart(request);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;

          // Ahora el body está procesado, lo mostramos aquí
          this.logRequestBody(request);

          this.logger.log(`✅ Response sent in ${responseTime}ms`);

          // Opcional: mostrar response data (cuidado con responses grandes)
          if (data && process.env.LOG_RESPONSE_DATA === 'true') {
            this.logger.log(`📤 Response: ${JSON.stringify(data, null, 2)}`);
          }

          this.logger.log('='.repeat(80));
        },
        error: (error) => {
          const responseTime = Date.now() - now;

          // Intentar mostrar el body incluso en error
          this.logRequestBody(request);

          this.logger.error(
            `❌ Error after ${responseTime}ms: ${error.message}`,
          );

          // Mostrar detalles del error
          if (error.response) {
            this.logger.error(
              `Error details: ${JSON.stringify(error.response, null, 2)}`,
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

  private logRequestStart(request: any) {
    const { method, url, query, params, headers } = request;

    this.logger.log('='.repeat(80));
    this.logger.log(`📥 Incoming Request: ${method} ${url}`);
    this.logger.log('-'.repeat(80));

    if (params && Object.keys(params).length > 0) {
      this.logger.log(`📍 Params: ${JSON.stringify(params, null, 2)}`);
    }

    if (query && Object.keys(query).length > 0) {
      this.logger.log(`🔍 Query: ${JSON.stringify(query, null, 2)}`);
    }

    // Headers
    const relevantHeaders = {
      'content-type': headers['content-type'],
      'user-agent': headers['user-agent'],
      authorization: headers['authorization'] ? '[PRESENT]' : '[NOT PRESENT]',
    };
    this.logger.log(`📋 Headers: ${JSON.stringify(relevantHeaders, null, 2)}`);
  }

  private logRequestBody(request: any) {
    const { body, headers, files, file } = request;

    // Manejar multipart/form-data
    if (headers['content-type']?.includes('multipart/form-data')) {
      this.logger.log('📦 Body Type: multipart/form-data');

      // Mostrar archivos si existen
      if (file) {
        this.logger.log(
          `📎 File: ${JSON.stringify(
            {
              fieldname: file.fieldname,
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            },
            null,
            2,
          )}`,
        );
      }

      if (files) {
        const filesInfo = Array.isArray(files)
          ? files.map((f) => ({
              fieldname: f.fieldname,
              originalname: f.originalname,
              mimetype: f.mimetype,
              size: f.size,
            }))
          : Object.entries(files).reduce((acc, [key, fileArray]) => {
              acc[key] = (fileArray as any[]).map((f) => ({
                originalname: f.originalname,
                mimetype: f.mimetype,
                size: f.size,
              }));
              return acc;
            }, {});

        this.logger.log(`📎 Files: ${JSON.stringify(filesInfo, null, 2)}`);
      }

      // Mostrar campos del body (sin archivos)
      if (body && Object.keys(body).length > 0) {
        // Filtrar propiedades que son archivos
        const bodyFields = { ...body };

        // Remover campos que son objetos de archivo
        Object.keys(bodyFields).forEach((key) => {
          if (
            bodyFields[key] &&
            typeof bodyFields[key] === 'object' &&
            (bodyFields[key].fieldname || bodyFields[key].buffer)
          ) {
            delete bodyFields[key];
          }
        });

        if (Object.keys(bodyFields).length > 0) {
          this.logger.log(
            `📝 Form Fields: ${JSON.stringify(bodyFields, null, 2)}`,
          );
        }
      }
    } else if (body && Object.keys(body).length > 0) {
      this.logger.log(`📦 Body: ${JSON.stringify(body, null, 2)}`);
    }
  }
}
