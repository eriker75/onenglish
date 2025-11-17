import { DynamicModule, ModuleMetadata } from '@nestjs/common';
import { AiServiceOptions } from './ai.service';
export interface AiModuleAsyncOptions {
    imports?: ModuleMetadata['imports'];
    useFactory: (...args: any[]) => Promise<AiServiceOptions> | AiServiceOptions;
    inject?: any[];
}
export declare class AiModule {
    private static readonly ROOT_OPTIONS_TOKEN;
    private static createAiServiceProvider;
    private static createAsyncOptionsProvider;
    static forRoot(options: AiServiceOptions): DynamicModule;
    static forRootAsync(options: AiModuleAsyncOptions): DynamicModule;
    static forFeature(token: string, options: AiServiceOptions): DynamicModule;
    static forFeatureAsync(token: string, options: AiModuleAsyncOptions): DynamicModule;
}
