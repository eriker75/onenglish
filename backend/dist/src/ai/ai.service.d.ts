export interface AiServiceOptions {
    provider: string;
    apiKey: string;
    model: string;
    temperature?: number;
}
export declare class AiService {
    private readonly options;
    private llm;
    constructor(options: AiServiceOptions);
    onModuleInit(): Promise<void>;
    invoke(prompt: string): Promise<string | (import("@langchain/core/messages").ContentBlock | import("@langchain/core/messages").ContentBlock.Text)[]>;
    invokeText(prompt: string): Promise<string>;
}
