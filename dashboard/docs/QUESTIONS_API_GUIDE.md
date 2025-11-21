# 📚 Guía de API de Questions - Frontend

> **Última actualización**: 2025-01-20
> **Cambios recientes**: Sincronización con DTOs del backend (commits: f676939, fb354a6)

## 🎯 Descripción General

Esta guía documenta cómo usar los DTOs actualizados para crear preguntas en el frontend, asegurando compatibilidad con el backend.

---

## 🆕 Cambios Recientes Importantes

### ⚠️ Campos de Media Agregados (Opcional)

Tres DTOs ahora soportan imágenes de referencia opcionales:

1. **CreateTagItDto**: Agregó `media?: File`
2. **CreateReportItDto**: Agregó `media?: File`
3. **CreateWordAssociationsDto**: Agregó `media?: File`

### ⚠️ Cambios de Estructura

1. **CreateWordboxDto**: Los campos `gridWidth`, `gridHeight`, `maxWords` ahora son directos (no en configuration)
2. **CreateImageToMultipleChoicesDto**: `media` ahora es `File[]` (array) en lugar de `File` único
3. **CreateUnscrambleDto**: `answer` ahora es `string[]` en lugar de `string`
4. **CreateTagItDto**: Campo `options` renombrado a `content`

---

## 📋 DTOs por Categoría

### 1️⃣ VOCABULARY (Vocabulario)

#### CreateImageToMultipleChoicesDto
```typescript
interface CreateImageToMultipleChoicesDto {
  challengeId: string;
  stage: QuestionStage;
  phase: string;
  points: number;
  timeLimit?: number;      // Default: 60
  maxAttempts?: number;    // Default: 1
  text?: string;
  instructions?: string;

  media: File;             // ✅ Archivo de imagen único (max 5MB)
  options: string[];       // Min 2 opciones
  answer: string;          // Debe ser una de las opciones
}
```

**Ejemplo de uso con FormData:**
```typescript
const formData = new FormData();
formData.append('challengeId', challengeId);
formData.append('stage', 'VOCABULARY');
formData.append('phase', 'phase_1');
formData.append('points', '10');

// ✅ Un solo archivo de imagen
formData.append('media', imageFile);

formData.append('options', 'Apple,Orange,Banana,Grapes');
formData.append('answer', 'Apple');

await createQuestion('image_to_multiple_choices', formData);
```

**📥 Formato de Respuesta:**
```typescript
// La respuesta del endpoint devuelve un solo objeto image (no array)
{
  id: "uuid",
  type: "image_to_multiple_choices",
  stage: "VOCABULARY",
  phase: "phase_1",
  position: 1,
  points: 10,
  timeLimit: 60,
  maxAttempts: 1,
  text: "What is shown in the image?",
  instructions: "Select the correct option that matches the image.",
  validationMethod: "AUTO",
  image: {  // ⚠️ SINGULAR (no "images" array)
    id: "uuid",
    url: "/uploads/image/filename.png",
    type: "image",
    filename: "original.png",
    mimeType: "image/png",
    size: 12345,
    position: 0,
    context: "main"
  },
  options: ["Apple", "Orange", "Banana", "Grapes"],
  answer: "Apple",
  // Note: configurations omitido cuando está vacío
  createdAt: "2025-11-20T18:01:36.207Z",
  updatedAt: "2025-11-20T18:01:36.207Z"
}
```

---

#### CreateWordboxDto
```typescript
interface CreateWordboxDto {
  challengeId: string;
  stage: QuestionStage;
  phase: string;
  points: number;
  timeLimit?: number;
  maxAttempts?: number;
  text?: string;
  instructions?: string;

  gridWidth: number;       // ⚠️ CAMBIO: Ahora es directo (1-10)
  gridHeight: number;      // ⚠️ CAMBIO: Ahora es directo (1-10)
  maxWords: number;        // ⚠️ CAMBIO: Ahora es directo (1-50, default 5)
  content: string[][];     // Grid de letras
}
```

**Ejemplo de uso con JSON:**
```typescript
const data = {
  challengeId: 'uuid',
  stage: 'VOCABULARY',
  phase: 'phase_1',
  points: 15,
  gridWidth: 3,         // ⚠️ Directo, no en configuration
  gridHeight: 3,        // ⚠️ Directo, no en configuration
  maxWords: 5,          // ⚠️ Directo, no en configuration
  content: [
    ['C', 'A', 'T'],
    ['R', 'O', 'D'],
    ['E', 'A', 'T']
  ]
};

await createQuestion('wordbox', data);
```

