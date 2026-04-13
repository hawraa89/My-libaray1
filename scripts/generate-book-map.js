const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/books');
const coversDir = path.join(__dirname, '../public/covers');
const outputFile = path.join(__dirname, '../public/books-map.json');

function generateBookMap() {
  try {
    const books = fs.readdirSync(booksDir).filter(file => file.endsWith('.pdf'));
    const covers = fs.readdirSync(coversDir).filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg'));
    
    const bookMap = [];
    
    books.forEach(bookFile => {
      const bookName = path.parse(bookFile).name;
      let matchingCover = covers.find(coverFile => {
        const coverName = path.parse(coverFile).name;
        // Normalize names for matching (remove diacritics and handle slight variations)
        return coverName.replace(/[_\-\s]/g, '').toLowerCase() === bookName.replace(/[_\-\s]/g, '').toLowerCase();
      });
      
      // Handle specific mismatches
      if (!matchingCover) {
        if (bookName === 'التبصُّر_بالتجارة') {
          matchingCover = 'التبصر_بالتجارة.jpg';
        } else if (bookName === 'الفيزياء_والفلسفة') {
          matchingCover = 'الفيزياء_والفلسلفة.jpg';
        } else if (bookName === 'تفاعل_متسلسل') {
          matchingCover = 'تفاعل_المتسلسل.jpg';
        }
      }
      
      bookMap.push({
        id: bookName,
        title: bookName.replace(/_/g, ' '),
        pdf: `/books/${bookFile}`,
        cover: matchingCover ? `/covers/${matchingCover}` : null,
        size: fs.statSync(path.join(booksDir, bookFile)).size
      });
    });
    
    fs.writeFileSync(outputFile, JSON.stringify(bookMap, null, 2), 'utf8');
    console.log(`Generated book map with ${bookMap.length} books`);
    console.log(`Books without covers: ${bookMap.filter(book => !book.cover).length}`);
    
    return bookMap;
  } catch (error) {
    console.error('Error generating book map:', error);
    return [];
  }
}

generateBookMap();
