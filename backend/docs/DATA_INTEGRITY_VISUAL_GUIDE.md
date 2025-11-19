# 🎨 Guía Visual: Integridad de Datos

## 🔍 El Problema (Diagrama)

```
❌ ANTES: Sistema Vulnerable
═══════════════════════════════════════════════════════

Challenge "Math 2024"
    │
    ├── Question 1 "2+2=?"
    │       │
    │       └── StudentAnswer: "4" ✅
    │
    └── Question 2 "3+3=?"
            │
            └── StudentAnswer: "6" ✅

CASO 1: Profesor edita Question 1
────────────────────────────────────
Question 1 → "5+5=?" (answer: "10")

StudentAnswer sigue apuntando a Question 1
Pero ahora dice: userAnswer: "4" ❌
Parece INCORRECTO cuando era CORRECTO!

CASO 2: Profesor elimina Challenge
────────────────────────────────────
DELETE Challenge "Math 2024"
    ↓ CASCADE
    ├── DELETE Question 1
    │       ↓ CASCADE
    │       └── DELETE StudentAnswer (perdido!)
    │
    └── DELETE Question 2
            ↓ CASCADE
            └── DELETE StudentAnswer (perdido!)

❌ RESULTADO: PÉRDIDA TOTAL DE DATOS
```

## ✅ La Solución (Diagrama)

```
✅ DESPUÉS: Sistema Protegido con 3 Capas
═══════════════════════════════════════════════════════

Challenge "Math 2024"
    │
    ├── Question 1 "2+2=?"
    │       │
    │       └── StudentAnswer {
    │               questionId: "q1"
    │               questionSnapshot: {           ← 📸 CAPA 1
    │                   text: "2+2=?",
    │                   answer: "4"
    │               }
    │               challengeSnapshot: {          ← 📸 CAPA 1
    │                   name: "Math 2024"
    │               }
    │               userAnswer: "4"
    │           }
    │
    └── Question 2 "3+3=?"
            │
            └── StudentAnswer {
                    questionSnapshot: {           ← 📸 CAPA 1
                        text: "3+3=?",
                        answer: "6"
                    }
                }

CASO 1: Profesor edita Question 1
────────────────────────────────────
Question 1:
  text: "5+5=?" (nuevo)
  version: 2 (incrementado)            ← 🔄 CAPA 2
  isActive: true
  deletedAt: null

StudentAnswer:
  questionSnapshot.text: "2+2=?" (original preservado) ✅
  questionSnapshot.answer: "4" (original preservado) ✅
  questionVersion: 1 (versión respondida)
  userAnswer: "4"

✅ RESULTADO: Historial 100% preciso!

CASO 2: Profesor elimina Question 1
────────────────────────────────────
Opción A: Soft Delete
    Question 1:
      deletedAt: "2025-01-19"          ← 🗑️ CAPA 2
      isActive: false

    StudentAnswer:
      questionId: "q1" (aún conectado)
      questionSnapshot: {... intacto ...} ✅

Opción B: Hard Delete (si está permitido)
    DELETE Question 1
        ↓ SET NULL                     ← 🛡️ CAPA 3
        StudentAnswer:
          questionId: null (desconectado)
          questionSnapshot: {... intacto ...} ✅

✅ RESULTADO: Respuesta preservada!

CASO 3: Profesor elimina Challenge
────────────────────────────────────
Intento 1: Hard Delete
    DELETE Challenge "Math 2024"
        ↓ RESTRICT                     ← 🛡️ CAPA 3
        ❌ ERROR: "Foreign key constraint violated"
        "Cannot delete challenge because it has questions"

Intento 2: Safe Delete (recomendado)
    safeDeleteChallenge()
        ↓ Detecta que tiene datos
        ↓ Aplica Soft Delete           ← 🗑️ CAPA 2

    Challenge:
      deletedAt: "2025-01-19"
      isActive: false

    Questions: sin cambios ✅
    StudentAnswers: sin cambios ✅

✅ RESULTADO: TODO preservado, restaurable!
```

## 🔄 Flujo Completo: De Respuesta a Eliminación

