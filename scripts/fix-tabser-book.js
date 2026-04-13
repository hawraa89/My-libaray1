const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function fixTabserBook() {
  console.log('=== Fixing specific book: Tabser bel Tejara ===\n');
  
  try {
    // Check current files
    const bookFile = 'alebsr_baltejara.pdf'; // Original with diacritic
    const coverFile = 'alebsr_tejara.jpg';   // Cover without diacritic
    
    const bookPath = path.join(booksDir, bookFile);
    const coverPath = path.join(coversDir, coverFile);
    
    console.log('Current files:');
    console.log(`  Book: ${bookFile}`);
    console.log(`  Cover: ${coverFile}`);
    
    // Check if files exist
    if (!fs.existsSync(bookPath)) {
      console.log('Book file not found, checking alternative...');
      const bookFiles = fs.readdirSync(booksDir).filter(f => f.includes('alebsr'));
      if (bookFiles.length > 0) {
        console.log(`Found book: ${bookFiles[0]}`);
        const actualBookFile = bookFiles[0];
        const actualBookName = path.parse(actualBookFile).name;
        
        // Rename the book file to match the cover
        const newBookFile = `${actualBookName}.pdf`;
        const newBookPath = path.join(booksDir, newBookFile);
        
        console.log(`\nRenaming book:`);
        console.log(`  From: ${actualBookFile}`);
        console.log(`  To: ${newBookFile}`);
        
        fs.renameSync(path.join(booksDir, actualBookFile), newBookPath);
        
        console.log('\n\u2705 Successfully renamed the book file!');
        console.log(`Now both book and cover should match: ${newBookFile} <-> ${coverFile}`);
        
      } else {
        console.log('No book file found containing "alebsr"');
      }
    } else {
      console.log('Book file exists, checking cover match...');
      
      // The issue is that the book has diacritics but cover doesn't
      // Let's rename the book to remove diacritics
      const newBookFile = 'alebsr_tejara.pdf';
      const newBookPath = path.join(booksDir, newBookFile);
      
      console.log(`\nRenaming book to match cover:`);
      console.log(`  From: ${bookFile}`);
      console.log(`  To: ${newBookFile}`);
      
      fs.renameSync(bookPath, newBookPath);
      
      console.log('\n\u2705 Successfully renamed the book file!');
      console.log(`Now both book and cover should match: ${newBookFile} <-> ${coverFile}`);
    }
    
  } catch (error) {
    console.error('Error fixing Tabser book:', error);
  }
}

// Run the fix
fixTabserBook();

console.log('\n=== Verifying the fix ===');
console.log('Running detection to verify...\n');

// Re-run detection to verify
const { detectMismatches } = require('./detect-mismatches.js');
detectMismatches();
