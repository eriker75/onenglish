const fs = require('fs');
const path = require('path');

const wrappersDir = path.join(__dirname, '../dashboard/app/dashboard/challenges/[challengeId]/components/question-blocks-wrappers');

const wrapperFiles = [
  'DebateWrapper.tsx',
  'FastTestWrapper.tsx',
  'GossipWrapper.tsx',
  'ImageToMultipleChoiceWrapper.tsx',
  'LyricsTrainingWrapper.tsx',
  'ReadItWrapper.tsx',
  'ReportItWrapper.tsx',
  'SentenceMakerWrapper.tsx',
  'SpellingWrapper.tsx',
  'SuperBrainWrapper.tsx',
  'TagItWrapper.tsx',
  'TalesWrapper.tsx',
  'TellMeAboutItWrapper.tsx',
  'TensesWrapper.tsx',
  'TopicBasedAudioWrapper.tsx',
  'UnscrambleWrapper.tsx',
  'WordAssociationsWrapper.tsx',
  'WordMatchWrapper.tsx'
];

function cleanWrapper(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove orphaned callback blocks that start with empty lines and contain onError
  // Pattern: lines like "  \n      if (onSuccess) onSuccess();\n\n    onError: ... });"
  content = content.replace(
    /\n\s*\n\s+if \(onSuccess\) onSuccess\(\);[\s\S]*?onError:[\s\S]*?\}\);/g,
    ''
  );

  // Remove any standalone orphaned });
  // But be careful not to remove valid closing braces
  // Look for });  followed by empty line and then const or another statement
  content = content.replace(
    /\n\s*\}\);\n\s*\n\s+(?=const |return |if |const)/g,
    '\n\n  '
  );

  // Clean up multiple consecutive empty lines
  content = content.replace(/\n\n\n+/g, '\n\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${path.basename(filePath)}`);
}

console.log('🔧 Fixing orphaned code in wrappers...\n');

wrapperFiles.forEach(file => {
  const filePath = path.join(wrappersDir, file);
  if (fs.existsSync(filePath)) {
    cleanWrapper(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Fix complete!');
