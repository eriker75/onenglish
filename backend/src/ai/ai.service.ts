import { Injectable } from '@nestjs/common';
import { initChatModel } from 'langchain/chat_models/universal';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ContentBlock } from '@langchain/core/messages';

export interface AiServiceOptions {
  provider: string; // "google_genai", "openai", etc.
  apiKey: string;
  model: string; // "gemini-2.5-pro", "gpt-4o", etc.
  temperature?: number;
}

@Injectable()
export class AiService {
  private llm: BaseChatModel;

  constructor(private readonly options: AiServiceOptions) {}

  // Inicialización asincrónica recomendada
  async onModuleInit() {
    this.llm = await initChatModel(this.options.model, {
      modelProvider: this.options.provider,
      apiKey: this.options.apiKey,
      temperature: this.options.temperature ?? 0.2,
    });
  }

  async invoke(prompt: string) {
    const msg = [{ role: 'user', content: prompt }];
    const response = await this.llm.invoke(msg);
    return response.content;
  }

  async invokeText(prompt: string): Promise<string> {
    const content = await this.invoke(prompt);

    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .map((item: ContentBlock | ContentBlock.Text): string => {
          if (typeof item === 'string') return item;
          if (
            item.type === 'text' &&
            'text' in item &&
            typeof item.text === 'string'
          ) {
            return item.text;
          }

          return '';
        })
        .filter((text) => text.length > 0)
        .join('\n');
    }

    return String(content);
  }
}
