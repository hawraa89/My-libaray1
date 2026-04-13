'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Book {
  id: string
  title: string
  pdf: string
  cover: string
  size: number
  lastModified: string
}

interface BooksResponse {
  books: Book[]
  total: number
  withCovers: number
  totalSize: number
}

import CategoryFilter from '../components/CategoryFilter'

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stats, setStats] = useState<{ total: number; withCovers: number; totalSize: number } | null>(null)

  useEffect(() => {
    // Simple hardcoded book list to bypass API loading issue
    const hardcodedBooks: Book[] = [
      {
        id: 'أخلاقيات_الذكاء_الاصطناعي',
        title: 'أخلاقيات الذكاء الاصطناعي',
        pdf: '/books/أخلاقيات_الذكاء_الاصطناعي.pdf',
        cover: '/covers/أخلاقيات_الذكاء_الاصطناعي.jpg',
        size: 1118218,
        lastModified: new Date().toISOString()
      },
      {
        id: 'الأورام',
        title: 'الأورام',
        pdf: '/books/الأورام.pdf',
        cover: '/covers/الأورام.jpg',
        size: 16303209,
        lastModified: new Date().toISOString()
      },
      {
        id: 'البيانات_الضخمة',
        title: 'البيانات الضخمة',
        pdf: '/books/البيانات_الضخمة.pdf',
        cover: '/covers/البيانات_الضخمة.jpg',
        size: 1356842,
        lastModified: new Date().toISOString()
      },
      {
        id: 'التبصر_بالتجارة',
        title: 'التبصر بالتجارة',
        pdf: '/books/التبصُّر_بالتجارة.pdf',
        cover: '/covers/التبصر_بالتجارة.jpg',
        size: 803137,
        lastModified: new Date().toISOString()
      },
      {
        id: 'التراث_والثورة',
        title: 'التراث والثورة',
        pdf: '/books/التراث_والثورة.pdf',
        cover: '/covers/التراث_والثورة.jpg',
        size: 3239773,
        lastModified: new Date().toISOString()
      },
      {
        id: 'التفكير_والاستدلال',
        title: 'التفكير والاستدلال',
        pdf: '/books/التفكير_والاستدلال.pdf',
        cover: '/covers/التفكير_والاستدلال.jpg',
        size: 19227944,
        lastModified: new Date().toISOString()
      },
      {
        id: 'الثورة_البيضاء',
        title: 'الثورة البيضاء',
        pdf: '/books/الثورة_البيضاء.pdf',
        cover: '/covers/الثورة_البيضاء.jpg',
        size: 1637291,
        lastModified: new Date().toISOString()
      },
      {
        id: 'الثورة_المغدورة',
        title: 'الثورة المغدورة',
        pdf: '/books/الثورة_المغدورة.pdf',
        cover: '/covers/الثورة_المغدورة.jpg',
        size: 17160320,
        lastModified: new Date().toISOString()
      },
      {
        id: 'الحملة_الفرنسية_وخروج_الفرنسيين_من_مصر',
        title: 'الحملة الفرنسية وخروج الفرنسيين من مصر',
        pdf: '/books/الحملة_الفرنسية_وخروج_الفرنسيين_من_مصر.pdf',
        cover: '/covers/الحملة_الفرنسية_وخروج_الفرنسيين_من_مصر.jpg',
        size: 5535891,
        lastModified: new Date().toISOString()
      },
      {
        id: 'الدماغ_المُبتكِر',
        title: 'الدماغ المُبتكِر',
        pdf: '/books/الدماغ_المُبتكِر.pdf',
        cover: '/covers/الدماغ_المُبتكِر.jpg',
        size: 43154105,
        lastModified: new Date().toISOString()
      },
      {
        id: 'العقلانية',
        title: 'العقلانية',
        pdf: '/books/العقلانية.pdf',
        cover: '/covers/العقلانية.jpg',
        size: 17617804,
        lastModified: new Date().toISOString()
      },
            {
        id: 'الفيزياء_الفلكية',
        title: 'الفيزياء الفلكية',
        pdf: '/books/الفيزياء_الفلكية.pdf',
        cover: '/covers/الفيزياء_الفلكية.jpg',
        size: 19714506,
        lastModified: new Date().toISOString()
      },
      {
        id: 'الفيزياء_والفلسفة',
        title: 'الفيزياء والفلسفة',
        pdf: '/books/الفيزياء_والفلسفة.pdf',
        cover: '/covers/الفيزياء_والفلسفة.jpg',
        size: 7499883,
        lastModified: new Date().toISOString()
      },
            {
        id: 'تفاعل_متسلسل',
        title: 'تفاعل متسلسل',
        pdf: '/books/تفاعل_متسلسل.pdf',
        cover: '/covers/تفاعل_متسلسل.jpg',
        size: 10345474,
        lastModified: new Date().toISOString()
      },
      {
        id: 'ثقافة_النظام_العشوائي',
        title: 'ثقافة النظام العشوائي',
        pdf: '/books/ثقافة_النظام_العشوائي.pdf',
        cover: '/covers/ثقافة_النظام_العشوائي.jpg',
        size: 2910338,
        lastModified: new Date().toISOString()
      },
      {
        id: 'ذكاء_اصطناعي_متوافق_مع_البشر',
        title: 'ذكاء اصطناعي متوافق مع البشر',
        pdf: '/books/ذكاء_اصطناعي_متوافق_مع_البشر.pdf',
        cover: '/covers/ذكاء_اصطناعي_متوافق_مع_البشر.jpg',
        size: 16223300,
        lastModified: new Date().toISOString()
      },
      {
        id: 'شفاء',
        title: 'شفاء',
        pdf: '/books/شفاء.pdf',
        cover: '/covers/شفاء.jpg',
        size: 1739991,
        lastModified: new Date().toISOString()
      },
      {
        id: 'علم_التشفير',
        title: 'علم التشفير',
        pdf: '/books/علم_التشفير.pdf',
        cover: '/covers/علم_التشفير.jpg',
        size: 12891137,
        lastModified: new Date().toISOString()
      },
      {
        id: 'كشف_الحلقة_المفقودة_بين_أديان_التعدد_والتوحيد',
        title: 'كشف الحلقة المفقودة بين أديان التعدد والتوحيد',
        pdf: '/books/كشف_الحلقة_المفقودة_بين_أديان_التعدد_والتوحيد.pdf',
        cover: '/covers/كشف_الحلقة_المفقودة_بين_أديان_التعدد_والتوحيد.jpg',
        size: 13006973,
        lastModified: new Date().toISOString()
      },
      {
        id: 'نظرة_جديدة_للقرآن',
        title: 'نظرة جديدة للقرآن',
        pdf: '/books/نظرة_جديدة_للقرآن.pdf',
        cover: '/covers/نظرة_جديدة_للقرآن.jpg',
        size: 936885,
        lastModified: new Date().toISOString()
      },
      {
        id: 'نقد_الاقتصاد_السياسي',
        title: 'نقد الاقتصاد السياسي',
        pdf: '/books/نقد_الاقتصاد_السياسي.pdf',
        cover: '/covers/نقد_الاقتصاد_السياسي.jpg',
        size: 10145551,
        lastModified: new Date().toISOString()
      }
    ]

    setBooks(hardcodedBooks)
    setFilteredBooks(hardcodedBooks)
    setStats({
      total: hardcodedBooks.length,
      withCovers: hardcodedBooks.filter(book => book.cover).length,
      totalSize: hardcodedBooks.reduce((total, book) => total + book.size, 0)
    })
    setLoading(false)
  }, [])

  // Filter functionality (search + category)
  useEffect(() => {
    let filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => {
        const title = book.title.toLowerCase()
        const id = book.id.toLowerCase()
        
        switch (selectedCategory) {
          case 'technology':
            return title.includes('ذكاء') || title.includes('كمبيوتر') || 
                   title.includes('بيانات') || title.includes('تشفير') ||
                   id.includes('dhaka') || id.includes('byanat')
          case 'history':
            return title.includes('تاريخ') || title.includes('ثورة') || 
                   title.includes('حملة') || title.includes('فرنسية') ||
                   id.includes('tarikh') || id.includes('thawra')
          case 'philosophy':
            return title.includes('فلسفة') || title.includes('عقلانية') ||
                   title.includes('تفكير') || id.includes('fikr')
          case 'science':
            return title.includes('فيزياء') || title.includes('أورام') ||
                   title.includes('علم') || id.includes('ilm')
          case 'religion':
            return title.includes('دين') || title.includes('قرآن') ||
                   id.includes('din') || id.includes('quran')
          case 'literature':
            return title.includes('أدب') || title.includes('شعر') ||
                   title.includes('قصص') || id.includes('adab')
          case 'economics':
            return title.includes('اقتصاد') || title.includes('تجارة') ||
                   id.includes('iqtisad') || id.includes('tijara')
          case 'politics':
            return title.includes('سياسة') || title.includes('سياسة') ||
                   id.includes('siyasa')
          default:
            return true
        }
      })
    }

    setFilteredBooks(filtered)
  }, [books, searchTerm, selectedCategory])

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wood">
        <div className="text-gold text-2xl arabic-text">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wood arabic-text">
      {/* Header */}
      <header className="wooden-shelf border-b-4 border-gold py-8 px-4">
        <div className="container mx-auto">
          <h1 className="royal-heading">المكتبة الملكية</h1>
          <p className="text-gold-light text-center text-lg">
            مجموعة ثمينة من الكتب القيمة في مكتبة رقمية كلاسيكية
          </p>
        </div>
      </header>
      
      {/* Category Filter */}
      <CategoryFilter 
        onCategoryChange={(category) => setSelectedCategory(category)}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <div key={book.id} className="relative group">
                {/* Shelf Effect */}
                <div className="wooden-shelf h-2 w-full mb-2 rounded-full"></div>
                
                {/* Book with Direct PDF Link */}
                <Link 
                  href={book.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="book-cover cursor-pointer relative h-64 sm:h-72 bg-wood-dark gold-border p-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/50">
                    {book.cover ? (
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gold p-4">
                        <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <p className="text-xs text-center line-clamp-3">{book.title}</p>
                      </div>
                    )}
                    
                    {/* Enhanced Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                      <div className="text-gold text-sm">
                        <p className="font-bold mb-1 line-clamp-2">{book.title}</p>
                        <div className="flex justify-between items-center text-xs text-gold-light">
                          <span>{formatFileSize(book.size)}</span>
                          <span className="bg-gold/20 px-2 py-1 rounded">Open PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Enhanced Book Spine Effect */}
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-r from-black via-gold/20 to-transparent opacity-50"></div>
                
                {/* Book Title Below */}
                <div className="mt-2 text-center">
                  <p className="text-gold text-xs sm:text-sm font-medium line-clamp-2 px-2">
                    {book.title}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gold-light mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <p className="text-xl text-gold">لا توجد نتائج</p>
                <p className="text-gold-light mt-2">جرب كلمات مختلفة أو تحقق من التهجئة</p>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mt-12 sm:mt-16 wooden-shelf rounded-lg p-4 sm:p-6 gold-border">
            <h2 className="text-xl sm:text-2xl font-bold text-gold mb-4 sm:mb-6 text-center">إحصائيات المكتبة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="text-gold-light p-3 sm:p-4">
                <p className="text-2xl sm:text-3xl font-bold text-gold">{stats.total}</p>
                <p className="text-sm sm:text-base">إجمالي الكتب</p>
              </div>
              <div className="text-gold-light p-3 sm:p-4">
                <p className="text-2xl sm:text-3xl font-bold text-gold">{stats.withCovers}</p>
                <p className="text-sm sm:text-base">الكتب مع الأغلفة</p>
              </div>
              <div className="text-gold-light p-3 sm:p-4">
                <p className="text-2xl sm:text-3xl font-bold text-gold">{formatFileSize(stats.totalSize)}</p>
                <p className="text-sm sm:text-base">إجمالي الحجم</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Book Modal */}
      {selectedBook && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBook(null)}
        >
          <div 
            className="wooden-shelf rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto gold-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gold">{selectedBook.title}</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gold hover:text-gold-light text-2xl"
                >
                  ×
                </button>
              </div>
              
              {selectedBook.cover && (
                <div className="relative h-64 mb-4 rounded overflow-hidden gold-border">
                  <Image
                    src={selectedBook.cover}
                    alt={selectedBook.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              
              <div className="text-gold-light mb-4">
                <p>الحجم: {formatFileSize(selectedBook.size)}</p>
              </div>
              
              <div className="flex gap-3 mb-4">
                <a
                  href={selectedBook.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gold text-wood-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors duration-300 text-center"
                >
                  قراءة الكتاب
                </a>
                <a
                  href={selectedBook.pdf}
                  download={selectedBook.title + '.pdf'}
                  className="flex-1 bg-gold-light text-wood-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold transition-colors duration-300 text-center"
                >
                  تحميل PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
