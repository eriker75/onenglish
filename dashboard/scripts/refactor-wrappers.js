const fs = require('fs');
const path = require('path');

// Wrapper configurations - endpoint mappings
const wrapperConfigs = {
  'DebateWrapper.tsx': { endpoint: 'debate', type: 'debate' },
  'FastTestWrapper.tsx': { endpoint: 'fast_test', type: 'fast_test' },
  'GossipWrapper.tsx': { endpoint: 'gossip', type: 'gossip' },
  'ImageToMultipleChoiceWrapper.tsx': { endpoint: 'image_to_multiple_choices', type: 'image_to_multiple_choices' },
  'LyricsTrainingWrapper.tsx': { endpoint: 'lyrics_training', type: 'lyrics_training' },
  'ReadItWrapper.tsx': { endpoint: 'read_it', type: 'read_it' },
  'ReportItWrapper.tsx': { endpoint: 'report_it', type: 'report_it' },
  'SentenceMakerWrapper.tsx': { endpoint: 'sentence_maker', type: 'sentence_maker' },
  'SpellingWrapper.tsx': { endpoint: 'spelling', type: 'spelling' },
  'SuperBrainWrapper.tsx': { endpoint: 'superbrain', type: 'superbrain' },
  'TagItWrapper.tsx': { endpoint: 'tag_it', type: 'tag_it' },
  'TalesWrapper.tsx': { endpoint: 'tales', type: 'tales' },
  'TellMeAboutItWrapper.tsx': { endpoint: 'tell_me_about_it', type: 'tell_me_about_it' },
  'TensesWrapper.tsx': { endpoint: 'tenses', type: 'tenses' },
  'TopicBasedAudioWrapper.tsx': { endpoint: 'topic_based_audio', type: 'topic_based_audio' },
  'UnscrambleWrapper.tsx': { endpoint: 'unscramble', type: 'unscramble' },
  'WordAssociationsWrapper.tsx': { endpoint: 'word_associations', type: 'word_associations' },
  'WordMatchWrapper.tsx': { endpoint: 'word_match', type: 'word_match' },
};

const wrappersDir = path.join(__dirname, '..', 'app', 'dashboard', 'challenges', '[challengeId]', 'components', 'question-blocks-wrappers');

function refactorWrapper(filename, config) {
  const filePath = path.join(wrappersDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${filename} - file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Step 1: Update imports
  content = content.replace(
    /import { useMutation } from "@tanstack\/react-query";[\s\S]*?import api from "@\/src\/config\/axiosInstance";/,
    ''
  );

  content = content.replace(
    /import { useChallengeFormStore } from "@\/src\/stores\/challenge-form\.store";/,
    `import { useChallengeUIStore } from "@/src/stores/challenge-ui.store";
import { useQuestion } from "@/src/hooks/useChallenge";
import { useCreateQuestion, useUpdateQuestion } from "@/src/hooks/useQuestionMutations";`
  );

  // Step 2: Update challengeId
  content = content.replace(
    /const challengeId = useChallengeFormStore\(\(state\) => state\.challenge\.id\);/,
    `const challengeId = useChallengeUIStore((state) => state.currentChallengeId);`
  );

  // Step 3: Add useQuestion hook after challengeId
  const questionTypeMatch = filename.match(/(\w+)Wrapper\.tsx/);
  const questionType = questionTypeMatch ? questionTypeMatch[1] : 'Question';
  const questionVar = questionType.charAt(0).toLowerCase() + questionType.slice(1) + 'Question';

  content = content.replace(
    /(const challengeId = useChallengeUIStore\(\(state\) => state\.currentChallengeId\);)/,
    `$1

  // Fetch fresh data when editing
  const { data: freshQuestionData } = useQuestion(existingQuestion?.id);
  `
  );

  // Step 4: Update question variable assignment
  content = content.replace(
    new RegExp(`const ${questionVar} = existingQuestion as \\w+Question \\| undefined;`),
    `const ${questionVar} = (freshQuestionData || existingQuestion) as ${questionType}Question | undefined;`
  );

  // Step 5: Replace mutations
  const createMutationRegex = /const createQuestionMutation = useMutation\({[\s\S]*?}\);/;
  const updateMutationRegex = /const updateQuestionMutation = useMutation\({[\s\S]*?}\);/;

  content = content.replace(createMutationRegex, '');
  content = content.replace(updateMutationRegex, '');

  // Add new mutations before isPending
  content = content.replace(
    /const isPending =/,
    `const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  const isPending =`
  );

  // Step 6: Update isPending calculation
  content = content.replace(
    /const isPending =[\s\S]*?createQuestionMutation\.isPending \|\| updateQuestionMutation\.isPending;/,
    `const isPending = createMutation.isPending || updateMutation.isPending;`
  );

  // Step 7: Update create mutation call
  content = content.replace(
    /createQuestionMutation\.mutate\(([\w]+)\);/,
    `createMutation.mutate(
        {
          endpoint: "/questions/create/${config.endpoint}",
          data: $1,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "${questionType} question created successfully",
              variant: "default",
            });
            if (onSuccess) onSuccess();
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error.response?.data?.message || "Failed to create question",
              variant: "destructive",
            });
          },
        }
      );`
  );

  // Step 8: Update update mutation call
  content = content.replace(
    /updateQuestionMutation\.mutate\({ id: existingQuestion\.id, data: ([\w]+) }\);/,
    `updateMutation.mutate(
        {
          endpoint: "/questions/${config.endpoint}",
          questionId: existingQuestion.id,
          data: $1,
          challengeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "${questionType} question updated successfully",
              variant: "default",
            });
            if (onSuccess) onSuccess();
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error.response?.data?.message || "Failed to update question",
              variant: "destructive",
            });
          },
        }
      );`
  );

  // Write the refactored content
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Refactored ${filename}`);
}

// Main execution
console.log('🚀 Starting wrapper refactoring...\n');

Object.entries(wrapperConfigs).forEach(([filename, config]) => {
  try {
    refactorWrapper(filename, config);
  } catch (error) {
    console.error(`❌ Error refactoring ${filename}:`, error.message);
  }
});

console.log('\n✨ Refactoring complete!');
