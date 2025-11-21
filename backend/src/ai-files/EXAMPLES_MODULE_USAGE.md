# Cómo usar AiFilesModule en otros módulos

## Opción 1: Usar el servicio global (Recomendado y más simple)

Si ya configuraste `AiFilesModule` globalmente en `app.module.ts`, simplemente inyecta el servicio en cualquier módulo.

### Paso 1: En tu módulo, NO necesitas importar nada

```typescript
// ejemplo: questions/questions.module.ts
import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
// ¡No necesitas importar AiFilesModule aquí!
```

### Paso 2: Inyecta el servicio directamente en tu servicio

```typescript
// questions/questions.service.ts
import { Injectable } from '@nestjs/common';
import {
  AiFilesService,
  FileType,
  SupportedMimeType
} from '../ai-files';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly aiFilesService: AiFilesService, // Inyección directa
    // ... otros servicios
  ) {}

  async validateStudentAudio(audioPath: string, expectedWord: string) {
    // Convertir archivo a FileInput
    const audioInput = this.aiFilesService.filePathToFileInput(
      audioPath,
      SupportedMimeType.AUDIO_MP3,
      FileType.AUDIO,
    );

    // Usar con OpenAI
    const result = await this.aiFilesService.validateSpellingFromAudio(
      audioInput,
      expectedWord,
      'openai', // Especifica OpenAI
    );

    if (result.success) {
      return {
        isCorrect: result.data.isCorrect,
        feedback: result.data.analysis,
      };
    }

    throw new Error(result.error);
  }

  async analyzeImageQuestion(imagePath: string) {
    const imageInput = this.aiFilesService.filePathToFileInput(
      imagePath,
      SupportedMimeType.IMAGE_JPEG,
      FileType.IMAGE,
    );

    // Usar con Gemini
    const result = await this.aiFilesService.processSingleFile(
      imageInput,
      'Describe this image in detail for an English learning question',
      'What do you see?',
      0.3,
      'google_genai', // Especifica Gemini
    );

    return result;
  }
}
```

### Paso 3: Usar en tu controller

```typescript
// questions/questions.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('validate-audio')
  async validateAudio(@Body() body: { audioPath: string; word: string }) {
    return this.questionsService.validateStudentAudio(
      body.audioPath,
      body.word,
    );
  }

  @Post('analyze-image')
  async analyzeImage(@Body() body: { imagePath: string }) {
    return this.questionsService.analyzeImageQuestion(body.imagePath);
  }
}
```

---

## Opción 2: Configuración específica para un módulo (Avanzado)

Si necesitas una configuración DIFERENTE de AI para un módulo específico (por ejemplo, diferentes API keys o modelos), usa `forFeature()`:

### Ejemplo: Módulo de Challenges con configuración personalizada

```typescript
// challenges/challenges.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiFilesModule } from '../ai-files/ai-files.module';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';

@Module({
  imports: [
    // Importar con configuración específica
    AiFilesModule.forFeatureAsync('CHALLENGES_AI', {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        defaultProvider: 'openai', // Solo OpenAI para challenges
        providers: {
          openai: {
            apiKey: configService.get<string>('OPENAI_API_KEY')!,
            visionModel: 'gpt-4o-mini', // Modelo más económico
            audioModel: 'whisper-1',
            defaultTemperature: 0.5, // Más creativo
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
```

### Inyectar la instancia personalizada

```typescript
// challenges/challenges.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { AiFilesService } from '../ai-files';

@Injectable()
export class ChallengesService {
  constructor(
    @Inject('CHALLENGES_AI') // Usar el token específico
    private readonly challengesAi: AiFilesService,
  ) {}

  async generateCreativeStory(imagePaths: string[]) {
    // Este servicio usa la configuración personalizada (gpt-4o-mini, temp 0.5)
    const imageInputs = imagePaths.map((path) =>
      this.challengesAi.filePathToFileInput(
        path,
        SupportedMimeType.IMAGE_JPEG,
        FileType.IMAGE,
      ),
    );

    const result = await this.challengesAi.createStoryFromImages(
      imageInputs,
      'detailed',
      'Create a fun and creative story for English learners',
    );

    return result;
  }
}
```

