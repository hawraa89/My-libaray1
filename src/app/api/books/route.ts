import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const booksDir = path.join(process.cwd(), 'public', 'books')
    const coversDir = path.join(process.cwd(), 'public', 'covers')
    
    // Check if directories exist
    if (!fs.existsSync(booksDir)) {
      return NextResponse.json({ error: 'Books directory not found' }, { status: 404 })
    }
    
    if (!fs.existsSync(coversDir)) {
      return NextResponse.json({ error: 'Covers directory not found' }, { status: 404 })
    }
    
    // Get all PDF files from books directory
    const bookFiles = fs.readdirSync(booksDir).filter(file => 
      file.toLowerCase().endsWith('.pdf')
    )
    
    // Get all image files from covers directory
    const coverFiles = fs.readdirSync(coversDir).filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png')
    )
    
    // Function to normalize filename for matching
    const normalizeFilename = (filename: string) => {
      return filename
        .replace(/\.(pdf|jpg|jpeg|png)$/i, '') // Remove extension
        .replace(/[_\-\s]/g, '') // Remove underscores, hyphens, spaces
        .replace(/[^\w\u0600-\u06FF]/g, '') // Keep only alphanumeric and Arabic characters
        .toLowerCase()
    }
    
    // Create book objects with matching covers
    const books = bookFiles.map(bookFile => {
      const bookName = path.parse(bookFile).name
      const bookBaseName = normalizeFilename(bookFile)
      
      // Find matching cover
      let matchingCover = coverFiles.find(coverFile => 
        normalizeFilename(coverFile) === bookBaseName
      )
      
      // Handle specific filename mismatches
      if (!matchingCover) {
        if (bookName === 'alebsr_baltejara') { // 'alebsr_baltejara' normalized
          matchingCover = 'alebsr_tejara.jpg'
        } else if (bookName === 'alfizya_walfalsfa') { // 'alfizya_walfalsfa' normalized  
          matchingCover = 'alfizya_walfalsfa.jpg'
        } else if (bookName === 'tefael_mtalsl') { // 'tefael_mtalsl' normalized
          matchingCover = 'tefael_mtalsl.jpg'
        }
      }
      
      // Get file stats
      const bookPath = path.join(booksDir, bookFile)
      const stats = fs.statSync(bookPath)
      
      // Determine book category
      let category = 'other'
      const title = bookName.toLowerCase()
      if (title.includes('ذكاء') || title.includes('كمبيوتر') || title.includes('بيانات') || title.includes('تشفير')) {
        category = 'technology'
      } else if (title.includes('تاريخ') || title.includes('ثورة') || title.includes('حملة')) {
        category = 'history'
      } else if (title.includes('فلسفة') || title.includes('عقلانية') || title.includes('تفكير')) {
        category = 'philosophy'
      } else if (title.includes('فيزياء') || title.includes('أورام') || title.includes('علم')) {
        category = 'science'
      } else if (title.includes('دين') || title.includes('قرآن')) {
        category = 'religion'
      } else if (title.includes('أدب') || title.includes('قصص') || title.includes('شعر')) {
        category = 'literature'
      } else if (title.includes('اقتصاد') || title.includes('تجارة')) {
        category = 'economics'
      } else if (title.includes('سياسة') || title.includes('فرنسية')) {
        category = 'politics'
      }

      return {
        id: bookName,
        title: bookName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        pdf: `/books/${bookFile}`,
        cover: matchingCover ? `/covers/${matchingCover}` : null,
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        category
      }
    })
    
    // Sort books by title
    books.sort((a, b) => a.title.localeCompare(b.title, 'ar'))
    
    return NextResponse.json({
      books,
      total: books.length,
      withCovers: books.filter(book => book.cover).length,
      totalSize: books.reduce((total, book) => total + book.size, 0)
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    
  } catch (error) {
    console.error('Error scanning books:', error)
    return NextResponse.json(
      { error: 'Failed to scan books directory' }, 
      { status: 500 }
    )
  }
}
