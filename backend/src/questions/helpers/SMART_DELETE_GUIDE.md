# 🧠 Guía de Borrado Inteligente (Smart Delete)

## 🎯 Concepto: Borrado Inteligente Automático

El sistema ahora implementa **borrado inteligente** que automáticamente decide:

- ✅ **CON respuestas** → **SOFT DELETE** (preserva datos históricos)
- ✅ **SIN respuestas** → **HARD DELETE** (elimina completamente todo + archivos)

## 📊 Tabla de Decisión

| Escenario | Tiene Respuestas | Acción | Resultado |
|-----------|------------------|--------|-----------|
| **Eliminar Challenge CON answers** | ✅ Sí | Soft Delete | Challenge marcado `deletedAt`, data preservada |
| **Eliminar Challenge SIN answers** | ❌ No | Hard Delete | Challenge + Questions + Media eliminados |
| **Eliminar Question CON answers** | ✅ Sí | Soft Delete | Question marcada `deletedAt`, data preservada |
| **Eliminar Question SIN answers** | ❌ No | Hard Delete | Question + SubQuestions + Media eliminados |

## 🔧 Uso Básico

### Challenge: Safe Delete

```typescript
import { safeDeleteChallenge } from './helpers';

// Opción 1: Solo borrado de BD
const result = await safeDeleteChallenge(prisma, challengeId);

if (result.deletionType === 'soft') {
  console.log('Soft deleted:', result.message);
  // "Challenge soft-deleted to preserve student answer history"
} else {
  console.log('Hard deleted:', result.message);
  // "Challenge and all related data permanently deleted (no student answers existed)"
  console.log('Deleted:', result.deletedCount);
  // { questions: 10, mediaFiles: 25 }
}
```

### Question: Safe Delete

```typescript
import { safeDeleteQuestion } from './helpers';

// Opción 1: Solo borrado de BD
const result = await safeDeleteQuestion(prisma, questionId);

if (result.deletionType === 'soft') {
  console.log('Soft deleted:', result.message);
} else {
  console.log('Hard deleted:', result.message);
  console.log('Deleted:', result.deletedCount);
  // { subQuestions: 5, mediaFiles: 8 }
}
```

## 🗂️ Uso Avanzado: Con Borrado de Archivos

### Implementar Función de Borrado de Archivos

Primero, crea una función para borrar archivos del almacenamiento:

```typescript
// En tu servicio de media
import * as fs from 'fs/promises';
import * as path from 'path';

async function deleteMediaFilesFromStorage(
  mediaFileIds: string[]
): Promise<void> {
  // 1. Obtener rutas de archivos de la BD
  const mediaFiles = await prisma.mediaFile.findMany({
    where: {
      id: { in: mediaFileIds },
    },
    select: {
      pathName: true,
      url: true,
    },
  });

  // 2. Eliminar archivos físicos
  for (const file of mediaFiles) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', file.pathName);
      await fs.unlink(filePath);
      console.log(`✅ Deleted file: ${file.pathName}`);
    } catch (error) {
      console.error(`❌ Error deleting file ${file.pathName}:`, error);
      // Continuar con otros archivos aunque uno falle
    }
  }

  console.log(`🗑️ Deleted ${mediaFiles.length} media files from storage`);
}
```

### Usar con Challenge

```typescript
import { safeDeleteChallenge } from './helpers';

// Opción 2: Con borrado de archivos
const result = await safeDeleteChallenge(
  prisma,
  challengeId,
  deleteMediaFilesFromStorage  // <-- Pasa la función
);

if (result.deletionType === 'hard') {
  console.log('✅ Challenge deleted');
  console.log('📁 Questions deleted:', result.deletedCount.questions);
  console.log('🗂️ Media files deleted:', result.deletedCount.mediaFiles);
}
```

### Usar con Question

```typescript
import { safeDeleteQuestion } from './helpers';

// Opción 2: Con borrado de archivos
const result = await safeDeleteQuestion(
  prisma,
  questionId,
  deleteMediaFilesFromStorage  // <-- Pasa la función
);

if (result.deletionType === 'hard') {
  console.log('✅ Question deleted');
  console.log('📁 SubQuestions deleted:', result.deletedCount.subQuestions);
  console.log('🗂️ Media files deleted:', result.deletedCount.mediaFiles);
}
```