```
┌─────────────────────────────────────────────────────┐
│ PASO 1: Estudiante Responde                        │
└─────────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ Fetch Question        │
        │ + Challenge           │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ Create Snapshots      │  📸 Capa 1: Snapshots
        │ - questionSnapshot    │
        │ - challengeSnapshot   │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ Save StudentAnswer    │
        │ WITH snapshots        │
        └───────────────────────┘
                    ↓
        ✅ Datos preservados para siempre

┌─────────────────────────────────────────────────────┐
│ PASO 2: Profesor Edita Pregunta                    │
└─────────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ hasStudentAnswers()?  │
        └───────────────────────┘
             ↓ Yes        ↓ No
    ┌──────────┐    ┌──────────┐
    │ Increment│    │ Update   │
    │ version  │    │ directly │  🔄 Capa 2: Versioning
    └──────────┘    └──────────┘
             ↓            ↓
        ┌───────────────────────┐
        │ Update Question       │
        │ (new content)         │
        └───────────────────────┘
                    ↓
        ✅ Versión antigua en snapshot intacta

┌─────────────────────────────────────────────────────┐
│ PASO 3: Profesor Elimina Pregunta                  │
└─────────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ softDeleteQuestion()  │  🗑️ Capa 2: Soft Delete
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ Set deletedAt         │
        │ Set isActive = false  │
        └───────────────────────┘
                    ↓
        ✅ Pregunta "eliminada" pero recuperable

┌─────────────────────────────────────────────────────┐
│ PASO 4: Profesor Elimina Challenge                 │
└─────────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ safeDeleteChallenge() │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ canHardDelete()?      │
        └───────────────────────┘
             ↓ No         ↓ Yes
    ┌──────────┐    ┌──────────┐
    │ Soft     │    │ Hard     │  🗑️ Capa 2: Soft Delete
    │ Delete   │    │ Delete   │  🛡️ Capa 3: Restrict
    └──────────┘    └──────────┘
             ↓            ↓
        ┌───────────────────────┐
        │ Challenge removed     │
        │ Data preserved ✅     │
        └───────────────────────┘
```

## 🛡️ Las 3 Capas de Protección (Visual)

```
╔═══════════════════════════════════════════════════════╗
║                  CAPA 1: SNAPSHOTS                    ║
║                   (Application)                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  📸 questionSnapshot: JSON                            ║
║     ├─ text: "original question"                     ║
║     ├─ type: "multiple_choice"                       ║
║     ├─ options: [...]                                ║
║     └─ answer: "correct answer"                      ║
║                                                       ║
║  📸 challengeSnapshot: JSON                           ║
║     ├─ name: "Math Olympiad 2024"                    ║
║     ├─ grade: "5th_grade"                            ║
║     └─ type: "regular"                               ║
║                                                       ║
║  ✅ PROTEGE: Historial preciso                        ║
║  ✅ CUÁNDO: Cada respuesta de estudiante             ║
║  ✅ TAMAÑO: ~1-2 KB por respuesta                    ║
╚═══════════════════════════════════════════════════════╝
                         ↓
╔═══════════════════════════════════════════════════════╗
║              CAPA 2: SOFT DELETE                      ║
║                  (ORM - Prisma)                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  Question:                                            ║
║  ├─ isActive: boolean                                ║
║  ├─ deletedAt: DateTime?                             ║
║  └─ version: int                                     ║
║                                                       ║
║  Challenge:                                           ║
║  ├─ isActive: boolean                                ║
║  ├─ deletedAt: DateTime?                             ║
║  └─ archivedAt: DateTime?                            ║
║                                                       ║
║  ✅ PROTEGE: Nada se pierde, todo es reversible      ║
║  ✅ CUÁNDO: Al "eliminar" o "editar"                 ║
║  ✅ COSTO: Solo 3 campos extra por tabla             ║
╚═══════════════════════════════════════════════════════╝
                         ↓
╔═══════════════════════════════════════════════════════╗
║           CAPA 3: FOREIGN KEY CONSTRAINTS             ║
║               (Database - PostgreSQL)                 ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  Challenge → Question:                                ║
║    ON DELETE RESTRICT  🛡️                            ║
║    "Cannot delete if has questions"                  ║
║                                                       ║
║  Challenge → StudentAnswer:                           ║
║    ON DELETE RESTRICT  🛡️                            ║
║    "Cannot delete if has answers"                    ║
║                                                       ║
║  Question → StudentAnswer:                            ║
║    ON DELETE SET NULL  🔗                            ║
║    "Preserve answer, disconnect question"            ║
║                                                       ║
║  ✅ PROTEGE: Previene eliminación accidental          ║
║  ✅ CUÁNDO: Siempre, a nivel de BD                   ║
║  ✅ FUERZA: Imposible bypassear                      ║
╚═══════════════════════════════════════════════════════╝
```

