# AI Files Module - Testing Guide

## 🧪 Test Controller

El módulo incluye un controlador de pruebas (`AiFilesTestController`) con endpoints para probar todas las funcionalidades.

## 📍 Endpoints Disponibles

### 1. GET `/ai-files/test/providers`

**Descripción**: Lista los proveedores de AI disponibles

**Respuesta**:
```json
{
  "providers": ["google_genai"],
  "count": 1
}
```

**Uso con curl**:
```bash
curl http://localhost:3000/ai-files/test/providers
```

---

### 2. GET `/ai-files/test/capabilities`

**Descripción**: Verifica las capacidades del proveedor por tipo de archivo

**Respuesta**:
```json
{
  "provider": "google_genai",
  "capabilities": {
    "audio": true,
    "image": true,
    "video": true,
    "document": false
  }
}
```

**Uso con curl**:
```bash
curl http://localhost:3000/ai-files/test/capabilities
```

---

### 3. POST `/ai-files/test/validate-spelling`

**Descripción**: Valida el deletreo de una palabra desde un audio

**Body (multipart/form-data)**:
- `audio`: Archivo de audio (MP3, WAV, OGG, FLAC)
- `expectedWord`: Palabra esperada (opcional)
- `provider`: Proveedor a usar (opcional, default: google_genai)

**Respuesta**:
```json
{
  "success": true,
  "isCorrect": true,
  "speltWord": "beautiful",
  "transcription": "B-E-A-U-T-I-F-U-L",
  "analysis": "Correct spelling of the word 'beautiful'",
  "provider": "google_genai",
  "model": "gemini-2.0-flash-exp"
}
```

**Uso con curl**:
```bash
curl -X POST http://localhost:3000/ai-files/test/validate-spelling \
  -F "audio=@/path/to/spelling.mp3" \
  -F "expectedWord=beautiful"
```

**Uso con Swagger**: Ve a `http://localhost:3000/api` y busca el endpoint en la sección "AI Files - Testing"

---

### 4. POST `/ai-files/test/process-audio`

**Descripción**: Procesa audio con un prompt personalizado

**Body (multipart/form-data)**:
- `audio`: Archivo de audio
- `systemPrompt`: Instrucciones para la AI
- `userPrompt`: Prompt adicional (opcional)
- `provider`: Proveedor a usar (opcional)

**Ejemplo de systemPrompt**:
```
You are a pronunciation coach. 
The student should say: "Hello, how are you?"
Analyze their pronunciation and provide feedback.
```

**Respuesta**:
```json
{
  "success": true,
  "data": "The student's pronunciation is clear. Minor issues with 'how' vowel sound...",
  "provider": "google_genai",
  "model": "gemini-2.0-flash-exp"
}
```

**Uso con curl**:
```bash
curl -X POST http://localhost:3000/ai-files/test/process-audio \
  -F "audio=@/path/to/audio.mp3" \
  -F 'systemPrompt=You are a pronunciation coach. Analyze this audio.' \
  -F 'userPrompt=Provide detailed feedback'
```

---

### 5. POST `/ai-files/test/create-story`

**Descripción**: Crea una historia conectando múltiples imágenes

**Body (multipart/form-data)**:
- `images`: Archivos de imágenes (uno o más)
- `storyType`: Tipo de historia: "short" o "detailed" (opcional, default: short)
- `additionalInstructions`: Instrucciones adicionales (opcional)
- `provider`: Proveedor a usar (opcional)

**Respuesta**:
```json
{
  "success": true,
  "story": "Once upon a time, in a beautiful landscape, there was a small house...",
  "provider": "google_genai",
  "model": "gemini-2.0-flash-exp"
}
```

**Uso con curl**:
```bash
curl -X POST http://localhost:3000/ai-files/test/create-story \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "storyType=short" \
  -F "additionalInstructions=Use simple English suitable for A2 level students"
```

---

### 6. POST `/ai-files/test/process-images`

