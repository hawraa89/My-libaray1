const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function finalTabserInvestigation() {
  console.log('=== FINAL Tabser Investigation ===\n');
  
  try {
    // Check all files in both directories
    const bookFiles = fs.readdirSync(booksDir);
    const coverFiles = fs.readdirSync(coversDir);
    
    console.log('All files in books directory:');
    bookFiles.forEach(file => {
      if (file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')) {
        console.log(`  ${file}`);
      }
    });
    
    console.log('\nAll files in covers directory:');
    coverFiles.forEach(file => {
      if (file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')) {
        console.log(`  ${file}`);
      }
    });
    
    // Find exact Tabser files
    const tabserBooks = bookFiles.filter(file => 
      file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')
    );
    
    const tabserCovers = coverFiles.filter(file => 
      file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')
    );
    
    console.log(`\nFound ${tabserBooks.length} Tabser books and ${tabserCovers.length} Tabser covers`);
    
    if (tabserBooks.length > 0 && tabserCovers.length > 0) {
      console.log('\nDetailed analysis:');
      
      tabserBooks.forEach((bookFile, index) => {
        console.log(`\nBook ${index + 1}: ${bookFile}`);
        const bookPath = path.join(booksDir, bookFile);
        const bookStats = fs.statSync(bookPath);
        console.log(`  Size: ${bookStats.size} bytes`);
        console.log(`  Modified: ${bookStats.mtime}`);
        
        // Find matching covers
        const bookBase = path.parse(bookFile).name;
        const matchingCovers = tabserCovers.filter(coverFile => {
          const coverBase = path.parse(coverFile).name;
          return coverBase.includes('alebsr') || coverBase.includes('Tabser') || coverBase.includes('alebsr') || coverBase.includes('تبصر');
        });
        
        console.log(`  Matching covers found: ${matchingCovers.length}`);
        matchingCovers.forEach((coverFile, coverIndex) => {
          const coverPath = path.join(coversDir, coverFile);
          const coverStats = fs.statSync(coverPath);
          console.log(`    Cover ${coverIndex + 1}: ${coverFile}`);
          console.log(`      Size: ${coverStats.size} bytes`);
          console.log(`      Modified: ${coverStats.mtime}`);
          console.log(`      Accessible: ${fs.existsSync(coverPath) ? 'YES' : 'NO'}`);
        });
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

finalTabserInvestigation();
