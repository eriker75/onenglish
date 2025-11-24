const fs = require('fs');
const path = require('path');

const wrappersDir = path.join(__dirname, '../dashboard/app/dashboard/challenges/[challengeId]/components/question-blocks-wrappers');

const files = [
  'SpellingWrapper.tsx',
  'SentenceMakerWrapper.tsx',
  'ReadItWrapper.tsx',
  'SuperBrainWrapper.tsx',
  'TagItWrapper.tsx',
  'TalesWrapper.tsx',
  'TellMeAboutItWrapper.tsx',
  'ReportItWrapper.tsx',
  'WordAssociationsWrapper.tsx',
  'WordMatchWrapper.tsx',
  'TopicBasedAudioWrapper.tsx',
  'UnscrambleWrapper.tsx',
  'LyricsTrainingWrapper.tsx',
  'ImageToMultipleChoiceWrapper.tsx'
];

// Map of wrapper file names to their update endpoints
const endpointMap = {
  'SpellingWrapper.tsx': '/questions/spelling',
  'SentenceMakerWrapper.tsx': '/questions/sentence_maker',
  'ReadItWrapper.tsx': '/questions/read_it',
  'SuperBrainWrapper.tsx': '/questions/super_brain',
  'TagItWrapper.tsx': '/questions/tag_it',
  'TalesWrapper.tsx': '/questions/tales',
  'TellMeAboutItWrapper.tsx': '/questions/tell_me_about_it',
  'ReportItWrapper.tsx': '/questions/report_it',
  'WordAssociationsWrapper.tsx': '/questions/word_associations',
  'WordMatchWrapper.tsx': '/questions/word_match',
  'TopicBasedAudioWrapper.tsx': '/questions/topic_based_audio',
  'UnscrambleWrapper.tsx': '/questions/unscramble',
  'LyricsTrainingWrapper.tsx': '/questions/lyrics_training',
  'ImageToMultipleChoiceWrapper.tsx': '/questions/image_to_multiple_choices'
};

function fixFile(filePath, fileName) {
  let content = fs.readFileSync(filePath, 'utf8');
  const endpoint = endpointMap[fileName];

  // Replace updateQuestionMutation.mutate({ id: existingQuestion.id, formData })
  // with updateMutation.mutate({ endpoint: "...", questionId: existingQuestion.id, data: formData, challengeId })

  const oldPattern = /updateQuestionMutation\.mutate\(\{\s*id:\s*existingQuestion\.id,\s*formData\s*\}\)/g;
  const newCode = `updateMutation.mutate({
        endpoint: "${endpoint}",
        questionId: existingQuestion.id,
        data: formData,
        challengeId,
      })`;

  content = content.replace(oldPattern, newCode);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${fileName}`);
}

console.log('🔧 Fixing updateQuestionMutation references...\n');

files.forEach(file => {
  const filePath = path.join(wrappersDir, file);
  if (fs.existsSync(filePath)) {
    fixFile(filePath, file);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Fix complete!');