**Descripción**: Procesa imágenes con un prompt personalizado

**Body (multipart/form-data)**:
- `images`: Archivos de imágenes (uno o más)
- `systemPrompt`: Instrucciones para la AI
- `userPrompt`: Prompt adicional (opcional)
- `provider`: Proveedor a usar (opcional)

**Ejemplo de systemPrompt**:
```
You are an English vocabulary teacher.
List all objects visible in these images with their English names.
Group them by category (animals, furniture, nature, etc.).
```

**Respuesta**:
```json
{
  "success": true,
  "data": "Objects found:\nAnimals: dog, cat, bird\nFurniture: chair, table...",
  "provider": "google_genai",
  "model": "gemini-2.0-flash-exp"
}
```

**Uso con curl**:
```bash
curl -X POST http://localhost:3000/ai-files/test/process-images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F 'systemPrompt=You are an English teacher. Describe these images.' \
  -F 'userPrompt=Focus on vocabulary'
```

---

### 7. POST `/ai-files/test/analyze-images`

**Descripción**: Analiza imágenes con tipos predefinidos

**Body (multipart/form-data)**:
- `images`: Archivos de imágenes (uno o más)
- `analysisType`: Tipo de análisis: "describe", "compare", "find-connections"
- `provider`: Proveedor a usar (opcional)

**Respuesta**:
```json
{
  "success": true,
  "data": "Image 1 shows a landscape with mountains...",
  "provider": "google_genai",
  "model": "gemini-2.0-flash-exp"
}
```

**Uso con curl**:
```bash
curl -X POST http://localhost:3000/ai-files/test/analyze-images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "analysisType=compare"
```

---

## 🎯 Casos de Prueba Recomendados

### Test 1: Validación de Deletreo
1. Graba un audio diciendo: "B-E-A-U-T-I-F-U-L"
2. Guárdalo como `spelling_beautiful.mp3`
3. Sube el archivo al endpoint `/validate-spelling` con `expectedWord=beautiful`
4. Verifica que `isCorrect` sea `true`

### Test 2: Historia desde Imágenes
1. Prepara 2-3 imágenes relacionadas (ej: paisaje, casa, persona)
2. Súbelas al endpoint `/create-story` con `storyType=short`
3. Agrega `additionalInstructions=Use A2 level English`
4. Revisa la historia generada

### Test 3: Análisis de Pronunciación
1. Graba un audio diciendo una oración en inglés
2. Usa `/process-audio` con systemPrompt:
   ```
   You are a pronunciation coach.
   The student should say: "Hello, how are you?"
   Rate their pronunciation from 1-10 and provide specific feedback.
   ```
3. Revisa el feedback generado

### Test 4: Descripción de Vocabulario
1. Sube una imagen con varios objetos
2. Usa `/process-images` con systemPrompt:
   ```
   You are an English vocabulary teacher.
   List all visible objects with their English names.
   Provide example sentences using each word.
   ```
3. Obtén la lista de vocabulario

---

## 🔧 Testing con Postman

### Configurar Colección

1. Importa esta colección base:

```json
{
  "info": {
    "name": "AI Files Module Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Providers",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/ai-files/test/providers",
          "host": ["{{baseUrl}}"],
          "path": ["ai-files", "test", "providers"]
        }
      }
    },
    {
      "name": "Validate Spelling",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "audio",
              "type": "file",
              "src": "/path/to/audio.mp3"
            },
            {
              "key": "expectedWord",
              "value": "beautiful",
              "type": "text"
            }
          ]
        },
        "url": {
          "raw": "{{baseUrl}}/ai-files/test/validate-spelling",
          "host": ["{{baseUrl}}"],
          "path": ["ai-files", "test", "validate-spelling"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

## 🌐 Testing con Swagger UI

### Acceso
1. Inicia tu servidor: `npm run start:dev`
2. Abre: `http://localhost:3000/api`
3. Busca la sección **"AI Files - Testing"**
4. Expande cualquier endpoint
5. Click en "Try it out"
6. Sube archivos y completa parámetros
7. Click en "Execute"
8. Revisa la respuesta

