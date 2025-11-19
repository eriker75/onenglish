# Question Data Integrity Guide

## The Problem

When students answer questions, we need to maintain historical integrity:
1. **Question Edits**: If a teacher edits a question after students have answered it, the historical records become inaccurate
2. **Question Deletion**: If a question is deleted, student answers become orphaned
3. **Statistics**: Analytics and reports need to reflect the question as it was when answered

## The Solution: Question Snapshots + Soft Delete

We implement a **hybrid approach** that balances data integrity with simplicity:

### 1. Question Snapshots

Every time a student answers a question, we save a **lightweight snapshot** of the question:

```typescript
// StudentAnswer table includes:
{
  questionId: "uuid",  // Reference to current question (can be null if deleted)
  questionSnapshot: {   // Frozen copy of question data at answer time
    text: "What is the capital of France?",
    type: "multiple_choice",
    instructions: "Select the correct answer",
    points: 10,
    timeLimit: 60,
    maxAttempts: 3,
    stage: "VOCABULARY",
    phase: "phase_1",
    options: ["Paris", "London", "Berlin"],
    answer: "Paris",
    content: { ... }
  },
  questionVersion: 1  // Version of question when answered
}
```

**Benefits:**
- ✅ Historical accuracy: We know exactly what question the student saw
- ✅ Audit trail: Can reconstruct past exams perfectly
- ✅ Analytics: Statistics remain accurate even after question changes
- ✅ Lightweight: Only essential data, not full question with media relations

### 2. Soft Delete

Questions are never permanently deleted from the database:

```typescript
// Question table includes:
{
  isActive: true,      // Can be toggled on/off
  deletedAt: null,     // Timestamp of soft delete
  version: 1           // Incremented on major changes
}
```

**Benefits:**
- ✅ Student answers never orphaned
- ✅ Can restore accidentally deleted questions
- ✅ Maintain referential integrity
- ✅ Simple implementation

## Usage Examples

### When Creating a Student Answer

```typescript
import { createQuestionSnapshot } from './helpers';

// In your answer service
async submitAnswer(studentId: string, questionId: string, userAnswer: any) {
  const question = await this.prisma.question.findUnique({
    where: { id: questionId }
  });

  // Create snapshot
  const snapshot = createQuestionSnapshot(question);

  // Save answer with snapshot
  return this.prisma.studentAnswer.create({
    data: {
      studentId,
      questionId,
      questionSnapshot: snapshot,
      questionVersion: question.version,
      userAnswer,
      isCorrect: /* validation logic */,
      // ... other fields
    }
  });
}
```

### When Deleting a Question

```typescript
import { softDeleteQuestion, hasStudentAnswers } from './helpers';

async deleteQuestion(questionId: string) {
  const hasAnswers = await hasStudentAnswers(this.prisma, questionId);

  if (hasAnswers) {
    // Soft delete to preserve integrity
    return softDeleteQuestion(this.prisma, questionId);
  } else {
    // Can safely hard delete if no one has answered
    return this.prisma.question.delete({ where: { id: questionId } });
  }
}
```

### When Editing a Question

```typescript
import { incrementQuestionVersion, hasStudentAnswers } from './helpers';

async updateQuestion(questionId: string, updates: UpdateQuestionDto) {
  const hasAnswers = await hasStudentAnswers(this.prisma, questionId);

  // Increment version if question was already answered
  if (hasAnswers) {
    await incrementQuestionVersion(this.prisma, questionId);
  }

  return this.prisma.question.update({
    where: { id: questionId },
    data: updates
  });
}
```

### When Querying Questions (exclude deleted)

```typescript
import { activeQuestionsWhere } from './helpers';

async findActiveQuestions(challengeId: string) {
  return this.prisma.question.findMany({
    where: {
      challengeId,
      ...activeQuestionsWhere  // Automatically excludes deleted questions
    }
  });
}
```

### When Displaying Historical Answers

```typescript
import { reconstructQuestionFromSnapshot } from './helpers';

async getStudentAnswerHistory(studentId: string, questionId: string) {
  const answers = await this.prisma.studentAnswer.findMany({
    where: { studentId, questionId },
    include: { question: true }
  });

  return answers.map(answer => ({
    id: answer.id,
    userAnswer: answer.userAnswer,
    isCorrect: answer.isCorrect,
    answeredAt: answer.answeredAt,
    // Show the question as it was when answered
    question: reconstructQuestionFromSnapshot(answer.questionSnapshot),
    // Also include current question state if different
    currentQuestion: answer.question,
    wasQuestionModified: answer.question?.version !== answer.questionVersion
  }));
}
```

## Migration Strategy

To implement this solution on existing data:

1. **Add new fields to schema** (already done)
2. **Run migration**: `npx prisma migrate dev --name add_question_snapshots`
3. **Backfill existing answers** (optional):
   ```typescript
   // For existing answers without snapshots
   async backfillSnapshots() {
     const answers = await this.prisma.studentAnswer.findMany({
       where: { questionSnapshot: null },
       include: { question: true }
     });

     for (const answer of answers) {
       if (answer.question) {
         const snapshot = createQuestionSnapshot(answer.question);
         await this.prisma.studentAnswer.update({
           where: { id: answer.id },
           data: {
             questionSnapshot: snapshot,
             questionVersion: answer.question.version || 1
           }
         });
       }
     }
   }
   ```

## Best Practices

1. **Always create snapshots** when students submit answers
2. **Use soft delete** for questions that have been answered
3. **Increment version** when making significant changes to answered questions
4. **Use `activeQuestionsWhere`** in queries to exclude deleted questions
5. **Keep snapshots lightweight** - only essential question data, no media URLs
6. **Validate snapshots** using `isValidQuestionSnapshot()` when reading historical data

## Performance Considerations

- **Snapshot size**: ~1-2 KB per answer (minimal impact)
- **Query performance**: Indexes on `isActive` and `deletedAt` ensure fast filtering
- **Storage**: Negligible compared to media files
- **Alternative**: If storage becomes a concern, consider compression or storing only changed fields

## Trade-offs

| Approach | Pros | Cons | Our Choice |
|----------|------|------|------------|
| Full copy | Complete history | Huge storage, complex | ❌ |
| Versioning table | Clean separation | Overcomplicated | ❌ |
| **Snapshot + Soft delete** | **Simple, effective, lightweight** | **Small redundancy** | ✅ **WINNER** |
| No solution | Simple codebase | Data integrity issues | ❌ |

## Summary

This solution provides:
- 🎯 **Data Integrity**: Student answers always reference the exact question they saw
- 🔒 **Safety**: Questions can't be permanently lost
- 📊 **Accurate Analytics**: Statistics remain valid over time
- 🚀 **Simple Implementation**: Minimal code changes, easy to understand
- ⚡ **Good Performance**: Lightweight snapshots, efficient queries
