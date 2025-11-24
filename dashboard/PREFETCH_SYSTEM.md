# Sistema de Precarga de Datos con React Query

## 📋 Descripción General

Este sistema pre-carga automáticamente todas las preguntas de un challenge cuando se accede a la página, llenando el cache de React Query con múltiples query keys para acceso instantáneo.

## 🎯 Beneficios

1. **Carga inicial única**: Una sola llamada al backend obtiene todas las preguntas
2. **Acceso instantáneo**: Los componentes obtienen datos del cache sin esperar
3. **Optimización de red**: Reduce significativamente las llamadas al backend
4. **Mejor UX**: No hay spinners ni delays al editar preguntas

## 🔧 Arquitectura

### Flujo de Datos

```
1. Usuario navega a /dashboard/challenges/[id]
   ↓
2. useChallenge() se ejecuta automáticamente
   ↓
3. Backend fetch:
   - GET /challenges/{id} (datos básicos)
   - GET /questions/challenge/{id} (todas las preguntas agrupadas)
   ↓
4. Cache poblado con múltiples query keys:
   - ['challenge', id] → Challenge completo
   - ['challenge', id, 'questions'] → Array plano de preguntas
   - ['challenge', id, 'questions', 'stage', 'GRAMMAR'] → Preguntas de Grammar
   - ['challenge', id, 'questions', 'stage', 'GRAMMAR', 'type', 'unscramble'] → Preguntas tipo unscramble
   - ['question', questionId] → Cada pregunta individual
   ↓
5. Componentes acceden a datos precargados instantáneamente
```

## 📚 Hooks Disponibles

### 1. `useChallenge(challengeId)`
**Hook principal que ejecuta la precarga**

```typescript
const { data: challenge, isLoading } = useChallenge(challengeId);

// Retorna:
{
  id: string;
  title: string;
  grade: string;
  type: "regular" | "bilingual";
  questions: Question[]; // Array plano con TODAS las preguntas
}
```

**Efectos secundarios**:
- ✅ Pre-carga TODAS las preguntas individuales
- ✅ Cachea preguntas por stage
- ✅ Cachea preguntas por type
- ✅ Cachea array plano de todas las preguntas

### 2. `useQuestion(questionId)`
**Obtener una pregunta específica (usa cache si existe)**

```typescript
const { data: question } = useQuestion(questionId);

// Si la pregunta fue precargada por useChallenge(),
// este hook retorna instantáneamente sin fetch
```

### 3. `useQuestionsByStage(challengeId, stage)`
**Obtener todas las preguntas de un stage**

```typescript
const { data: grammarQuestions } = useQuestionsByStage(
  challengeId,
  'GRAMMAR'
);

// Retorna: Question[]
// Incluye TODOS los tipos de preguntas de ese stage
```

### 4. `useQuestionsByType(challengeId, stage, type)`
**Obtener preguntas de un tipo específico**

```typescript
const { data: unscrambleQuestions } = useQuestionsByType(
  challengeId,
  'GRAMMAR',
  'unscramble'
);

// Retorna: Question[]
// Solo preguntas de tipo 'unscramble' en stage 'GRAMMAR'
```

### 5. `useChallengeQuestions(challengeId)`
**Obtener todas las preguntas en array plano**

```typescript
const { data: allQuestions } = useChallengeQuestions(challengeId);

// Retorna: Question[]
// Array plano de TODAS las preguntas del challenge
```

## 🎨 Ejemplos de Uso

### Ejemplo 1: Página Principal del Challenge

```typescript
// app/dashboard/challenges/[challengeId]/page.tsx
export default function ChallengeEditPage() {
  const params = useParams();
  const challengeId = params.challengeId as string;

  // ✅ Esto pre-carga TODAS las preguntas automáticamente
  const { data: challenge, isLoading } = useChallenge(challengeId);

  if (isLoading) return <Loading />;

  // Agrupar por stage para la UI
  const questionsByStage = groupQuestionsByStage(challenge.questions);

  return (
    <div>
      <h1>{challenge.title}</h1>
      <QuestionTypeNavigation questions={questionsByStage} />
    </div>
  );
}
```

### Ejemplo 2: Componente Wrapper (Editar Pregunta)

```typescript
// components/question-blocks-wrappers/UnscrambleWrapper.tsx
export default function UnscrambleWrapper({
  existingQuestion
}: Props) {
  // ✅ Esta pregunta YA está en cache, retorna instantáneamente
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // Usa datos frescos del cache
  const unscrambleQuestion = (freshQuestionData || existingQuestion) as
    | UnscrambleQuestion
    | undefined;

  // ... resto del componente
}
```

### Ejemplo 3: Vista de Preguntas por Tipo

