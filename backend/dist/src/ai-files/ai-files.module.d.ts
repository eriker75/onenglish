import { DynamicModule, ModuleMetadata } from '@nestjs/common';
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
            model: string;
        };
    };
}
export interface AiFilesModuleAsyncOptions {
    imports?: ModuleMetadata['imports'];
    useFactory: (...args: any[]) => Promise<AiFilesModuleOptions> | AiFilesModuleOptions;
    inject?: any[];
}
export declare class AiFilesModule {
    private static readonly ROOT_OPTIONS_TOKEN;
    static forRoot(options: AiFilesModuleOptions): DynamicModule;
    static forRootAsync(options?: AiFilesModuleAsyncOptions): DynamicModule;
    static forFeature(token: string, options: AiFilesModuleOptions): DynamicModule;
    static forFeatureAsync(token: string, options: AiFilesModuleAsyncOptions): DynamicModule;
    private static createServiceWithAdapters;
    private static createAsyncProviders;
    private static createDefaultAsyncProviders;
}
