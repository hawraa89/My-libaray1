const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');

function finalDuplicateCheck() {
  console.log('=== Final Duplicate and Cover Check ===\n');
  
  try {
    // List all files in both directories
    const bookFiles = fs.readdirSync(booksDir);
    const coverFiles = fs.readdirSync(coversDir);
    
    console.log('All books in directory:');
    bookFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    console.log('\nAll covers in directory:');
    coverFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    // Find Tabser-related files
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
    
    console.log(`\nFound ${tabserBooks.length} Tabser books and ${tabserCovers.length} Tabser covers`);
    
    if (tabserBooks.length > 1) {
      console.log('\n🚨 DUPLICATE FOUND! Multiple Tabser book files:');
      tabserBooks.forEach((file, index) => {
        const filePath = path.join(booksDir, file);
        const stats = fs.statSync(filePath);
        console.log(`  ${index + 1}. ${file} (${stats.size} bytes, modified: ${stats.mtime})`);
      });
      
      console.log('\n🗑️  DELETING OLDER DUPLICATES, KEEPING NEWEST...');
      
      // Sort by modification time to find newest
      const filesWithStats = tabserBooks.map(file => {
        const filePath = path.join(booksDir, file);
        const stats = fs.statSync(filePath);
        return {
          file,
          path: filePath,
          mtime: stats.mtime,
          size: stats.size
        };
      });
      
      filesWithStats.sort((a, b) => b.mtime - a.mtime);
      
      // Keep newest, delete older duplicates
      const filesToRemove = filesWithStats.slice(1);
      const fileToKeep = filesWithStats[0];
      
      filesToRemove.forEach(fileObj => {
        console.log(`  🗑️  Deleting: ${fileObj.file}`);
        fs.unlinkSync(fileObj.path);
      });
      
      console.log(`\n✅ Keeping: ${fileToKeep.file} (newest)`);
      
    } else if (tabserBooks.length === 1) {
      console.log('\n✅ Only one Tabser book found - no duplicates.');
    } else {
      console.log('\n⚠️  No Tabser books found.');
    }
    
    // Check covers
    console.log('\nChecking covers...');
    const duplicateCovers = tabserCovers.filter((file, index, self) => 
      tabserCovers.indexOf(file) !== index
    );
    
    if (duplicateCovers.length > 0) {
      console.log('\n🚨 DUPLICATE COVERS FOUND:');
      duplicateCovers.forEach(cover => {
        console.log(`  - ${cover}`);
      });
      
      console.log('\n🗑️  DELETING DUPLICATE COVERS...');
      duplicateCovers.forEach(cover => {
        const coverPath = path.join(coversDir, cover);
        fs.unlinkSync(coverPath);
        console.log(`  ✅ Deleted: ${cover}`);
      });
    } else if (tabserCovers.length === 1) {
      console.log('\n✅ Only one Tabser cover found - no duplicates.');
    } else if (tabserCovers.length > 1) {
      console.log('\n⚠️  Multiple Tabser covers found, keeping first one.');
    } else {
      console.log('\n⚠️  No Tabser covers found.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

finalDuplicateCheck();
