# Cómo usar OpenAI en el módulo Questions

## Configuración actual

El módulo Questions ya está configurado con ambos providers:
- **OpenAI** (por defecto) - Para audio e imágenes
- **Gemini** - También disponible

## Ejemplos de uso en tus servicios

### 1. Usar OpenAI (provider por defecto)

```typescript
// question-validation.service.ts

// Validar spelling con OpenAI (por defecto)
private async validateSpelling(question: any, audioFile: any): Promise<ValidationResult> {
  const audioInput: FileInput = {
    data: audioFile.buffer.toString('base64'),
    mimeType: audioFile.mimetype,
    fileType: FileType.AUDIO,
    fileName: audioFile.originalname,
  };

  // Como OpenAI es el default, no necesitas especificar el provider
  const result = await this.aiFilesService.validateSpellingFromAudio(
    audioInput,
    question.answer.expectedWord,
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
      model: result.model, // 'whisper-1' -> 'gpt-4o'
    },
  };
}
```

### 2. Usar Gemini explícitamente

```typescript
// Validar spelling con Gemini
private async validateSpellingWithGemini(question: any, audioFile: any): Promise<ValidationResult> {
  const audioInput: FileInput = {
    data: audioFile.buffer.toString('base64'),
    mimeType: audioFile.mimetype,
    fileType: FileType.AUDIO,
    fileName: audioFile.originalname,
  };

  // Especificar Gemini explícitamente
  const result = await this.aiFilesService.validateSpellingFromAudio(
    audioInput,
    question.answer.expectedWord,
    'google_genai', // ✨ Usar Gemini
  );

  return {
    isCorrect: result.data.isCorrect,
    pointsEarned: result.data.isCorrect ? question.points : 0,
    feedbackEnglish: result.data.analysis,
  };
}
```

### 3. Procesar imágenes con GPT-4 Vision

```typescript
// Nuevo método para analizar imágenes de preguntas
async analyzeQuestionImage(imageFilePath: string): Promise<any> {
  const imageInput = this.aiFilesService.filePathToFileInput(
    imageFilePath,
    SupportedMimeType.IMAGE_JPEG,
    FileType.IMAGE,
  );

  const systemPrompt = `You are an English teaching assistant.
  Analyze this image and describe what you see in detail.
  Focus on:
  1. Main objects and their names
  2. Actions happening (verbs)
  3. Descriptions (adjectives)
  4. Spatial relationships (prepositions)`;

  // Usar OpenAI (default)
  const result = await this.aiFilesService.processSingleFile(
    imageInput,
    systemPrompt,
    'Describe this image for an English learning question',
    0.3,
  );

  return result;
}
```

### 4. Validar audio con análisis detallado

```typescript
// En question-validation.service.ts

private async validateGossip(question: any, audioFile: any): Promise<ValidationResult> {
  const audioInput: FileInput = {
    data: audioFile.buffer.toString('base64'),
    mimeType: audioFile.mimetype,
    fileType: FileType.AUDIO,
    fileName: audioFile.originalname,
  };

  const systemPrompt = `You are an English pronunciation and grammar expert.
  The student is practicing the "gossip" exercise.
  Expected content: ${question.answer.expectedContent}

  Analyze:
  1. Transcription accuracy
  2. Grammar correctness
  3. Vocabulary usage
  4. Fluency
  5. Overall score (0-100)

  Respond with JSON format:
  {
    "transcription": "what the student said",
    "isCorrect": boolean,
    "score": number,
    "feedback": "detailed feedback in English",
    "feedbackSpanish": "feedback in Spanish"
  }`;

  // Usar OpenAI por defecto (Whisper + GPT-4)
  const result = await this.aiFilesService.processSingleFile(
    audioInput,
    systemPrompt,
    'Analyze this gossip exercise',
    0.2,
  );

  if (!result.success) {
    throw new BadRequestException(result.error);
  }

  // Parse JSON response
  const jsonMatch = result.data.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new BadRequestException('Invalid AI response');
  }

  const analysis = JSON.parse(jsonMatch[0]);

  return {
    isCorrect: analysis.isCorrect,
    pointsEarned: Math.round((analysis.score / 100) * question.points),
    feedbackEnglish: analysis.feedback,
    feedbackSpanish: analysis.feedbackSpanish,
    details: {
      transcription: analysis.transcription,
      score: analysis.score,
      provider: result.provider,
    },
  };
}
```