---

## Opción 3: Usar ambos (Global + Personalizado)

Puedes tener acceso tanto al servicio global como a uno personalizado:

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { AiFilesService } from '../ai-files';

@Injectable()
export class MyService {
  constructor(
    private readonly aiFilesService: AiFilesService, // Servicio global
    @Inject('CUSTOM_AI')
    private readonly customAi: AiFilesService, // Servicio personalizado
  ) {}

  async useGlobalConfig() {
    // Usa la configuración global de app.module.ts
    return this.aiFilesService.validateSpellingFromAudio(...);
  }

  async useCustomConfig() {
    // Usa la configuración personalizada del módulo
    return this.customAi.createStoryFromImages(...);
  }
}
```

---

## Ejemplo completo: Módulo de Spelling Validation

Aquí un ejemplo completo de cómo crear un módulo de validación de spelling:

```typescript
// spelling/spelling.module.ts
import { Module } from '@nestjs/common';
import { SpellingService } from './spelling.service';
import { SpellingController } from './spelling.controller';
// NO necesitas importar AiFilesModule si usas el global

@Module({
  controllers: [SpellingController],
  providers: [SpellingService],
  exports: [SpellingService],
})
export class SpellingModule {}
```

```typescript
// spelling/spelling.service.ts
import { Injectable } from '@nestjs/common';
import {
  AiFilesService,
  FileType,
  SupportedMimeType
} from '../ai-files';

@Injectable()
export class SpellingService {
  constructor(private readonly aiFilesService: AiFilesService) {}

  async validateWithOpenAI(audioPath: string, word: string) {
    const audioInput = this.aiFilesService.filePathToFileInput(
      audioPath,
      SupportedMimeType.AUDIO_MP3,
      FileType.AUDIO,
    );

    return this.aiFilesService.validateSpellingFromAudio(
      audioInput,
      word,
      'openai', // Usa OpenAI
    );
  }

  async validateWithGemini(audioPath: string, word: string) {
    const audioInput = this.aiFilesService.filePathToFileInput(
      audioPath,
      SupportedMimeType.AUDIO_MP3,
      FileType.AUDIO,
    );

    return this.aiFilesService.validateSpellingFromAudio(
      audioInput,
      word,
      'google_genai', // Usa Gemini
    );
  }

  async validateWithDefault(audioPath: string, word: string) {
    const audioInput = this.aiFilesService.filePathToFileInput(
      audioPath,
      SupportedMimeType.AUDIO_MP3,
      FileType.AUDIO,
    );

    // Usa el provider por defecto (configurado en app.module.ts)
    return this.aiFilesService.validateSpellingFromAudio(audioInput, word);
  }
}
```

---

## Resumen

### ✅ Usa Opción 1 (Global) si:
- Todos los módulos usan la misma configuración de AI
- Quieres simplicidad
- No necesitas diferentes API keys o modelos por módulo

### ✅ Usa Opción 2 (Feature) si:
- Necesitas configuraciones diferentes por módulo
- Quieres aislar las configuraciones
- Necesitas diferentes API keys para diferentes funcionalidades

### ✅ Usa Opción 3 (Ambos) si:
- Necesitas tanto configuración global como específica
- Quieres comparar resultados entre providers
- Tienes casos de uso muy específicos

---

## Configuración en app.module.ts (recordatorio)

Para que la Opción 1 funcione, asegúrate de tener esto en `app.module.ts`:

```typescript
import { AiFilesModule } from './ai-files/ai-files.module';

@Module({
  imports: [
    // ... otros imports
    AiFilesModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        defaultProvider: 'openai', // o 'google_genai'
        providers: {
          gemini: {
            apiKey: configService.get<string>('GEMINI_API_KEY')!,
            model: 'gemini-2.0-flash-exp',
            defaultTemperature: 0.2,
          },
          openai: {
            apiKey: configService.get<string>('OPENAI_API_KEY')!,
            visionModel: 'gpt-4o',
            audioModel: 'whisper-1',
            defaultTemperature: 0.2,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

Y en tu `.env`:

```env
GEMINI_API_KEY=tu_key_aqui
OPENAI_API_KEY=tu_key_aqui
```
