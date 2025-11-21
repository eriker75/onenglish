# Ejemplo Real: Usar OpenAI en QuestionsModule

## Tu configuración actual (solo Gemini)

```typescript
// questions/questions.module.ts
@Module({
  imports: [
    // ...
    AiFilesModule.forFeature('QUESTIONS_AI_FILES', {
      defaultProvider: 'google_genai',
      providers: {
        gemini: {
          apiKey: process.env.GEMINI_API_KEY || '',
          model: 'gemini-2.0-flash-exp',
          defaultTemperature: 0.2,
        },
      },
    }),
  ],
  // ...
})
export class QuestionsModule {}
```

---

## ✅ Opción 1: Agregar OpenAI a tu configuración existente

```typescript
// questions/questions.module.ts
@Module({
  imports: [
    DatabaseModule,
    FilesModule,
    AiModule.forFeature('QUESTIONS_AI', {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4o-mini',
      temperature: 0.2,
    }),
    AiFilesModule.forFeature('QUESTIONS_AI_FILES', {
      defaultProvider: 'openai', // ✨ Cambiar a OpenAI por defecto
      providers: {
        gemini: {
          apiKey: process.env.GEMINI_API_KEY || '',
          model: 'gemini-2.0-flash-exp',
          defaultTemperature: 0.2,
        },
        openai: { // ✨ Agregar OpenAI
          apiKey: process.env.OPENAI_API_KEY || '',
          visionModel: 'gpt-4o', // Para imágenes
          audioModel: 'whisper-1', // Para audio
          defaultTemperature: 0.2,
        },
      },
    }),
    NestjsFormDataModule,
  ],
  // ... resto igual
})
export class QuestionsModule {}
```

---

## ✅ Opción 2: Usar el servicio global (Más simple)

Si ya tienes `AiFilesModule.forRootAsync()` configurado en `app.module.ts` con ambos providers, puedes **eliminar** el `forFeature` del QuestionsModule:

```typescript
// questions/questions.module.ts
@Module({
  imports: [
    DatabaseModule,
    FilesModule,
    AiModule.forFeature('QUESTIONS_AI', {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4o-mini',
      temperature: 0.2,
    }),
    // ❌ ELIMINAR AiFilesModule.forFeature
    // ✅ Usar el servicio global de app.module.ts
    NestjsFormDataModule,
  ],
  // ... resto igual
})
export class QuestionsModule {}
```

Y en `app.module.ts`:

