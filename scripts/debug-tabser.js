const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function debugTabserBook() {
  console.log('=== Debugging Tabser Book Issue ===\n');
  
  try {
    // List all files
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
    
    // Check specific files
    const bookFile = bookFiles.find(f => f.includes('alebsr') || f.includes('Tabser'));
    const coverFile = coverFiles.find(f => f.includes('alebsr') || f.includes('Tabser'));
    
    console.log(`\nFound book: ${bookFile}`);
    console.log(`Found cover: ${coverFile}`);
    
    if (bookFile && coverFile) {
      const bookPath = path.join(booksDir, bookFile);
      const coverPath = path.join(coversDir, coverFile);
      
      console.log(`\nBook exists: ${fs.existsSync(bookPath)}`);
      console.log(`Cover exists: ${fs.existsSync(coverPath)}`);
      
      if (fs.existsSync(coverPath)) {
        const stats = fs.statSync(coverPath);
        console.log(`Cover size: ${stats.size} bytes`);
      }
      
      // Test API response manually
      console.log('\n=== Manual API Test ===');
      const bookName = path.parse(bookFile).name;
      console.log(`Book name: ${bookName}`);
      console.log(`Cover path should be: /covers/${coverFile}`);
      
      // Create a simple test response
      const testBook = {
        id: bookName,
        title: bookName.replace(/_/g, ' '),
        pdf: `/books/${bookFile}`,
        cover: `/covers/${coverFile}`,
        size: fs.statSync(bookPath).size
      };
      
      console.log('\nTest book object:');
      console.log(JSON.stringify(testBook, null, 2));
    }
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugTabserBook();
