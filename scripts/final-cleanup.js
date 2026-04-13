const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function finalCleanup() {
  console.log('=== Final Data Cleanup ===\n');
  
  try {
    // List all files
    const bookFiles = fs.readdirSync(booksDir);
    const coverFiles = fs.readdirSync(coversDir);
    
    console.log(`Found ${bookFiles.length} books and ${coverFiles.length} covers`);
    
    // Find and remove any duplicates
    const tabserBooks = bookFiles.filter(file => 
      file.toLowerCase().includes('alebsr') || 
      file.toLowerCase().includes('tabser') ||
      file.toLowerCase().includes('alebsr') ||
      file.toLowerCase().includes('تبصر')
    );
    
    const tabserCovers = coverFiles.filter(file => 
      file.toLowerCase().includes('alebsr') || 
      file.toLowerCase().includes('tabser') ||
      file.toLowerCase().includes('alebsr') ||
      file.toLowerCase().includes('تبصر')
    );
    
    console.log(`\nTabser books: ${tabserBooks.length}`);
    console.log('Tabser covers: ${tabserCovers.length}');
    
    // Keep only one Tabser book file
    if (tabserBooks.length > 1) {
      console.log('\n🗑️  Removing duplicate Tabser books...');
      tabserBooks.slice(1).forEach(file => {
        const filePath = path.join(booksDir, file);
        fs.unlinkSync(filePath);
        console.log(`  ✅ Deleted: ${file}`);
      });
    }
    
    // Keep only one Tabser cover file
    if (tabserCovers.length > 1) {
      console.log('\n🗑️  Removing duplicate Tabser covers...');
      tabserCovers.slice(1).forEach(file => {
        const filePath = path.join(coversDir, file);
        fs.unlinkSync(filePath);
        console.log(`  ✅ Deleted: ${file}`);
      });
    }
    
    console.log('\n✅ Cleanup completed!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

finalCleanup();
