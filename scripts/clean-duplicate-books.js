const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');

function cleanDuplicateBooks() {
  console.log('=== Cleaning Duplicate Books ===\n');
  
  try {
    // List all files
    const bookFiles = fs.readdirSync(booksDir);
    
    console.log('All books in directory:');
    bookFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    // Find Tabser-related files
    const tabserFiles = bookFiles.filter(file => 
      file.includes('alebsr') || file.includes('Tabser') || file.includes('alebsr') || file.includes('تبصر')
    );
    
    console.log(`\nFound ${tabserFiles.length} Tabser-related files:`);
    tabserFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    if (tabserFiles.length > 1) {
      console.log('\n🧹 Found duplicates! Cleaning up...\n');
      
      // Sort by modification time to keep the latest
      const filesWithStats = tabserFiles.map(file => {
        const filePath = path.join(booksDir, file);
        const stats = fs.statSync(filePath);
        return {
          file,
          path: filePath,
          mtime: stats.mtime,
          size: stats.size
        };
      });
      
      // Sort by modification time (newest first)
      filesWithStats.sort((a, b) => b.mtime - a.mtime);
      
      // Keep the newest file, remove older duplicates
      const filesToRemove = filesWithStats.slice(1); // Keep first (newest), remove rest
      
      filesToRemove.forEach(fileObj => {
        console.log(`🗑️  Removing: ${fileObj.file}`);
        console.log(`    Size: ${fileObj.size} bytes`);
        console.log(`    Modified: ${fileObj.mtime}`);
        fs.unlinkSync(fileObj.path);
      });
      
      const keptFile = filesWithStats[0];
      console.log(`\n✅ Keeping: ${keptFile.file}`);
      console.log(`    Size: ${keptFile.size} bytes`);
      console.log(`    Modified: ${keptFile.mtime}`);
      
    } else if (tabserFiles.length === 1) {
      console.log('\n✅ No duplicates found for Tabser books.');
    } else {
      console.log('\n⚠️  No Tabser books found.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

cleanDuplicateBooks();

console.log('\n=== Verification ===');
console.log('Running detection to verify cleanup...\n');

const { detectMismatches } = require('./detect-mismatches.js');
detectMismatches();