### Ventajas de Swagger
- ✅ Interfaz visual intuitiva
- ✅ Prueba todos los endpoints sin código
- ✅ Ve la documentación de cada endpoint
- ✅ Copia ejemplos de respuesta
- ✅ Exporta como código curl

---

## 📊 Respuestas Esperadas

### Éxito
Todas las respuestas exitosas incluyen:
```json
{
  "success": true,
  "data": {...},  // Resultado específico
  "provider": "google_genai",
  "model": "gemini-2.0-flash-exp"
}
```

### Error
Las respuestas con error incluyen:
```json
{
  "success": false,
  "data": null,
  "provider": "google_genai",
  "model": "gemini-2.0-flash-exp",
  "error": "Descripción del error"
}
```

---

## 🐛 Troubleshooting

### "No adapter found for provider"
- ✅ Verifica que `GEMINI_API_KEY` esté en `.env`
- ✅ Reinicia el servidor
- ✅ Verifica con `/providers` que esté registrado

### "File format not supported"
- ✅ Verifica la extensión del archivo (mp3, wav, jpg, png)
- ✅ Asegúrate que el archivo no esté corrupto
- ✅ Verifica el tamaño (máx 10MB)

### "Invalid JSON response from AI"
- ✅ Revisa tu prompt, debe ser claro
- ✅ Para spelling validation, asegúrate de que el audio sea claro
- ✅ Intenta con otro archivo de audio/imagen

### Error 500
- ✅ Revisa los logs del servidor
- ✅ Verifica que la API key sea válida
- ✅ Asegúrate de tener conexión a internet

---

## 💡 Tips de Testing

1. **Archivos de Prueba**: Mantén un set de archivos de prueba estándar
2. **Logs**: Revisa los logs del servidor para debugging
3. **Prompts Claros**: Cuanto más específico el prompt, mejores resultados
4. **Tamaño de Archivos**: Usa archivos pequeños para pruebas rápidas
5. **Audio Claro**: Para spelling validation, graba en ambiente silencioso
6. **Imágenes Claras**: Usa imágenes con buena resolución y bien iluminadas

---

## 📝 Ejemplos de Casos de Uso Reales

### Caso 1: Sistema de Spelling Quiz
```bash
# 1. Estudiante graba deletreo
# 2. Sistema valida
curl -X POST http://localhost:3000/ai-files/test/validate-spelling \
  -F "audio=@student_spelling.mp3" \
  -F "expectedWord=necessary"

# 3. Sistema asigna puntos basado en isCorrect
```

### Caso 2: Ejercicio de Storytelling
```bash
# 1. Profesor sube imágenes temáticas
# 2. Sistema genera historia
curl -X POST http://localhost:3000/ai-files/test/create-story \
  -F "images=@beach.jpg" \
  -F "images=@family.jpg" \
  -F "storyType=short" \
  -F "additionalInstructions=Use past tense, A2 level"

# 3. Estudiante lee y contesta preguntas
```

### Caso 3: Feedback de Pronunciación
```bash
# 1. Estudiante graba lectura de párrafo
# 2. Sistema analiza
curl -X POST http://localhost:3000/ai-files/test/process-audio \
  -F "audio=@reading.mp3" \
  -F 'systemPrompt=Analyze pronunciation, rate 1-10, give specific feedback'

# 3. Estudiante recibe feedback personalizado
```

---

## 🎉 Conclusión

El controlador de pruebas proporciona una manera fácil y rápida de probar todas las funcionalidades del módulo AI Files. Úsalo para:
- ✅ Validar la integración
- ✅ Experimentar con diferentes prompts
- ✅ Probar casos de uso reales
- ✅ Desarrollar nuevas features

¡Disfruta probando el módulo! 🚀

