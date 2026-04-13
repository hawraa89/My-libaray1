const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function fixTabserFiles() {
  console.log('=== Final Fix for Tabser Files ===\n');
  
  try {
    // List all files to find the Tabser book
    const bookFiles = fs.readdirSync(booksDir);
    const coverFiles = fs.readdirSync(coversDir);
    
    console.log('All book files:');
    bookFiles.forEach(file => {
      if (file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr')) {
        console.log(`  - ${file}`);
      }
    });
    
    console.log('\nAll cover files:');
    coverFiles.forEach(file => {
      if (file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr')) {
        console.log(`  - ${file}`);
      }
    });
    
    // Find the specific files
    const currentBook = bookFiles.find(f => f.includes('alebsr') || f.includes('Tabser'));
    const currentCover = coverFiles.find(f => f.includes('alebsr') || f.includes('Tabser'));
    
    console.log(`\nFound book: ${currentBook}`);
    console.log(`Found cover: ${currentCover}`);
    
    if (currentBook && currentCover) {
      // Target name (without diacritics)
      const targetName = 'alebsr_tejara';
      
      // Rename book file
      const oldBookPath = path.join(booksDir, currentBook);
      const newBookPath = path.join(booksDir, `${targetName}.pdf`);
      
      if (fs.existsSync(oldBookPath) && !fs.existsSync(newBookPath)) {
        console.log(`\nRenaming book:`);
        console.log(`  From: ${currentBook}`);
        console.log(`  To: ${targetName}.pdf`);
        fs.renameSync(oldBookPath, newBookPath);
      }
      
      // Rename cover file
      const oldCoverPath = path.join(coversDir, currentCover);
      const newCoverPath = path.join(coversDir, `${targetName}.jpg`);
      
      if (fs.existsSync(oldCoverPath) && !fs.existsSync(newCoverPath)) {
        console.log(`\nRenaming cover:`);
        console.log(`  From: ${currentCover}`);
        console.log(`  To: ${targetName}.jpg`);
        fs.renameSync(oldCoverPath, newCoverPath);
      }
      
      console.log('\u2705 Successfully renamed both files!');
      console.log(`Both files now have the same name: ${targetName}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixTabserFiles();

console.log('\n=== Verification ===');
console.log('Checking files after rename...\n');

const { detectMismatches } = require('./detect-mismatches.js');
detectMismatches();