```typescript
// components/QuestionTypeList.tsx
export default function QuestionTypeList({
  challengeId,
  stage,
  type
}: Props) {
  // ✅ Datos precargados, no hace fetch adicional
  const { data: questions, isLoading } = useQuestionsByType(
    challengeId,
    stage,
    type
  );

  if (isLoading) return <Skeleton />; // Solo se muestra en primera carga

  return (
    <div>
      {questions?.map(q => (
        <div key={q.id}>{/* Render question using appropriate component based on type */}</div>
      ))}
    </div>
  );
}
```

### Ejemplo 4: Dashboard de Estadísticas

```typescript
// components/ChallengeStats.tsx
export default function ChallengeStats({ challengeId }: Props) {
  // ✅ Obtiene todas las preguntas del cache
  const { data: allQuestions } = useChallengeQuestions(challengeId);

  const stats = useMemo(() => ({
    total: allQuestions?.length || 0,
    byStage: countByStage(allQuestions),
    byType: countByType(allQuestions),
  }), [allQuestions]);

  return (
    <div>
      <StatCard label="Total Questions" value={stats.total} />
      <StageChart data={stats.byStage} />
    </div>
  );
}
```

## 🔑 Query Keys

Las siguientes query keys son pobladas automáticamente:

```typescript
// Challenge completo con todas las preguntas
['challenge', challengeId]

// Array plano de todas las preguntas
['challenge', challengeId, 'questions']

// Preguntas de un stage específico
['challenge', challengeId, 'questions', 'stage', 'GRAMMAR']
['challenge', challengeId, 'questions', 'stage', 'VOCABULARY']
['challenge', challengeId, 'questions', 'stage', 'LISTENING']
['challenge', challengeId, 'questions', 'stage', 'WRITING']
['challenge', challengeId, 'questions', 'stage', 'SPEAKING']

// Preguntas de un tipo específico
['challenge', challengeId, 'questions', 'stage', 'GRAMMAR', 'type', 'unscramble']
['challenge', challengeId, 'questions', 'stage', 'GRAMMAR', 'type', 'tenses']
// ... etc para cada combinación stage/type

// Cada pregunta individual
['question', 'question-id-1']
['question', 'question-id-2']
// ... etc para cada pregunta
```

## 🔄 Invalidación y Refetch

Cuando se modifica/crea/elimina una pregunta:

```typescript
// Mutation con invalidación automática
const updateMutation = useUpdateQuestion();

updateMutation.mutate(data, {
  onSuccess: () => {
    // ✅ Invalida y refetch todas las queries del challenge
    queryClient.invalidateQueries({
      queryKey: challengeKeys.all
    });

    // ✅ O invalida solo el challenge específico
    queryClient.invalidateQueries({
      queryKey: challengeKeys.detail(challengeId)
    });
  }
});
```

## 📊 Performance

### Antes (sin precarga)
```
- Carga página: 1 request (/challenges/{id})
- Abre wrapper 1: +1 request (/questions/{id})
- Abre wrapper 2: +1 request (/questions/{id})
- Abre wrapper 3: +1 request (/questions/{id})
Total: ~4 requests para ver 3 preguntas
```

### Después (con precarga)
```
- Carga página: 2 requests (/challenges/{id} + /questions/challenge/{id})
- Abre wrapper 1: 0 requests (cache hit)
- Abre wrapper 2: 0 requests (cache hit)
- Abre wrapper 3: 0 requests (cache hit)
Total: 2 requests para ver todas las preguntas
```

**Reducción**: ~50-80% menos requests dependiendo del uso

## 🚀 Próximos Pasos

1. ✅ Sistema de precarga implementado
2. ✅ Hooks auxiliares creados
3. ✅ Cache multi-nivel configurado
4. 🔄 Actualizar componentes para usar hooks
5. 🔄 Implementar optimistic updates
6. 🔄 Agregar error boundaries

## 📝 Notas Técnicas

- **staleTime**: 5 minutos para datos del challenge
- **cacheTime**: Por defecto (5 minutos después de no usarse)
- **refetchOnWindowFocus**: Habilitado por defecto
- **retry**: 3 intentos con backoff exponencial
- **Prefetch**: Automático al cargar la página del challenge

## 🐛 Debugging

Para verificar el cache en desarrollo:

```typescript
import { useQueryClient } from '@tanstack/react-query';

function DebugCache() {
  const queryClient = useQueryClient();

  console.log('All cached queries:',
    queryClient.getQueryCache().getAll()
  );

  // Ver una query específica
  const challengeData = queryClient.getQueryData(
    challengeKeys.detail(challengeId)
  );
  console.log('Challenge data:', challengeData);

  return null;
}
```

## ✨ Resultado

Con este sistema, la aplicación:
- ✅ Carga más rápido
- ✅ Hace menos requests al backend
- ✅ Provee mejor UX sin delays
- ✅ Mantiene datos siempre sincronizados
- ✅ Es más fácil de mantener y escalar
