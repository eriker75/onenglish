# Challenge Data Integrity Guide

## The Problem: What Happens When You Delete a Challenge?

```typescript
Challenge "Math Olympiad 2024"
  ├── Question 1 (answered by 50 students)
  ├── Question 2 (answered by 45 students)
  └── Question 3 (answered by 48 students)

// If you delete the challenge with onDelete: Cascade:
// ❌ All 3 questions get deleted
// ❌ All 143 student answers get deleted
// ❌ All historical data is LOST FOREVER
```

## The Solution: Challenge Soft Delete + Restrict

We've implemented a **two-layer protection system**:

### 1. Challenge Soft Delete

Challenges can be soft-deleted or archived without losing data:

```typescript
Challenge {
  isActive: true,      // Can be toggled on/off
  deletedAt: null,     // Soft delete timestamp
  archivedAt: null,    // Archive old challenges separately
}
```

### 2. Database Constraints: Restrict

Changed from `Cascade` to `Restrict` to prevent accidental deletion:

```typescript
// OLD (DANGEROUS):
challenge  Challenge  @relation(fields: [challengeId], references: [id], onDelete: Cascade)
// ☠️ Deleting challenge would CASCADE delete all questions and answers

// NEW (SAFE):
challenge  Challenge  @relation(fields: [challengeId], references: [id], onDelete: Restrict)
// ✅ Cannot delete challenge if it has questions or answers
```

### 3. Challenge Snapshots

When students answer questions, we also save challenge context:

```typescript
StudentAnswer {
  questionSnapshot: { /* question data */ },
  challengeSnapshot: {  // NEW: Challenge context
    name: "Math Olympiad 2024",
    grade: "5th_grade",
    type: "regular",
    stage: "National",
    year: 2024
  }
}
```

## Challenge Lifecycle States

A challenge can be in one of these states:

| State | `isActive` | `deletedAt` | `archivedAt` | Description |
|-------|-----------|------------|-------------|-------------|
| **Active** | `true` | `null` | `null` | Normal operational state |
| **Inactive** | `false` | `null` | `null` | Temporarily disabled |
| **Archived** | `false` | `null` | `not null` | Old challenge, kept for history |
| **Deleted** | `false` | `not null` | - | Soft-deleted, can be restored |

## Usage Examples

### 1. Safe Delete a Challenge

```typescript
import { safeDeleteChallenge } from './helpers';

// Automatically determines if soft or hard delete is safe
const result = await safeDeleteChallenge(prisma, challengeId);

if (result.deletionType === 'soft') {
  console.log('Soft deleted:', result.message);
  // "Challenge soft-deleted to preserve data integrity:
  //  Has 10 questions, Has 143 student answers"
} else {
  console.log('Permanently deleted:', result.message);
  // "Challenge permanently deleted (no data was associated)"
}
```

### 2. Check Before Deleting

```typescript
import { canHardDeleteChallenge } from './helpers';

const safetyCheck = await canHardDeleteChallenge(prisma, challengeId);

if (!safetyCheck.canDelete) {
  console.log('Cannot delete:', safetyCheck.reasons);
  // ["Has 10 questions", "Has 143 student answers"]

  // Must soft delete instead
  await softDeleteChallenge(prisma, challengeId);
}
```

### 3. Archive Old Challenges

```typescript
import { archiveChallenge } from './helpers';

// Archive 2023 challenges to declutter the UI
const oldChallenges = await prisma.challenge.findMany({
  where: { year: 2023 }
});

for (const challenge of oldChallenges) {
  await archiveChallenge(prisma, challenge.id);
}
```

### 4. Query Only Active Challenges

```typescript
import { activeChallengesWhere } from './helpers';

const activeChallenges = await prisma.challenge.findMany({
  where: {
    ...activeChallengesWhere,  // Excludes deleted and archived
    grade: '5th_grade'
  }
});
```

### 5. View Archived Challenges

