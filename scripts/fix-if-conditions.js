const fs = require('fs');
const path = require('path');

const wrappersDir = path.join(__dirname, '../dashboard/app/dashboard/challenges/[challengeId]/components/question-blocks-wrappers');

const files = [
  'SentenceMakerWrapper.tsx',
  'TalesWrapper.tsx',
  'WordAssociationsWrapper.tsx',
  'WordMatchWrapper.tsx',
  'TagItWrapper.tsx',
  'LyricsTrainingWrapper.tsx',
  'TellMeAboutItWrapper.tsx',
  'SuperBrainWrapper.tsx',
  'TopicBasedAudioWrapper.tsx' // might also have this issue
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace patterns like:
  // if (sentenceMakerQuestion) {
  //   updateMutation.mutate({
  //     ...
  //     questionId: existingQuestion.id,

  // Find any: if (xxxQuestion) { followed by updateMutation.mutate
  const pattern = /if \((\w+Question)\) \{\s*\n\s*updateMutation\.mutate\(/g;

  if (pattern.test(content)) {
    content = content.replace(
      /if \((\w+Question)\) \{\s*\n(\s*)updateMutation\.mutate\(/g,
      'if (existingQuestion) {\n$2updateMutation.mutate('
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${path.basename(filePath)}`);
  } else {
    console.log(`ℹ️  No changes needed for ${path.basename(filePath)}`);
  }
}

console.log('🔧 Fixing if conditions...\n');

files.forEach(file => {
  const filePath = path.join(wrappersDir, file);
  if (fs.existsSync(filePath)) {
    fixFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Fix complete!');
