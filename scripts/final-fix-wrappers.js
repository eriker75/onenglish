const fs = require('fs');
const path = require('path');

const wrappersDir = path.join(__dirname, '../dashboard/app/dashboard/challenges/[challengeId]/components/question-blocks-wrappers');

const wrapperFiles = [
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

function fixWrapper(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove orphaned }); before const createMutation
  content = content.replace(
    /\n\s*\}\);\n\s*\n\s*const createMutation/g,
    '\n\n  const createMutation'
  );

  // 2. Fix updateMutation.mutate calls - fix the broken structure
  // Pattern: challengeId,\n\n        {\n          onSuccess
  // Should be: challengeId,\n        },\n        {\n          onSuccess
  content = content.replace(
    /(challengeId,)\n\s*\n\s*\{\s*\n\s*(onSuccess:)/g,
    '$1\n        },\n        {\n          $2'
  );

  // 3. Fix missing closing braces in callbacks
  // Pattern: if (onSuccess) onSuccess();\n\n          onError:
  // Should be: if (onSuccess) onSuccess();\n          },\n          onError:
  content = content.replace(
    /(if \(onSuccess\) onSuccess\(\);)\n\s*\n\s*(onError:)/g,
    '$1\n          },\n          $2'
  );

  // 4. Fix missing closing braces before final });
  // Pattern: });\n\n        }\n      );
  // Should be: });\n          }\n        }\n      );
  content = content.replace(
    /(\}\);)\n\s*\n\s*\}\s*\n\s*\)\;/g,
    '$1\n          }\n        }\n      );'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${path.basename(filePath)}`);
}

console.log('🔧 Final fix for all wrappers...\n');

wrapperFiles.forEach(file => {
  const filePath = path.join(wrappersDir, file);
  if (fs.existsSync(filePath)) {
    fixWrapper(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Final fix complete!');