```typescript
import { archivedChallengesWhere } from './helpers';

const archivedChallenges = await prisma.challenge.findMany({
  where: archivedChallengesWhere  // Only archived, not deleted
});
```

## Migration Impact

### Before Migration

```sql
-- DANGEROUS: Cascade delete
ALTER TABLE "questions"
ADD CONSTRAINT "questions_challengeId_fkey"
FOREIGN KEY ("challengeId")
REFERENCES "challenges"("id")
ON DELETE CASCADE;  -- ☠️ Deletes everything
```

### After Migration

```sql
-- SAFE: Restrict delete
ALTER TABLE "questions"
ADD CONSTRAINT "questions_challengeId_fkey"
FOREIGN KEY ("challengeId")
REFERENCES "challenges"("id")
ON DELETE RESTRICT;  -- ✅ Prevents accidental deletion

-- If challenge has questions, this error occurs:
-- "Cannot delete challenge because it has related questions"
```

## Complete Deletion Flow

```typescript
async deleteChallenge(challengeId: string) {
  // Step 1: Check if safe to delete
  const hasAnswers = await challengeHasStudentAnswers(prisma, challengeId);

  if (hasAnswers) {
    // Step 2a: Soft delete (data preservation)
    return await softDeleteChallenge(prisma, challengeId);
  } else {
    // Step 2b: Can hard delete if no data exists
    const safetyCheck = await canHardDeleteChallenge(prisma, challengeId);

    if (safetyCheck.canDelete) {
      return await prisma.challenge.delete({ where: { id: challengeId } });
    } else {
      // Has questions but no answers - soft delete to be safe
      return await softDeleteChallenge(prisma, challengeId);
    }
  }
}
```

## Best Practices

### ✅ DO:

1. **Use `safeDeleteChallenge()`** - it handles everything automatically
2. **Archive old challenges** instead of deleting them
3. **Use `activeChallengesWhere`** in queries to exclude deleted/archived
4. **Create challenge snapshots** when students submit answers
5. **Restore deleted challenges** if needed with `restoreChallenge()`

### ❌ DON'T:

1. **Don't hard delete** challenges that have been answered
2. **Don't use `prisma.challenge.delete()`** directly without checks
3. **Don't change `onDelete: Restrict`** back to `Cascade`
4. **Don't forget** to include challenge in question queries for snapshots

## Complete Protection Chain

```
Student answers question
        ↓
┌───────────────────────────────────────┐
│ 1. Question Snapshot saved            │
│    (preserves question as it was)     │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ 2. Challenge Snapshot saved           │
│    (preserves challenge context)      │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ 3. Question: onDelete: SetNull        │
│    (answer preserved if Q deleted)    │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ 4. Challenge: onDelete: Restrict      │
│    (prevents cascade deletion)        │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ 5. Soft delete available              │
│    (can restore if needed)            │
└───────────────────────────────────────┘

Result: 🔒 100% DATA INTEGRITY
```

## Error Handling

### Trying to Delete Challenge with Answers

```typescript
try {
  await prisma.challenge.delete({ where: { id: challengeId } });
} catch (error) {
  if (error.code === 'P2003') {
    // Foreign key constraint error
    console.log('Cannot delete: challenge has related data');
    // Use soft delete instead
    await softDeleteChallenge(prisma, challengeId);
  }
}
```

### Proper Way

```typescript
// Let the helper handle it
const result = await safeDeleteChallenge(prisma, challengeId);
// Automatically soft deletes if needed, hard deletes if safe
```

## Summary

| Scenario | Action | Data Loss |
|----------|--------|-----------|
| Delete challenge with answers (OLD) | Cascade delete | ❌ Everything lost |
| Delete challenge with answers (NEW) | Soft delete | ✅ Everything preserved |
| Delete empty challenge | Hard delete | ✅ Safe, nothing to lose |
| Archive old challenge | Set archivedAt | ✅ Everything preserved |
| Restore deleted challenge | Clear deletedAt | ✅ Fully restored |

This system ensures **ZERO data loss** while maintaining database flexibility.