### 5. Comparar ambos providers

```typescript
// Validar con ambos y comparar resultados
async validateWithComparison(
  audioFile: any,
  expectedWord: string,
): Promise<any> {
  const audioInput: FileInput = {
    data: audioFile.buffer.toString('base64'),
    mimeType: audioFile.mimetype,
    fileType: FileType.AUDIO,
    fileName: audioFile.originalname,
  };

  // Ejecutar ambos en paralelo
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
      transcription: openaiResult.data.transcription,
      analysis: openaiResult.data.analysis,
      provider: openaiResult.provider,
      model: openaiResult.model,
    },
    gemini: {
      isCorrect: geminiResult.data.isCorrect,
      transcription: geminiResult.data.transcription,
      analysis: geminiResult.data.analysis,
      provider: geminiResult.provider,
      model: geminiResult.model,
    },
    agreement: openaiResult.data.isCorrect === geminiResult.data.isCorrect,
    recommendation: openaiResult.data.isCorrect ? 'Correct' : 'Incorrect',
  };
}
```

### 6. Crear preguntas desde múltiples imágenes

```typescript
async generateQuestionFromImages(imagePaths: string[]): Promise<any> {
  const imageInputs = imagePaths.map(path =>
    this.aiFilesService.filePathToFileInput(
      path,
      SupportedMimeType.IMAGE_JPEG,
      FileType.IMAGE,
    ),
  );

  const systemPrompt = `You are an English question generator.
  Create a creative story-based question from these images.

  Provide:
  1. A short story (2-3 sentences) connecting the images
  2. A comprehension question about the story
  3. Four answer options (A, B, C, D)
  4. The correct answer
  5. Brief explanation

  Format as JSON.`;

  // Usar OpenAI GPT-4 Vision
  const result = await this.aiFilesService.processMultipleFiles(
    {
      files: imageInputs,
      systemPrompt,
      userPrompt: 'Generate an English learning question from these images',
      temperature: 0.4,
    },
    'openai', // Especificar OpenAI
  );

  return result;
}
```

## 🎯 Mejores prácticas

### 1. Usar OpenAI para:
- ✅ Transcripción de audio de alta calidad (Whisper)
- ✅ Análisis de imágenes complejas (GPT-4 Vision)
- ✅ Análisis de texto posterior a transcripción
- ✅ Generación de feedback detallado

### 2. Usar Gemini para:
- ✅ Procesamiento multimodal (audio + imagen + video)
- ✅ Tareas que requieren contexto de múltiples tipos de archivos
- ✅ Video analysis (Gemini soporta video, OpenAI no)

### 3. Cambiar el provider por defecto

Si quieres volver a usar Gemini como default, cambia en `questions.module.ts`:

```typescript
AiFilesModule.forFeature('QUESTIONS_AI_FILES', {
  defaultProvider: 'google_genai', // ✨ Cambiar a Gemini
  providers: {
    // ... resto igual
  },
}),
```

## 📝 Variables de entorno

Asegúrate de tener en tu `.env`:

```env
GEMINI_API_KEY=tu_gemini_key_aqui
OPENAI_API_KEY=sk-tu_openai_key_aqui
```

## ✅ Resumen

Ahora en el módulo Questions tienes:

1. **OpenAI por defecto**
   - Whisper para transcripción de audio
   - GPT-4o para análisis de imágenes y texto

2. **Gemini disponible**
   - Solo especifica `'google_genai'` cuando lo necesites

3. **Flexibilidad total**
   - Cambia entre providers según la tarea
   - Compara resultados
   - Usa el mejor para cada caso

🎉 ¡Todo listo para usar!