```typescript
@Module({
  imports: [
    // ... otros imports
    AiFilesModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        defaultProvider: 'openai', // Provider por defecto
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

---

## 🔧 Cómo usar en QuestionValidationService

Tu servicio actual ya está listo! Solo necesitas especificar qué provider usar:

```typescript
// question-validation.service.ts
@Injectable()
export class QuestionValidationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiFilesService: AiFilesService, // Ya inyectado ✅
    @Inject('QUESTIONS_AI') private readonly aiService: AiService,
  ) {}

  // Ejemplo: Validar spelling con OpenAI
  private async validateSpelling(question: any, audioFile: any): Promise<ValidationResult> {
    const audioInput: FileInput = {
      data: audioFile.buffer.toString('base64'),
      mimeType: audioFile.mimetype,
      fileType: FileType.AUDIO,
      fileName: audioFile.originalname,
    };

    // Usar OpenAI específicamente
    const result = await this.aiFilesService.validateSpellingFromAudio(
      audioInput,
      question.answer.expectedWord,
      'openai', // ✨ Especificar OpenAI
    );

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return {
      isCorrect: result.data.isCorrect,
      pointsEarned: result.data.isCorrect ? question.points : 0,
      feedbackEnglish: result.data.analysis,
      details: {
        transcription: result.data.transcription,
        speltWord: result.data.speltWord,
        provider: result.provider, // 'openai'
        model: result.model, // 'gpt-4o' o 'whisper-1'
      },
    };
  }

  // Ejemplo: Validar spelling con Gemini
  private async validateSpellingWithGemini(question: any, audioFile: any): Promise<ValidationResult> {
    const audioInput: FileInput = {
      data: audioFile.buffer.toString('base64'),
      mimeType: audioFile.mimetype,
      fileType: FileType.AUDIO,
      fileName: audioFile.originalname,
    };

    // Usar Gemini específicamente
    const result = await this.aiFilesService.validateSpellingFromAudio(
      audioInput,
      question.answer.expectedWord,
      'google_genai', // ✨ Especificar Gemini
    );

    return {
      isCorrect: result.data.isCorrect,
      pointsEarned: result.data.isCorrect ? question.points : 0,
      feedbackEnglish: result.data.analysis,
    };
  }

  // Ejemplo: Usar el provider por defecto (configurado en el módulo)
  private async validateSpellingDefault(question: any, audioFile: any): Promise<ValidationResult> {
    const audioInput: FileInput = {
      data: audioFile.buffer.toString('base64'),
      mimeType: audioFile.mimetype,
      fileType: FileType.AUDIO,
      fileName: audioFile.originalname,
    };

    // No especificar provider = usar el default
    const result = await this.aiFilesService.validateSpellingFromAudio(
      audioInput,
      question.answer.expectedWord,
      // Sin tercer parámetro = usa el defaultProvider del módulo
    );

    return {
      isCorrect: result.data.isCorrect,
      pointsEarned: result.data.isCorrect ? question.points : 0,
      feedbackEnglish: result.data.analysis,
    };
  }
}
```

---

## 🎯 Ejemplo con procesamiento de imágenes (GPT-4 Vision)

```typescript
// Nuevo método para analizar imágenes de preguntas
async analyzeQuestionImage(imageFilePath: string): Promise<any> {
  const imageInput = this.aiFilesService.filePathToFileInput(
    imageFilePath,
    SupportedMimeType.IMAGE_JPEG,
    FileType.IMAGE,
  );

  const systemPrompt = \`You are an English teaching assistant.
  Analyze this image and generate a multiple choice question.

  Provide:
  1. A clear question about the image
  2. Four answer options (one correct, three distractors)
  3. Brief explanation of why the correct answer is right\`;

  const result = await this.aiFilesService.processSingleFile(
    imageInput,
    systemPrompt,
    'Generate a multiple choice question from this image',
    0.3,
    'openai', // Usar GPT-4 Vision
  );

  return result;
}

// Analizar múltiples imágenes para crear una historia
async createStoryFromImages(imagePaths: string[]): Promise<any> {
  const imageInputs = imagePaths.map(path =>
    this.aiFilesService.filePathToFileInput(
      path,
      SupportedMimeType.IMAGE_JPEG,
      FileType.IMAGE,
    ),
  );

  const result = await this.aiFilesService.createStoryFromImages(
    imageInputs,
    'short',
    'Use simple English suitable for B1 level students',
    'openai', // Especificar OpenAI
  );

  return result;
}
```

---

## 🔄 Comparar resultados entre providers

```typescript
async compareProvidersForSpelling(audioFile: any, expectedWord: string) {
  const audioInput: FileInput = {
    data: audioFile.buffer.toString('base64'),
    mimeType: audioFile.mimetype,
    fileType: FileType.AUDIO,
    fileName: audioFile.originalname,
  };

  // Validar con ambos providers en paralelo
  const [openaiResult, geminiResult] = await Promise.all([
    this.aiFilesService.validateSpellingFromAudio(
      audioInput,
      expectedWord,
      'openai',
    ),
    this.aiFilesService.validateSpellingFromAudio(
      audioInput,
      expectedWord,
      'google_genai',
    ),
  ]);

  return {
    openai: {
      isCorrect: openaiResult.data.isCorrect,
      analysis: openaiResult.data.analysis,
      provider: openaiResult.provider,
    },
    gemini: {
      isCorrect: geminiResult.data.isCorrect,
      analysis: geminiResult.data.analysis,
      provider: geminiResult.provider,
    },
    agreement: openaiResult.data.isCorrect === geminiResult.data.isCorrect,
  };
}
```

---

## 📝 Variables de entorno requeridas

Agrega a tu `.env`:

```env
# Existing
GEMINI_API_KEY=tu_gemini_key_aqui

# New
OPENAI_API_KEY=sk-tu_openai_key_aqui
```

---

## ✅ Resumen

### Si usas Opción 1 (forFeature):
- ✅ Configuración específica para Questions
- ✅ Puedes tener diferentes providers para diferentes módulos
- ✅ Más control granular

### Si usas Opción 2 (Global):
- ✅ Más simple, menos código
- ✅ Configuración centralizada en app.module.ts
- ✅ Fácil de mantener

### En el código del servicio:
- Especifica `'openai'` o `'google_genai'` como último parámetro
- Si no especificas, usa el `defaultProvider` del módulo
- Puedes mezclar ambos providers en el mismo servicio