---

#### CreateWordAssociationsDto
```typescript
interface CreateWordAssociationsDto {
  challengeId: string;
  stage: QuestionStage;
  phase: string;
  points: number;
  timeLimit?: number;
  maxAttempts?: number;
  text?: string;
  instructions?: string;

  content: string;                    // Palabra central
  configuration: Record<string, unknown>; // ⚠️ REQUERIDO (no opcional)
  media?: File;                       // 🆕 NUEVO: Imagen de referencia
}
```

**Ejemplo con media opcional:**
```typescript
// Sin imagen
const data = {
  challengeId: 'uuid',
  stage: 'VOCABULARY',
  phase: 'phase_1',
  points: 10,
  content: 'Journey',
  configuration: { totalAssociations: 20 }
};
await createQuestion('word_associations', data);

// Con imagen (usar FormData)
const formData = new FormData();
formData.append('challengeId', challengeId);
formData.append('stage', 'VOCABULARY');
formData.append('phase', 'phase_1');
formData.append('points', '10');
formData.append('content', 'Journey');
formData.append('configuration', JSON.stringify({ totalAssociations: 20 }));
formData.append('media', imageFile); // 🆕 Opcional

await createQuestion('word_associations', formData);
```

---

### 2️⃣ GRAMMAR (Gramática)

#### CreateTagItDto
```typescript
interface CreateTagItDto {
  challengeId: string;
  stage: QuestionStage;
  phase: string;
  points: number;
  timeLimit?: number;
  maxAttempts?: number;
  text?: string;
  instructions?: string;

  content: string[];       // ⚠️ CAMBIO: Antes era "options" (min 2)
  answer: string[];        // Respuestas aceptables (min 1)
  media?: File;            // 🆕 NUEVO: Imagen de referencia
}
```

**Ejemplo:**
```typescript
// Sin imagen (JSON)
const data = {
  challengeId: 'uuid',
  stage: 'GRAMMAR',
  phase: 'phase_2',
  points: 10,
  content: ['He is responsible for the project,', '?'],
  answer: ["isn't he?", 'is not he?']
};
await createQuestion('tag_it', data);

// Con imagen (FormData)
const formData = new FormData();
formData.append('challengeId', challengeId);
formData.append('stage', 'GRAMMAR');
formData.append('phase', 'phase_2');
formData.append('points', '10');
formData.append('content', JSON.stringify(['He is responsible,', '?']));
formData.append('answer', JSON.stringify(["isn't he?"]));
formData.append('media', imageFile); // 🆕 Opcional

await createQuestion('tag_it', formData);
```

---

#### CreateReportItDto
```typescript
interface CreateReportItDto {
  challengeId: string;
  stage: QuestionStage;
  phase: string;
  points: number;
  timeLimit?: number;
  maxAttempts?: number;
  text?: string;
  instructions?: string;

  content: string;         // Direct speech sentence
  media?: File;            // 🆕 NUEVO: Imagen de referencia
  // ⚠️ REMOVIDO: answer (no existe en backend)
}
```

**Ejemplo:**
```typescript
// Sin imagen (JSON)
const data = {
  challengeId: 'uuid',
  stage: 'GRAMMAR',
  phase: 'phase_3',
  points: 12,
  content: '"I will call you tomorrow," she said.'
};
await createQuestion('report_it', data);

// Con imagen (FormData)
const formData = new FormData();
formData.append('challengeId', challengeId);
formData.append('stage', 'GRAMMAR');
formData.append('phase', 'phase_3');
formData.append('points', '12');
formData.append('content', '"I will call you tomorrow," she said.');
formData.append('media', imageFile); // 🆕 Opcional

await createQuestion('report_it', formData);
```

---

#### CreateUnscrambleDto
```typescript
interface CreateUnscrambleDto {
  challengeId: string;
  stage: QuestionStage;
  phase: string;
  points: number;
  timeLimit?: number;
  maxAttempts?: number;
  text?: string;
  instructions?: string;

  content: string[];       // Palabras desordenadas (min 2)
  answer: string[];        // ⚠️ CAMBIO: Ahora es array (min 2)
}
```

