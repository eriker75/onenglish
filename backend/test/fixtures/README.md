# Test Fixtures

Este directorio contiene archivos de prueba para los tests E2E del módulo de Questions.

## Archivos Requeridos

Por favor, coloca los siguientes archivos en este directorio:

### 1. test-image.png
- **Tipo**: Imagen PNG, JPEG, o WEBP
- **Tamaño**: Máximo 5MB (recomendado < 1MB para tests rápidos)
- **Descripción**: Imagen de prueba para questions que requieren archivos de imagen
- **Uso**: image_to_multiple_choices, spelling, sentence_maker, tales

### 2. test-audio.mp3
- **Tipo**: Audio MP3, WAV, o OGG
- **Tamaño**: Máximo 10MB (recomendado < 2MB para tests rápidos)
- **Descripción**: Audio de prueba para questions tipo listening
- **Uso**: word_match, gossip, topic_based_audio

### 3. test-video.mp4
- **Tipo**: Video MP4
- **Tamaño**: Máximo 20MB (recomendado < 5MB para tests rápidos)
- **Descripción**: Video de prueba para questions con contenido multimedia
- **Uso**: lyrics_training

## Alternativa

Si no tienes archivos de prueba, puedes:

1. Descargar archivos de muestra de servicios como:
   - https://picsum.photos/ (imágenes)
   - https://www.soundjay.com/ (audios)
   - https://sample-videos.com/ (videos)

2. O usar archivos mínimos generados programáticamente (ver test-helpers.ts)

## Verificación

Los tests verificarán automáticamente la existencia de estos archivos. Si no existen, se usarán buffers mínimos generados en código (menos realista pero funcional).

