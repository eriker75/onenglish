# 🔒 Sistema de Integridad de Datos - README

## 🎯 ¿Qué Hace Este Sistema?

Protege automáticamente tus datos cuando eliminas Challenges o Questions.

## 🧠 Smart Delete: Borrado Inteligente

```
                  ¿ELIMINAR?
                      ↓
            ¿Tiene respuestas?
              ↙          ↘
            SÍ            NO
             ↓             ↓
        SOFT DELETE    HARD DELETE
             ↓             ↓
     Marca como       Elimina TODO
     eliminado        + archivos
             ↓             ↓
     ✅ Preservado    ✅ Limpio
```

## 📦 Uso Rápido

### Eliminar Challenge

```typescript
import { safeDeleteChallenge } from './helpers';

const result = await safeDeleteChallenge(prisma, challengeId);

// CON respuestas → Soft delete (preserva datos)
// SIN respuestas → Hard delete (elimina todo + archivos)
```

### Eliminar Question

```typescript
import { safeDeleteQuestion } from './helpers';

const result = await safeDeleteQuestion(prisma, questionId);

// CON respuestas → Soft delete (preserva datos)
// SIN respuestas → Hard delete (elimina todo + archivos)
```

## 🎬 Ejemplos

### Caso 1: Challenge CON Respuestas

```typescript
// Challenge que estudiantes ya respondieron
await safeDeleteChallenge(prisma, 'challenge-123');

// Resultado:
{
  deletionType: 'soft',
  message: 'Challenge soft-deleted to preserve student answer history'
}

// ✅ Challenge marcado como deletedAt
// ✅ Questions preservadas
// ✅ Answers preservados con snapshots
// ✅ Archivos preservados
```

### Caso 2: Challenge SIN Respuestas

```typescript
// Challenge recién creado, nadie respondió
await safeDeleteChallenge(prisma, 'challenge-456', deleteFiles);

// Resultado:
{
  deletionType: 'hard',
  message: 'Challenge and all related data permanently deleted',
  deletedCount: {
    questions: 10,
    mediaFiles: 25
  }
}

// ✅ Challenge eliminado
// ✅ Questions eliminadas
// ✅ Media files de BD eliminados
// ✅ Archivos físicos eliminados
```

## 🔧 Con Borrado de Archivos

```typescript
// Función para borrar archivos del disco
async function deleteMediaFiles(mediaFileIds: string[]) {
  const files = await prisma.mediaFile.findMany({
    where: { id: { in: mediaFileIds } }
  });

  for (const file of files) {
    await fs.unlink(path.join('uploads', file.pathName));
  }
}

// Usar con smart delete
await safeDeleteChallenge(
  prisma,
  challengeId,
  deleteMediaFiles  // <-- Pasa la función
);
```

## 📊 Qué Se Elimina en Hard Delete

### Challenge Hard Delete:
1. ✅ Archivos media del almacenamiento (si se pasa función)
2. ✅ Questions
3. ✅ SubQuestions
4. ✅ QuestionMedia (relaciones)
5. ✅ QuestionConfigurations
6. ✅ MediaFiles de la BD
7. ✅ Challenge

### Question Hard Delete:
1. ✅ Archivos media del almacenamiento (si se pasa función)
2. ✅ SubQuestions
3. ✅ QuestionMedia (relaciones)
4. ✅ QuestionConfigurations
5. ✅ MediaFiles de la BD
6. ✅ Question

## 🛡️ Protecciones Adicionales

### 1. Snapshots (Automático)
```typescript
// Se crea automáticamente al responder
StudentAnswer {
  questionSnapshot: { /* pregunta original */ },
  challengeSnapshot: { /* challenge original */ }
}
```

### 2. Foreign Keys (Base de Datos)
```sql
-- Impide borrado en cascada accidental
ON DELETE RESTRICT
```

### 3. Versioning (Automático)
```typescript
// Se incrementa al editar pregunta con respuestas
question.version  // 1 → 2
```

## ✅ Checklist de Uso

```typescript
// ✅ RECOMENDADO: Usa esto siempre
await safeDeleteChallenge(prisma, id, deleteMediaFiles);
await safeDeleteQuestion(prisma, id, deleteMediaFiles);

// ⚠️ SOLO SI SABES LO QUE HACES
await softDeleteChallenge(prisma, id);  // Forzar soft
await hardDeleteChallenge(prisma, id);  // Forzar hard
```

## 📚 Más Información

- **Smart Delete**: Ver `SMART_DELETE_GUIDE.md`
- **Solución Completa**: Ver `FINAL_IMPLEMENTATION_SUMMARY.md`
- **Guía Visual**: Ver `DATA_INTEGRITY_VISUAL_GUIDE.md`

## 🚀 Aplicar al Proyecto

```bash
# 1. Migrar base de datos
npx prisma migrate dev --name add_complete_data_integrity

# 2. Regenerar cliente
npx prisma generate

# 3. ¡Listo para usar!
```

## 🎯 Resultado Final

```
ANTES:
❌ Borras challenge → Pierdes TODO
❌ Archivos huérfanos se acumulan
❌ Datos históricos perdidos

AHORA:
✅ Borras challenge CON respuestas → Soft delete (preserva)
✅ Borras challenge SIN respuestas → Hard delete (limpio)
✅ Todo automático, inteligente y seguro
```

---

**¡Simple, Inteligente, Seguro!** 🎉
