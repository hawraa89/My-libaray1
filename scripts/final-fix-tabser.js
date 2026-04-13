const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function finalFixTabser() {
  console.log('=== Final Fix for Tabser Book ===\n');
  
  try {
    // Current files
    const currentBook = 'alebsr_baltejara.pdf'; // with diacritic
    const currentCover = 'alebsr_tejara.jpg';   // without diacritic
    
    const currentBookPath = path.join(booksDir, currentBook);
    
    console.log('Current situation:');
    console.log(`  Book: ${currentBook}`);
    console.log(`  Cover: ${currentCover}`);
    
    // Check if book exists
    if (fs.existsSync(currentBookPath)) {
      // Rename book to match cover exactly
      const newBookName = 'alebsr_tejara'; // same as cover name
      const newBookFile = `${newBookName}.pdf`;
      const newBookPath = path.join(booksDir, newBookFile);
      
      console.log(`\nRenaming book to match cover:`);
      console.log(`  From: ${currentBook}`);
      console.log(`  To: ${newBookFile}`);
      
      fs.renameSync(currentBookPath, newBookPath);
      
      console.log('\u2705 Successfully renamed!');
      console.log(`Now both files match exactly:`);
      console.log(`  Book: ${newBookFile}`);
      console.log(`  Cover: ${currentCover}`);
      
    } else {
      console.log('Book file not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

finalFixTabser();

console.log('\n=== Verification ===');
console.log('Running detection to verify fix...\n');

const { detectMismatches } = require('./detect-mismatches.js');
detectMismatches();
