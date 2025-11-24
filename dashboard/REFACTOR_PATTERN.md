# Patrón de Refactorización para Wrappers

Este documento explica cómo refactorizar todos los wrappers para usar React Query.

## Cambios Necesarios

### 1. Imports

**Antes:**
```typescript
import { useMutation } from "@tanstack/react-query";
import api from "@/src/config/axiosInstance";
import { useChallengeFormStore } from "@/src/stores/challenge-form.store";
```

**Después:**
```typescript
import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import { useCreateQuestion, useUpdateQuestion } from "@/src/hooks/useQuestionMutations";
```

### 2. Challenge ID

**Antes:**
```typescript
const challengeId = useChallengeFormStore((state) => state.challenge.id);
```

**Después:**
```typescript
const challengeId = useChallengeUIStore((state) => state.currentChallengeId);
```

### 3. Fetch Fresh Data (Opcional)

**Agregar:**
```typescript
const { data: freshQuestionData } = useQuestion(existingQuestion?.id);
const [type]Question = (freshQuestionData || existingQuestion) as [Type]Question | undefined;
```

### 4. Mutations

**Antes:**
```typescript
const createQuestionMutation = useMutation({
  mutationFn: async (data) => {
    const response = await api.post("/questions/create/[type]", data);
    return response.data;
  },
  onSuccess: () => { /* ... */ },
  onError: () => { /* ... */ },
});

const updateQuestionMutation = useMutation({
  mutationFn: async ({ id, data }) => {
    const response = await api.patch(`/questions/[type]/${id}`, data);
    return response.data;
  },
  onSuccess: () => { /* ... */ },
  onError: () => { /* ... */ },
});
```

**Después:**
```typescript
const createMutation = useCreateQuestion();
const updateMutation = useUpdateQuestion();

const isPending = createMutation.isPending || updateMutation.isPending;
```

### 5. HandleSave - Create

**Antes:**
```typescript
createQuestionMutation.mutate(payload);
```

**Después:**
```typescript
createMutation.mutate(
  {
    endpoint: "/questions/create/[type]",
    data: payload,
    challengeId,
  },
  {
    onSuccess: () => {
      toast({ title: "Success", description: "..." });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "..." });
    },
  }
);
```

### 6. HandleSave - Update

**Antes:**
```typescript
updateQuestionMutation.mutate({ id: existingQuestion.id, data: payload });
```

**Después:**
```typescript
updateMutation.mutate(
  {
    endpoint: "/questions/[type]",
    questionId: existingQuestion.id,
    data: payload,
    challengeId,
  },
  {
    onSuccess: () => {
      toast({ title: "Success", description: "..." });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "..." });
    },
  }
);
```

## Ejemplo Completo: WordBoxWrapper

Ver: `/components/question-blocks-wrappers/WordBoxWrapper.tsx`

## Lista de Wrappers a Refactorizar

- [x] WordBoxWrapper.tsx
- [ ] DebateWrapper.tsx
- [ ] FastTestWrapper.tsx
- [ ] GossipWrapper.tsx
- [ ] ImageToMultipleChoiceWrapper.tsx
- [ ] LyricsTrainingWrapper.tsx
- [ ] ReadItWrapper.tsx
- [ ] ReportItWrapper.tsx
- [ ] SentenceMakerWrapper.tsx
- [ ] SpellingWrapper.tsx
- [ ] SuperBrainWrapper.tsx
- [ ] TagItWrapper.tsx
- [ ] TalesWrapper.tsx
- [ ] TellMeAboutItWrapper.tsx
- [ ] TensesWrapper.tsx
- [ ] TopicBasedAudioWrapper.tsx
- [ ] UnscrambleWrapper.tsx
- [ ] WordAssociationsWrapper.tsx
- [ ] WordMatchWrapper.tsx

## Notas Importantes

1. **FormData vs JSON**: El patrón funciona igual para ambos. Los headers se manejan automáticamente en `useQuestionMutations.ts`.

2. **Cache Invalidation**: Es automática. Las mutations invalidan `challengeKeys.detail(challengeId)`.

3. **Loading States**: Usa `createMutation.isPending || updateMutation.isPending`.

4. **Error Handling**: Se maneja en los callbacks de `onSuccess`/`onError`.
