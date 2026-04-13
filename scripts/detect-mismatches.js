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

function detectMismatches() {
  console.log('=== Detecting filename mismatches ===\n');
  
  try {
    const bookFiles = fs.readdirSync(booksDir).filter(file => file.endsWith('.pdf'));
    const coverFiles = fs.readdirSync(coversDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    console.log(`Books found: ${bookFiles.length}`);
    console.log(`Covers found: ${coverFiles.length}\n`);
    
    const mismatches = [];
    const matches = [];
    
    bookFiles.forEach(bookFile => {
      const bookName = path.parse(bookFile).name;
      const bookNormalized = normalizeFilename(bookFile);
      
      const matchingCover = coverFiles.find(coverFile => 
        normalizeFilename(coverFile) === bookNormalized
      );
      
      if (matchingCover) {
        matches.push({
          book: bookFile,
          bookName: bookName,
          cover: matchingCover,
          normalized: bookNormalized
        });
      } else {
        // Find potential matches with higher tolerance
        const potentialMatches = coverFiles.filter(coverFile => {
          const coverNormalized = normalizeFilename(coverFile);
          return coverNormalized.includes(bookNormalized.slice(0, 6)) || 
                 bookNormalized.includes(coverNormalized.slice(0, 6));
        });
        
        mismatches.push({
          book: bookFile,
          bookName: bookName,
          normalized: bookNormalized,
          potentialMatches: potentialMatches,
          hasPotentialMatch: potentialMatches.length > 0
        });
      }
    });
    
    console.log('=== MATCHES ===');
    matches.forEach(match => {
      console.log(`\u2713 ${match.bookName}`);
      console.log(`  Book: ${match.book}`);
      console.log(`  Cover: ${match.cover}`);
      console.log(`  Normalized: ${match.normalized}\n`);
    });
    
    console.log('\n=== MISMATCHES ===');
    mismatches.forEach(mismatch => {
      console.log(`\u2717 ${mismatch.bookName}`);
      console.log(`  Book: ${mismatch.book}`);
      console.log(`  Normalized: ${mismatch.normalized}`);
      if (mismatch.hasPotentialMatch) {
        console.log(`  Potential matches:`);
        mismatch.potentialMatches.forEach(pm => {
          console.log(`    - ${pm} (normalized: ${normalizeFilename(pm)})`);
        });
      } else {
        console.log(`  No potential matches found`);
      }
      console.log('');
    });
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total books: ${bookFiles.length}`);
    console.log(`Matches: ${matches.length}`);
    console.log(`Mismatches: ${mismatches.length}`);
    console.log(`Coverage: ${((matches.length / bookFiles.length) * 100).toFixed(1)}%`);
    
    return { matches, mismatches, bookFiles, coverFiles };
    
  } catch (error) {
    console.error('Error detecting mismatches:', error);
    return null;
  }
}

// Run the detection
const result = detectMismatches();
module.exports = { detectMismatches, normalizeFilename };