**Ejemplo:**
```typescript
const data = {
  challengeId: 'uuid',
  stage: 'GRAMMAR',
  phase: 'phase_1',
  points: 8,
  content: ['to', 'school', 'go', 'I'],
  answer: ['I', 'go', 'to', 'school'] // ⚠️ Array, no string
};

await createQuestion('unscramble', data);
```

---

### 3️⃣ LISTENING (Escucha)

#### CreateTopicBasedAudioDto
```typescript
interface TopicBasedAudioSubQuestionDto {
  text: string;
  options: string[];       // ⚠️ CAMBIO: Ahora es string[] simple (min 2)
  answer: string;          // Debe ser una de las opciones
  points: number;
}

interface CreateTopicBasedAudioDto {
  challengeId: string;
  stage: QuestionStage;
  phase: string;
  points?: number;         // Auto-calculado
  timeLimit?: number;
  maxAttempts?: number;
  text?: string;
  instructions?: string;

  media: File;             // Audio (mp3/wav/ogg, max 10MB)
  subQuestions: TopicBasedAudioSubQuestionDto[];
  parentQuestionId?: string;
}
```

**Ejemplo:**
```typescript
const formData = new FormData();
formData.append('challengeId', challengeId);
formData.append('stage', 'LISTENING');
formData.append('phase', 'phase_1');
formData.append('media', audioFile);

// Backend espera JSON string para subQuestions
const subQuestions = [
  {
    text: 'What is the main topic?',
    options: ['Education', 'Sports', 'Technology'],
    answer: 'Technology',
    points: 5
  },
  {
    text: 'Who is speaking?',
    options: ['Teacher', 'Student', 'Reporter'],
    answer: 'Reporter',
    points: 5
  }
];

formData.append('subQuestions', JSON.stringify(subQuestions));

await createQuestion('topic_based_audio', formData);
```

---

## 🔄 Guía de Migración

### Si usabas CreateTagItDto (options → content)

**Antes:**
```typescript
const data = {
  options: ['word1', 'word2'],
  answer: ['answer1']
};
```

**Ahora:**
```typescript
const data = {
  content: ['word1', 'word2'], // ⚠️ Renombrado
  answer: ['answer1'],
  media: optionalImageFile      // 🆕 Nuevo campo opcional
};
```

---

### Si usabas CreateWordboxDto (configuration → campos directos)

**Antes:**
```typescript
const data = {
  content: [['A', 'B'], ['C', 'D']],
  configuration: {
    gridWidth: 2,
    gridHeight: 2,
    minWordLength: 3  // Este campo no existe en backend
  }
};
```

**Ahora:**
```typescript
const data = {
  gridWidth: 2,      // ⚠️ Campo directo
  gridHeight: 2,     // ⚠️ Campo directo
  maxWords: 5,       // ⚠️ Campo directo (antes minWordLength no existe)
  content: [['A', 'B'], ['C', 'D']]
};
```

---

### Si usabas CreateImageToMultipleChoicesDto (media único → array)

**Antes:**
```typescript
formData.append('media', singleImageFile);
```

**Ahora:**
```typescript
// Puedes enviar múltiples imágenes
imageFiles.forEach(file => {
  formData.append('media', file);
});

// O una sola imagen (pero el tipo es File[])
formData.append('media', imageFile);
```

---

## 📝 Validaciones Importantes

### Campos Requeridos en BaseCreateQuestionDto

```typescript
✅ challengeId: string (UUID)
✅ stage: QuestionStage (enum)
✅ phase: string (formato: "phase_1", "phase_2", etc.)
✅ points: number (>= 0)
✓  timeLimit?: number (default: 60 segundos)
✓  maxAttempts?: number (default: 1)
✓  text?: string (opcional)
✓  instructions?: string (opcional)
```

### Archivos de Media

| Tipo de Pregunta | Media | Tipo | Tamaño Max | Requerido |
|------------------|-------|------|------------|-----------|
| image_to_multiple_choices | Imagen[] | PNG/JPEG/WebP | 5MB c/u | ✅ |
| spelling | Imagen | PNG/JPEG/WebP/SVG/GIF | 5MB | ✅ |
| word_match | Audio/Video[] | MP3/WAV/OGG/MP4 | 10MB c/u | ✅ |
| gossip | Audio | MP3/WAV/OGG | 10MB | ✅ |
| topic_based_audio | Audio | MP3/WAV/OGG | 10MB | ✅ |
| lyrics_training | Audio/Video | MP3/WAV/MP4/WebM | 10MB | ✅ |
| sentence_maker | Imagen[] | PNG/JPEG/WebP | 5MB c/u | ✅ |
| tales | Imagen[] | PNG/JPEG/WebP | 5MB c/u | ✅ |
| superbrain | Imagen | PNG/JPEG/WebP | 5MB | ❌ Opcional |
| tell_me_about_it | Imagen | PNG/JPEG/WebP | 5MB | ❌ Opcional |
| **tag_it** | Imagen | PNG | 5MB | ❌ Opcional 🆕 |
| **report_it** | Imagen | PNG | 5MB | ❌ Opcional 🆕 |
| **word_associations** | Imagen | Cualquiera | 5MB | ❌ Opcional 🆕 |

