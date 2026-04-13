const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');

function deleteTabserBook() {
  console.log('=== Deleting Tabser Book File ===\n');
  
  try {
    // List all files
    const bookFiles = fs.readdirSync(booksDir);
    
    console.log('All books in directory:');
    bookFiles.forEach(file => {
      if (file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')) {
        console.log(`  - ${file}`);
      }
    });
    
    // Find Tabser-related files
    const tabserFiles = bookFiles.filter(file => 
      file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')
    );
    
    console.log(`\nFound ${tabserFiles.length} Tabser-related files:`);
    
    if (tabserFiles.length > 0) {
      tabserFiles.forEach(file => {
        const filePath = path.join(booksDir, file);
        console.log(`\nDeleting: ${file}`);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✅ Successfully deleted: ${file}`);
        } else {
          console.log(`⚠️  File not found: ${file}`);
        }
      });
      
    } else {
      console.log('\n⚠️  No Tabser-related files found.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

deleteTabserBook();

console.log('\n=== Verification ===');
console.log('Checking files after deletion...\n');

const { detectMismatches } = require('./detect-mismatches.js');
detectMismatches();