## 🔄 Flujo Completo de Hard Delete

### Para Challenges:

```
safeDeleteChallenge(challengeId)
    ↓
[1] Verificar si tiene student answers
    ↓ NO (sin respuestas)
[2] Obtener todas las questions + media
    ↓
[3] Recolectar IDs de archivos media
    ↓
[4] Llamar deleteMediaFiles() si se proporcionó
    ↓ (Borra archivos físicos del disco)
[5] DELETE questions (cascade borra questionMedia)
    ↓
[6] DELETE mediaFiles de la BD
    ↓
[7] DELETE challenge
    ↓
✅ Todo eliminado limpiamente
```

### Para Questions:

```
safeDeleteQuestion(questionId)
    ↓
[1] Verificar si tiene student answers
    ↓ NO (sin respuestas)
[2] Obtener question + subquestions + media
    ↓
[3] Recolectar IDs de archivos media (parent + subs)
    ↓
[4] Llamar deleteMediaFiles() si se proporcionó
    ↓ (Borra archivos físicos del disco)
[5] DELETE subquestions (cascade borra sus medias)
    ↓
[6] DELETE question principal
    ↓
[7] DELETE mediaFiles de la BD
    ↓
✅ Todo eliminado limpiamente
```

## 💡 Ejemplo en un Controller

```typescript
@Delete('challenges/:id')
async deleteChallenge(@Param('id') id: string) {
  const result = await safeDeleteChallenge(
    this.prisma,
    id,
    // Función de borrado de archivos
    async (mediaFileIds) => {
      const files = await this.prisma.mediaFile.findMany({
        where: { id: { in: mediaFileIds } },
      });

      for (const file of files) {
        await this.mediaService.deleteFile(file.pathName);
      }
    }
  );

  return {
    success: true,
    deletionType: result.deletionType,
    message: result.message,
    ...(result.deletedCount && { deletedCount: result.deletedCount }),
  };
}
```

## 🎯 Ventajas de este Enfoque

### ✅ Ventajas

1. **Automático**: No necesitas pensar, la función decide por ti
2. **Seguro**: Nunca pierdes datos históricos accidentalmente
3. **Limpio**: Elimina archivos huérfanos cuando es seguro
4. **Flexible**: Funciona con o sin borrado de archivos
5. **Informativo**: Te dice exactamente qué se eliminó

### 🔍 Comparación

| Enfoque | Código | Seguridad | Limpieza |
|---------|--------|-----------|----------|
| **DELETE directo** | Corto | ❌ Peligroso | ❌ Deja archivos |
| **Solo Soft Delete** | Medio | ✅ Seguro | ❌ Acumula basura |
| **Smart Delete** | Simple | ✅ Seguro | ✅ Limpio |

## 🚨 Casos Especiales

### Cuando DEBES usar Soft Delete manual

```typescript
// Si quieres FORZAR soft delete aunque no tenga respuestas
await softDeleteChallenge(prisma, challengeId);
```

### Cuando puedes usar Hard Delete manual

```typescript
// Si estás 100% seguro que no tiene nada relacionado
const check = await canHardDeleteChallenge(prisma, challengeId);
if (check.canDelete) {
  await prisma.challenge.delete({ where: { id: challengeId } });
}
```

## 📝 Resumen

```typescript
// ✅ RECOMENDADO: Usa esto siempre
await safeDeleteChallenge(prisma, id, deleteMediaFiles);
await safeDeleteQuestion(prisma, id, deleteMediaFiles);

// ⚠️ SOLO SI SABES LO QUE HACES
await softDeleteChallenge(prisma, id);  // Forzar soft delete
await prisma.challenge.delete({ where: { id } });  // Forzar hard delete
```

## 🎓 Conclusión

El **Smart Delete** es la forma más inteligente de manejar eliminaciones:

- 🧠 **Inteligente**: Decide automáticamente
- 🔒 **Seguro**: Protege datos históricos
- 🧹 **Limpio**: Elimina archivos cuando es seguro
- 📊 **Informativo**: Te dice qué pasó

¡Úsalo siempre que necesites eliminar Challenges o Questions!