---

## ⚡ Ejemplos de Uso Completos

### Ejemplo 1: Crear Tag It con imagen

```typescript
import { createQuestion } from '@/repositories/questions/createQuestion';

async function createTagItQuestion(
  challengeId: string,
  sentenceParts: string[],
  acceptableAnswers: string[],
  referenceImage?: File
) {
  if (referenceImage) {
    // Con imagen: usar FormData
    const formData = new FormData();
    formData.append('challengeId', challengeId);
    formData.append('stage', 'GRAMMAR');
    formData.append('phase', 'phase_2');
    formData.append('points', '10');
    formData.append('content', JSON.stringify(sentenceParts));
    formData.append('answer', JSON.stringify(acceptableAnswers));
    formData.append('media', referenceImage);

    return await createQuestion('tag_it', formData);
  } else {
    // Sin imagen: usar JSON
    const data = {
      challengeId,
      stage: 'GRAMMAR' as const,
      phase: 'phase_2',
      points: 10,
      content: sentenceParts,
      answer: acceptableAnswers
    };

    return await createQuestion('tag_it', data);
  }
}

// Uso
await createTagItQuestion(
  'challenge-uuid',
  ['He is responsible for the project,', '?'],
  ["isn't he?", 'is not he?'],
  optionalImageFile
);
```

---

### Ejemplo 2: Crear Wordbox

```typescript
async function createWordboxQuestion(
  challengeId: string,
  grid: string[][],
  width: number,
  height: number,
  maxWords: number = 5
) {
  const data = {
    challengeId,
    stage: 'VOCABULARY' as const,
    phase: 'phase_1',
    points: 15,
    gridWidth: width,
    gridHeight: height,
    maxWords: maxWords,
    content: grid
  };

  return await createQuestion('wordbox', data);
}

// Uso
await createWordboxQuestion(
  'challenge-uuid',
  [
    ['C', 'A', 'T'],
    ['R', 'O', 'D'],
    ['E', 'A', 'T']
  ],
  3, // width
  3, // height
  5  // maxWords
);
```

---

## 🚨 Errores Comunes

### 1. Enviar JSON cuando se necesita FormData

```typescript
❌ INCORRECTO:
const data = {
  media: imageFile,  // File object en JSON
  ...
};

✅ CORRECTO:
const formData = new FormData();
formData.append('media', imageFile);
```

### 2. Usar configuration en CreateWordboxDto

```typescript
❌ INCORRECTO:
const data = {
  content: grid,
  configuration: {
    gridWidth: 3,
    gridHeight: 3
  }
};

✅ CORRECTO:
const data = {
  gridWidth: 3,
  gridHeight: 3,
  maxWords: 5,
  content: grid
};
```

### 3. Enviar un solo archivo cuando se espera array

```typescript
❌ INCORRECTO:
formData.append('media', singleFile);  // Para image_to_multiple_choices

✅ CORRECTO:
[singleFile].forEach(file => {
  formData.append('media', file);
});
```

---

## 📖 Recursos Adicionales

- [Backend DTOs](../../backend/src/questions/dto/cretate/)
- [Question Types](../src/definitions/types/Question.ts)
- [Repository createQuestion](../src/repositories/questions/createQuestion.ts)

---

## 🔔 Notas Importantes

1. **Siempre usa FormData** cuando incluyas archivos (File objects)
2. **Serializa arrays/objetos a JSON** cuando uses FormData: `JSON.stringify()`
3. **Los campos opcionales** pueden omitirse completamente o enviarse como `undefined`
4. **Backend valida automáticamente** tipos MIME y tamaños de archivo
5. **CreateTopicBasedAudioDto** requiere que `subQuestions` sea un JSON string en FormData

---

**Última revisión**: 2025-01-20
