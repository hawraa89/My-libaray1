'use client'

import { useState } from 'react'

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { value: 'all', label: 'جميع الكتب', icon: '📚' },
    { value: 'technology', label: 'التكنولوجيا', icon: '💻' },
    { value: 'history', label: 'التاريخ', icon: '📜' },
    { value: 'philosophy', label: 'الفلسفة', icon: '🤔' },
    { value: 'science', label: 'العلوم', icon: '🔬' },
    { value: 'religion', label: 'الدين', icon: '🕌' },
    { value: 'literature', label: 'الأدب', icon: '📖' },
    { value: 'economics', label: 'الاقتصاد', icon: '💰' },
    { value: 'politics', label: 'السياسة', icon: '🏛️' }
  ]

  return (
    <div className="mb-8 max-w-2xl mx-auto">
      <div className="wooden-shelf rounded-lg p-4 gold-border">
        <h3 className="text-gold font-bold mb-4 text-center">التصفية حسب الفئة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => {
                setSelectedCategory(category.value)
                onCategoryChange(category.value)
              }}
              className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-gold text-wood-dark border-gold'
                  : 'bg-wood-dark border-gold/50 hover:border-gold hover:bg-wood/70'
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="text-xl mb-1">{category.icon}</span>
                <span className="text-sm">{category.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
