import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AiFilesService } from './ai-files.service';
import { GeminiFilesAdapter } from './adapters/gemini-files.adapter';
import { OpenAIFilesAdapter } from './adapters/openai-files.adapter';
import { AiFilesTestController } from './controllers/ai-files-test.controller';

export interface AiFilesModuleOptions {
  defaultProvider?: string;
  providers: {
    gemini?: {
      apiKey: string;
      model: string;
      defaultTemperature?: number;
    };
    openai?: {
      apiKey: string;
      visionModel?: string; // 'gpt-4o', 'gpt-4-turbo', etc.
      audioModel?: string; // 'whisper-1'
      defaultTemperature?: number;
    };
  };
}

export interface AiFilesModuleAsyncOptions {
  imports?: ModuleMetadata['imports'];
  useFactory: (
    ...args: any[]
  ) => Promise<AiFilesModuleOptions> | AiFilesModuleOptions;
  inject?: any[];
}

@Module({})
export class AiFilesModule {
  private static readonly ROOT_OPTIONS_TOKEN = 'AI_FILES_OPTIONS';

  static forRoot(options: AiFilesModuleOptions): DynamicModule {
    return {
      module: AiFilesModule,
      imports: [NestjsFormDataModule],
      controllers: [AiFilesTestController],
      providers: [
        {
          provide: this.ROOT_OPTIONS_TOKEN,
          useValue: options,
        },
        {
          provide: AiFilesService,
          useFactory: (opts: AiFilesModuleOptions) => {
            return this.createServiceWithAdapters(opts);
          },
          inject: [this.ROOT_OPTIONS_TOKEN],
        },
      ],
      exports: [AiFilesService],
    };
  }

  static forRootAsync(options?: AiFilesModuleAsyncOptions): DynamicModule {
    const asyncProviders = options
      ? this.createAsyncProviders(options)
      : this.createDefaultAsyncProviders();

    return {
      global: true,
      module: AiFilesModule,
      imports: [NestjsFormDataModule, ...(options?.imports ?? [ConfigModule])],
      controllers: [AiFilesTestController],
      providers: [
        ...asyncProviders,
        {
          provide: AiFilesService,
          useFactory: (opts: AiFilesModuleOptions) => {
            return this.createServiceWithAdapters(opts);
          },
          inject: [this.ROOT_OPTIONS_TOKEN],
        },
      ],
      exports: [AiFilesService],
    };
  }

  static forFeature(
    token: string,
    options: AiFilesModuleOptions,
  ): DynamicModule {
    const optionsToken = `AI_FILES_OPTIONS_${token}`;
    return {
      module: AiFilesModule,
      providers: [
        {
          provide: optionsToken,
          useValue: options,
        },
        {
          provide: token,
          useFactory: (opts: AiFilesModuleOptions) => {
            return this.createServiceWithAdapters(opts);
          },
          inject: [optionsToken],
        },
      ],
      exports: [token],
    };
  }

  static forFeatureAsync(
    token: string,
    options: AiFilesModuleAsyncOptions,
  ): DynamicModule {
    const optionsToken = `AI_FILES_OPTIONS_${token}`;
    return {
      module: AiFilesModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: optionsToken,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        {
          provide: token,
          useFactory: (opts: AiFilesModuleOptions) => {
            return this.createServiceWithAdapters(opts);
          },
          inject: [optionsToken],
        },
      ],
      exports: [token],
    };
  }

  private static createServiceWithAdapters(
    options: AiFilesModuleOptions,
  ): AiFilesService {
    const service = new AiFilesService();

    // Register Gemini adapter if configured
    if (options.providers.gemini) {
      const geminiAdapter = new GeminiFilesAdapter({
        apiKey: options.providers.gemini.apiKey,
        model: options.providers.gemini.model,
        defaultTemperature: options.providers.gemini.defaultTemperature,
      });
      service.registerAdapter(geminiAdapter);
    }

    // Register OpenAI adapter if configured
    if (options.providers.openai) {
      const openaiAdapter = new OpenAIFilesAdapter({
        apiKey: options.providers.openai.apiKey,
        visionModel: options.providers.openai.visionModel,
        audioModel: options.providers.openai.audioModel,
        defaultTemperature: options.providers.openai.defaultTemperature,
      });
      service.registerAdapter(openaiAdapter);
    }

    // Set default provider
    if (options.defaultProvider) {
      service.setDefaultProvider(options.defaultProvider);
    } else if (options.providers.gemini) {
      // Default to gemini if no default specified but gemini is configured
      service.setDefaultProvider('google_genai');
    } else if (options.providers.openai) {
      // Default to openai if gemini is not configured
      service.setDefaultProvider('openai');
    }

    return service;
  }

  private static createAsyncProviders(
    options: AiFilesModuleAsyncOptions,
  ): Provider[] {
    return [
      {
        provide: this.ROOT_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      },
    ];
  }

  private static createDefaultAsyncProviders(): Provider[] {
    return [
      {
        provide: this.ROOT_OPTIONS_TOKEN,
        useFactory: (configService: ConfigService): AiFilesModuleOptions => {
          return {
            defaultProvider: 'google_genai',
            providers: {
              gemini: {
                apiKey: configService.get<string>('GEMINI_API_KEY')!,
                model:
                  configService.get<string>('GEMINI_MODEL') ||
                  'gemini-2.0-flash-exp',
                defaultTemperature: 0.2,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ];
  }
}
