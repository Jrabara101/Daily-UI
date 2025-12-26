import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import PressCard from './PressCard'
import { useDebounce } from '../hooks/useDebounce'

function PressFeed({ releases }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Get unique categories and years
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(releases.map(r => r.category))]
    return cats
  }, [releases])

  const years = useMemo(() => {
    const yrs = ['All', ...new Set(releases.map(r => new Date(r.date).getFullYear().toString()))].sort((a, b) => {
      if (a === 'All') return -1
      if (b === 'All') return 1
      return parseInt(b) - parseInt(a)
    })
    return yrs
  }, [releases])

  // Filter releases
  const filteredReleases = useMemo(() => {
    return releases.filter(release => {
      // Search filter
      const matchesSearch = debouncedSearch === '' || 
        release.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        release.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        release.content?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        release.tags?.some(tag => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory === 'All' || release.category === selectedCategory

      // Year filter
      const releaseYear = new Date(release.date).getFullYear().toString()
      const matchesYear = selectedYear === 'All' || releaseYear === selectedYear

      return matchesSearch && matchesCategory && matchesYear
    })
  }, [releases, debouncedSearch, selectedCategory, selectedYear])

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search press releases..."
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent focus-visible-ring"
            aria-label="Search press releases"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors focus-visible-ring rounded"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible-ring ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Year:</span>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible-ring ${
                    selectedYear === year
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={selectedYear === year}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {filteredReleases.length} of {releases.length} press releases
        </div>
      </div>

      {/* Press Releases Grid */}
      {filteredReleases.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReleases.map((release) => (
            <PressCard key={release.id} release={release} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-2">No press releases found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default PressFeed

