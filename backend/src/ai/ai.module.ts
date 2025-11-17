import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
  Type,
} from '@nestjs/common';
import { AiService, AiServiceOptions } from './ai.service';

export interface AiModuleAsyncOptions {
  imports?: ModuleMetadata['imports'];
  useFactory: (...args: any[]) => Promise<AiServiceOptions> | AiServiceOptions;
  inject?: any[];
}

@Module({})
export class AiModule {
  private static readonly ROOT_OPTIONS_TOKEN = 'AI_OPTIONS';

  private static createAiServiceProvider(
    provideToken: string | symbol | Type<unknown>,
    optionsToken: string,
  ): Provider {
    return {
      provide: provideToken,
      useFactory: (opts: AiServiceOptions) => {
        return new AiService(opts);
      },
      inject: [optionsToken],
    };
  }

  private static createAsyncOptionsProvider(
    optionsToken: string,
    options: AiModuleAsyncOptions,
  ): Provider {
    return {
      provide: optionsToken,
      useFactory: options.useFactory,
      inject: options.inject ?? [],
    };
  }

  static forRoot(options: AiServiceOptions): DynamicModule {
    return {
      module: AiModule,
      providers: [
        {
          provide: this.ROOT_OPTIONS_TOKEN,
          useValue: options,
        },
        this.createAiServiceProvider(AiService, this.ROOT_OPTIONS_TOKEN),
      ],
      exports: [AiService],
    };
  }

  static forRootAsync(options: AiModuleAsyncOptions): DynamicModule {
    return {
      module: AiModule,
      imports: options.imports ?? [],
      providers: [
        this.createAsyncOptionsProvider(this.ROOT_OPTIONS_TOKEN, options),
        this.createAiServiceProvider(AiService, this.ROOT_OPTIONS_TOKEN),
      ],
      exports: [AiService],
    };
  }

  // Para múltiples proveedores con tokens específicos
  static forFeature(token: string, options: AiServiceOptions): DynamicModule {
    const optionsToken = `AI_OPTIONS_${token}`;
    return {
      module: AiModule,
      providers: [
        {
          provide: optionsToken,
          useValue: options,
        },
        this.createAiServiceProvider(token, optionsToken),
      ],
      exports: [token],
    };
  }

  static forFeatureAsync(
    token: string,
    options: AiModuleAsyncOptions,
  ): DynamicModule {
    const optionsToken = `AI_OPTIONS_${token}`;
    return {
      module: AiModule,
      imports: options.imports ?? [],
      providers: [
        this.createAsyncOptionsProvider(optionsToken, options),
        this.createAiServiceProvider(token, optionsToken),
      ],
      exports: [token],
    };
  }
}
