const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function normalizeArabicFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/\.(pdf|jpg|jpeg|png)$/i, '') // Remove extensions
    .replace(/[\u064B-\u0652\u0640]/g, '') // Remove ALL Arabic diacritics and tatweel
    .replace(/[_\-\s]+/g, '') // Remove underscores, hyphens, spaces
    .replace(/[^\w\u0600-\u06FF]/g, ''); // Keep only alphanumeric and Arabic characters
}

function robustTabserFix() {
  console.log('=== Robust Tabser Fix with Advanced Normalization ===\n');
  
  try {
    // List all files
    const bookFiles = fs.readdirSync(booksDir);
    const coverFiles = fs.readdirSync(coversDir);
    
    console.log('All book files:');
    bookFiles.forEach(file => {
      if (file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')) {
        console.log(`  - ${file}`);
      }
    });
    
    console.log('\nAll cover files:');
    coverFiles.forEach(file => {
      if (file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')) {
        console.log(`  - ${file}`);
      }
    });
    
    // Find all Tabser-related files
    const tabserBooks = bookFiles.filter(file => 
      file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')
    );
    
    const tabserCovers = coverFiles.filter(file => 
      file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')
    );
    
    console.log(`\nFound ${tabserBooks.length} Tabser books and ${tabserCovers.length} Tabser covers`);
    
    if (tabserBooks.length > 0 && tabserCovers.length > 0) {
      // Normalize all filenames for comparison
      const normalizedBooks = tabserBooks.map(file => ({
        original: file,
        normalized: normalizeArabicFilename(file),
        base: path.parse(file).name
      }));
      
      const normalizedCovers = tabserCovers.map(file => ({
        original: file,
        normalized: normalizeArabicFilename(file),
        base: path.parse(file).name
      }));
      
      console.log('\nNormalized book names:');
      normalizedBooks.forEach(book => {
        console.log(`  ${book.original} -> "${book.normalized}"`);
      });
      
      console.log('\nNormalized cover names:');
      normalizedCovers.forEach(cover => {
        console.log(`  ${cover.original} -> "${cover.normalized}"`);
      });
      
      // Find best matches
      const matches = [];
      normalizedBooks.forEach(book => {
        const matchingCover = normalizedCovers.find(cover => 
          cover.normalized === book.normalized
        );
        
        if (matchingCover) {
          matches.push({
            book: book,
            cover: matchingCover
          });
        }
      });
      
      console.log(`\nFound ${matches.length} matches`);
      matches.forEach((match, index) => {
        console.log(`\nMatch ${index + 1}:`);
        console.log(`  Book: ${match.book.original}`);
        console.log(`  Cover: ${match.cover.original}`);
        console.log(`  Normalized: "${match.book.normalized}"`);
        
        // Check if files need renaming
        if (match.book.base !== match.cover.base) {
          console.log(`  Base names differ: "${match.book.base}" vs "${match.cover.base}"`);
          
          // Rename cover to match book base name
          const oldCoverPath = path.join(coversDir, match.cover.original);
          const newCoverPath = path.join(coversDir, `${match.book.base}.jpg`);
          
          // Fix double extension issue
          let finalCoverName = `${match.book.base}.jpg`;
          if (finalCoverName.includes('.jpg.jpg')) {
            finalCoverName = finalCoverName.replace('.jpg.jpg', '.jpg');
          }
          
          const finalCoverPath = path.join(coversDir, finalCoverName);
          
          if (fs.existsSync(oldCoverPath) && !fs.existsSync(finalCoverPath)) {
            console.log(`  Renaming cover:`);
            console.log(`    From: ${match.cover.original}`);
            console.log(`    To: ${finalCoverName}`);
            fs.renameSync(oldCoverPath, finalCoverPath);
            console.log('  ✅ Cover renamed successfully!');
          }
        } else {
          console.log(`  ✅ Base names already match: "${match.book.base}"`);
        }
      });
      
      // Check for unmatched books
      const unmatchedBooks = normalizedBooks.filter(book => 
        !matches.some(match => match.book.original === book.original)
      );
      
      if (unmatchedBooks.length > 0) {
        console.log(`\n⚠️  Unmatched books:`);
        unmatchedBooks.forEach(book => {
          console.log(`  - ${book.original}`);
        });
      }
      
      // Check for unmatched covers
      const unmatchedCovers = normalizedCovers.filter(cover => 
        !matches.some(match => match.cover.original === cover.original)
      );
      
      if (unmatchedCovers.length > 0) {
        console.log(`\n⚠️  Unmatched covers:`);
        unmatchedCovers.forEach(cover => {
          console.log(`  - ${cover.original}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

robustTabserFix();

console.log('\n=== Final Verification ===');
console.log('Running detection to verify final fix...\n');

const { detectMismatches } = require('./detect-mismatches.js');
detectMismatches();
