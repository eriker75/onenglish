const fs = require('fs');
const path = require('path');

const wrappersDir = path.join(__dirname, '../dashboard/app/dashboard/challenges/[challengeId]/components/question-blocks-wrappers');

const files = [
  'ReportItWrapper.tsx',
  'TagItWrapper.tsx'
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Pattern to find and reorder:
  // const XXXQuestion = (freshQuestionData || existingQuestion) as ...
  // const challengeId = ...
  // // Fetch fresh data when editing
  // const { data: freshQuestionData } = useQuestion(existingQuestion?.id);

  // We need to move the useQuestion call and challengeId BEFORE the XXXQuestion declaration

  const pattern = /(const\s+{\s*toast\s*}\s*=\s*useToast\(\);)\s*\n\s*(\/\/\s*Cast.*\n\s*)(const\s+\w+Question\s*=\s*\(freshQuestionData.*\n)\s*(const\s+challengeId\s*=.*\n)\s*\n\s*(\/\/\s*Fetch fresh data.*\n)\s*(const\s*{\s*data:\s*freshQuestionData\s*}\s*=\s*useQuestion.*\n)/;

  const replacement = '$1\n  $4\n  $5  $6\n  $2$3';

  content = content.replace(pattern, replacement);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${path.basename(filePath)}`);
}

console.log('🔧 Fixing variable order...\n');

files.forEach(file => {
  const filePath = path.join(wrappersDir, file);
  if (fs.existsSync(filePath)) {
    fixFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Fix complete!');
