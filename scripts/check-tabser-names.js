const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function checkTabserNames() {
  console.log('=== Checking Exact Names for Tabser ===\n');
  
  try {
    const bookFiles = fs.readdirSync(booksDir);
    const coverFiles = fs.readdirSync(coversDir);
    
    console.log('Looking for Tabser files...');
    
    // Find all files that might be related to Tabser
    const tabserBooks = bookFiles.filter(file => 
      file.toLowerCase().includes('alebsr') || 
      file.toLowerCase().includes('tabser') ||
      file.toLowerCase().includes('تبصر')
    );
    
    const tabserCovers = coverFiles.filter(file => 
      file.toLowerCase().includes('alebsr') || 
      file.toLowerCase().includes('tabser') ||
      file.toLowerCase().includes('تبصر')
    );
    
    console.log('Tabser-related books:');
    tabserBooks.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    console.log('\nTabser-related covers:');
    tabserCovers.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    if (tabserBooks.length > 0 && tabserCovers.length > 0) {
      const bookFile = tabserBooks[0];
      const coverFile = tabserCovers[0];
      
      console.log(`\nPrimary files found:`);
      console.log(`  Book: ${bookFile}`);
      console.log(`  Cover: ${coverFile}`);
      
      // Extract base names
      const bookBase = path.parse(bookFile).name;
      const coverBase = path.parse(coverFile).name;
      
      console.log(`\nBase names:`);
      console.log(`  Book base: "${bookBase}"`);
      console.log(`  Cover base: "${coverBase}"`);
      console.log(`  Are they identical? ${bookBase === coverBase ? 'YES' : 'NO'}`);
      
      if (bookBase !== coverBase) {
        console.log(`\nNeed to rename to make them identical!`);
        console.log(`Target name should be: "${bookBase}"`);
        
        // Rename cover to match book
        const oldCoverPath = path.join(coversDir, coverFile);
        const newCoverPath = path.join(coversDir, `${bookBase}.jpg`);
        
        if (fs.existsSync(oldCoverPath) && !fs.existsSync(newCoverPath)) {
          console.log(`\nRenaming cover:`);
          console.log(`  From: ${coverFile}`);
          console.log(`  To: ${bookBase}.jpg`);
          fs.renameSync(oldCoverPath, newCoverPath);
          console.log('✅ Successfully renamed!');
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTabserNames();

console.log('\n=== Verification ===');
console.log('Running detection to verify fix...\n');

const { detectMismatches } = require('./detect-mismatches.js');
detectMismatches();
