const fs = require('fs');
const path = require('path');

const wrappersDir = path.join(__dirname, '..', 'app', 'dashboard', 'challenges', '[challengeId]', 'components', 'question-blocks-wrappers');

const wrappers = [
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
  'WordMatchWrapper.tsx',
];

wrappers.forEach(filename => {
  const filePath = path.join(wrappersDir, filename);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove orphaned mutation callbacks
  content = content.replace(/\s+onSuccess:\s*\(\)\s*=>\s*{\s+if\s*\(onSuccess\)\s*onSuccess\(\);\s+},\s+onError:\s*\(error:\s*AxiosError<{[^}]*}>\)\s*=>\s*{\s+[^}]+{\s+[^}]+:\s*"Error"[^}]+}\s+},\s+}\);/gs, '');
  
  content = content.replace(/\s+},\s+onSuccess:\s*\(\)\s*=>\s*{\s+toast\(\{\s+title:\s*"Success"[^}]+\}\);\s+if\s*\(onSuccess\)\s*onSuccess\(\);\s+},\s+onError[^}]+}\s+}\);/gs, '');

  // Remove orphaned callback fragments
  content = content.replace(/^\s+},\s*$/gm, '');
  content = content.replace(/^\s+onSuccess:\s*\(\)\s*=>\s*\{[\s\S]*?},$/gm, '');
  content = content.replace(/^\s+onError:\s*\(error[^)]*\)\s*=>\s*\{[\s\S]*?},$/gm, '');

  // Remove duplicate imports
  const lines = content.split('\n');
  const seenImports = new Set();
  const cleanedLines = lines.filter(line => {
    if (line.trim().startsWith('import ')) {
      if (seenImports.has(line.trim())) {
        return false;
      }
      seenImports.add(line.trim());
    }
    return true;
  });

  content = cleanedLines.join('\n');

  // Add missing useToast import if needed
  if (content.includes('const { toast } = useToast()') && !content.includes('import { useToast }')) {
    content = content.replace(
      /^import { useState } from "react";/m,
      `import { useState } from "react";
import { useToast } from "@/hooks/use-toast";`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Cleaned ${filename}`);
});

console.log('\n✨ Cleanup complete!');
