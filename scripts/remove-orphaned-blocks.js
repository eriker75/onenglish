const fs = require('fs');
const path = require('path');

const wrappersDir = path.join(__dirname, '../dashboard/app/dashboard/challenges/[challengeId]/components/question-blocks-wrappers');

const problematicFiles = [
  'ReadItWrapper.tsx',
  'ReportItWrapper.tsx',
  'SentenceMakerWrapper.tsx',
  'SpellingWrapper.tsx',
  'SuperBrainWrapper.tsx',
  'TagItWrapper.tsx',
  'TalesWrapper.tsx',
  'TellMeAboutItWrapper.tsx'
];

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove all orphaned code between state definitions and createMutation
  // This includes patterns like:
  // - return response.data;
  // - onSuccess: () => { toast... }
  // - onError: (error...) => { toast... }

  // Pattern: find everything between );[\n\s]* and const createMutation
  // that contains "return response.data" or orphaned callbacks
  const pattern = /(\);)\n\s*\n\s*(?:return response\.data;|onSuccess:)[\s\S]*?(?=\s*const createMutation)/g;

  content = content.replace(pattern, '$1\n\n  ');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Cleaned ${path.basename(filePath)}`);
}

console.log('🧹 Removing orphaned callback blocks...\n');

problematicFiles.forEach(file => {
  const filePath = path.join(wrappersDir, file);
  if (fs.existsSync(filePath)) {
    cleanFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Cleanup complete!');