## 📊 Tabla de Estados

```
┌────────────┬──────────┬───────────┬────────────┬─────────────────┐
│ Estado     │ isActive │ deletedAt │ archivedAt │ Descripción     │
├────────────┼──────────┼───────────┼────────────┼─────────────────┤
│ 🟢 ACTIVO  │   true   │   null    │    null    │ Normal          │
├────────────┼──────────┼───────────┼────────────┼─────────────────┤
│ 🔴 INACTIVO│   false  │   null    │    null    │ Deshabilitado   │
├────────────┼──────────┼───────────┼────────────┼─────────────────┤
│ 📦 ARCHIVAD│   false  │   null    │  not null  │ Challenge viejo │
├────────────┼──────────┼───────────┼────────────┼─────────────────┤
│ 🗑️ ELIMINAD│   false  │ not null  │     -      │ Soft deleted    │
└────────────┴──────────┴───────────┴────────────┴─────────────────┘
```

## 🎯 Ejemplos de Uso Rápido

### ✅ Crear Snapshot al Responder

```typescript
const question = await prisma.question.findUnique({
  where: { id },
  include: { challenge: true }
});

await prisma.studentAnswer.create({
  data: {
    questionSnapshot: createQuestionSnapshot(question),     // 📸
    challengeSnapshot: createChallengeSnapshot(challenge),  // 📸
    // ... resto
  }
});
```

### ✅ Soft Delete Seguro

```typescript
// Questions
await softDeleteQuestion(prisma, questionId);  // 🗑️

// Challenges (automático)
await safeDeleteChallenge(prisma, challengeId);  // 🗑️ o 🔨
```

### ✅ Queries con Filtros

```typescript
// Solo activos
const challenges = await prisma.challenge.findMany({
  where: activeChallengesWhere  // deletedAt: null, archivedAt: null
});

// Solo archivados
const archived = await prisma.challenge.findMany({
  where: archivedChallengesWhere  // archivedAt: not null
});
```

## 📈 Comparación Visual

```
╔════════════════════════════════════════════════════════╗
║                    ANTES vs DESPUÉS                    ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  ANTES: ❌ Sistema Vulnerable                          ║
║  ┌─────────────────────────────────────┐              ║
║  │ Edit Question → Historial incorrecto│              ║
║  │ Delete Question → Answers huérfanos │              ║
║  │ Delete Challenge → CASCADE borra TODO│             ║
║  │ Stats → Imprecisas                  │              ║
║  │ Restore → Imposible                 │              ║
║  └─────────────────────────────────────┘              ║
║                                                        ║
║  DESPUÉS: ✅ Sistema Protegido                         ║
║  ┌─────────────────────────────────────┐              ║
║  │ Edit Question → Snapshot preserva   │              ║
║  │ Delete Question → Soft delete       │              ║
║  │ Delete Challenge → RESTRICT impide  │              ║
║  │ Stats → Basadas en snapshots ✅     │              ║
║  │ Restore → Posible ✅                │              ║
║  └─────────────────────────────────────┘              ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

## 🎓 Conclusión Visual

```
                    🎯 OBJETIVO
        ┌───────────────────────────────┐
        │ INTEGRIDAD DE DATOS 100%      │
        └───────────────────────────────┘
                        │
            ┌───────────┼───────────┐
            │           │           │
        SNAPSHOT    SOFT DELETE  RESTRICT
            📸          🗑️          🛡️
            │           │           │
        Preserva    Reversible  Impide
        Original    Siempre     Cascade
            │           │           │
            └───────────┴───────────┘
                        │
                        ↓
        ┌───────────────────────────────┐
        │ ✅ NUNCA PIERDES DATOS        │
        │ ✅ HISTORIAL 100% PRECISO     │
        │ ✅ ERRORES PREVENIDOS         │
        │ ✅ RESTAURACIÓN POSIBLE       │
        └───────────────────────────────┘
```

¡Solución completa, simple, elegante y robusta! 🚀
