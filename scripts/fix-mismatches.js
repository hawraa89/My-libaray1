const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function normalizeFilename(filename) {
  return filename
    .replace(/\.(pdf|jpg|jpeg|png)$/i, '') // Remove extension
    .replace(/[\u064B-\u0652\u0640]/g, '') // Remove Arabic diacritics and tatweel
    .replace(/[_\-\s]/g, '') // Remove underscores, hyphens, spaces
    .replace(/[^\w\u0600-\u06FF]/g, '') // Keep only alphanumeric and Arabic characters
    .toLowerCase();
}

function fixMismatches() {
  console.log('=== Fixing filename mismatches ===\n');
  
  try {
    const bookFiles = fs.readdirSync(booksDir).filter(file => file.endsWith('.pdf'));
    const coverFiles = fs.readdirSync(coversDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    const fixes = [];
    
    bookFiles.forEach(bookFile => {
      const bookName = path.parse(bookFile).name;
      const bookNormalized = normalizeFilename(bookFile);
      
      const matchingCover = coverFiles.find(coverFile => 
        normalizeFilename(coverFile) === bookNormalized
      );
      
      if (!matchingCover) {
        // Find the closest match using Levenshtein distance
        let bestMatch = null;
        let bestScore = Infinity;
        
        coverFiles.forEach(coverFile => {
          const coverNormalized = normalizeFilename(coverFile);
          const score = levenshteinDistance(bookNormalized, coverNormalized);
          
          if (score < bestScore && score <= 3) { // Allow up to 3 character differences
            bestScore = score;
            bestMatch = coverFile;
          }
        });
        
        if (bestMatch) {
          const oldCoverPath = path.join(coversDir, bestMatch);
          const newCoverName = `${bookName}.jpg`;
          const newCoverPath = path.join(coversDir, newCoverName);
          
          console.log(`\ud83d\udd27 Fixing: ${bookName}`);
          console.log(`  Current cover: ${bestMatch}`);
          console.log(`  New cover: ${newCoverName}`);
          console.log(`  Distance: ${bestScore} characters\n`);
          
          // Rename the file
          fs.renameSync(oldCoverPath, newCoverPath);
          
          fixes.push({
            book: bookFile,
            oldCover: bestMatch,
            newCover: newCoverName,
            distance: bestScore
          });
        } else {
          console.log(`\u274c No fix found for: ${bookName}`);
          console.log(`  Consider adding a cover image named: ${bookName}.jpg\n`);
        }
      }
    });
    
    console.log(`\n=== FIX SUMMARY ===`);
    console.log(`Files fixed: ${fixes.length}`);
    fixes.forEach(fix => {
      console.log(`  ${fix.oldCover} \u2192 ${fix.newCover}`);
    });
    
    return fixes;
    
  } catch (error) {
    console.error('Error fixing mismatches:', error);
    return [];
  }
}

// Simple Levenshtein distance implementation
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Run the fixes
const fixes = fixMismatches();
console.log(`\n=== RE-RUNNING DETECTION TO VERIFY ===`);
console.log(`Running detection script to verify fixes...\n`);

// Re-run detection to verify
const { detectMismatches } = require('./detect-mismatches.js');
detectMismatches();
