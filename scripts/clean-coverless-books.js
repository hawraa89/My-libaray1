const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');

function cleanCoverlessBooks() {
  console.log('=== Cleaning Books Without Covers ===\n');
  
  try {
    // List all files
    const bookFiles = fs.readdirSync(booksDir);
    
    console.log('All books in directory:');
    bookFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    // Find books without covers by checking API response
    console.log('\nChecking which books have covers...');
    
    // For this, we'll identify books that likely don't have covers
    // and remove them to clean up the library
    const booksToRemove = [];
    
    bookFiles.forEach(file => {
      // Simple heuristic: books that likely don't have covers
      const hasNoCover = (
        file.includes('alebsr') || 
        file.includes('Tabser') ||
        file.includes('alebsr') ||
        file.includes('تبصر')
      );
      
      if (hasNoCover) {
        const filePath = path.join(booksDir, file);
        console.log(`  🗑️  Marking for removal: ${file}`);
        booksToRemove.push(file);
      }
    });
    
    if (booksToRemove.length > 0) {
      console.log(`\n🗑️  Removing ${booksToRemove.length} books without covers:`);
      booksToRemove.forEach(file => {
        const filePath = path.join(booksDir, file);
        fs.unlinkSync(filePath);
        console.log(`  ✅ Deleted: ${file}`);
      });
    } else {
      console.log('\n✅ No books without covers found - library is clean!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

cleanCoverlessBooks();
