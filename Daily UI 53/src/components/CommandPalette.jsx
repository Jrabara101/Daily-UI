import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Fuse from 'fuse.js'
import Icon from './Icon'
import { getAllNavigationItems } from '../data/navigationData'
import { KEYBOARD_KEYS, getNavigationDirection, trapFocus } from '../utils/keyboardNavigation'

export default function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)

  const allItems = useMemo(() => getAllNavigationItems(), [])

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(allItems, {
        keys: ['label', 'category'],
        threshold: 0.3, // Lower = more strict, Higher = more fuzzy
        includeScore: true,
      }),
    [allItems]
  )

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      // Show all items grouped by category when no query
      const grouped = {}
      allItems.forEach((item) => {
        if (!grouped[item.category]) {
          grouped[item.category] = []
        }
        grouped[item.category].push(item)
      })
      return Object.entries(grouped).flatMap(([category, items]) => [
        { type: 'category', label: category },
        ...items,
      ])
    }

    const results = fuse.search(query)
    return results.map((result) => result.item)
  }, [query, fuse, allItems])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredItems.length, query])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      // Trap focus
      if (resultsRef.current) {
        return trapFocus(resultsRef.current)
      }
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === KEYBOARD_KEYS.ESCAPE) {
      onClose()
      return
    }

    if (e.key === KEYBOARD_KEYS.ARROW_DOWN) {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      )
      return
    }

    if (e.key === KEYBOARD_KEYS.ARROW_UP) {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      return
    }

    if (e.key === KEYBOARD_KEYS.ENTER) {
      e.preventDefault()
      const selectedItem = filteredItems[selectedIndex]
      if (selectedItem && selectedItem.path) {
        handleSelect(selectedItem)
      }
    }
  }

  const handleSelect = (item) => {
    if (item.path && onNavigate) {
      onNavigate(item.path)
    }
    onClose()
    setQuery('')
  }

  // Group items by category for display
  const groupedItems = useMemo(() => {
    if (query.trim()) return filteredItems

    const grouped = {}
    filteredItems.forEach((item) => {
      if (item.type === 'category') {
        grouped[item.label] = []
      } else {
        const category = Object.keys(grouped).pop()
        if (category) {
          grouped[category].push(item)
        }
      }
    })
    return grouped
  }, [filteredItems, query])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[20vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <Icon name="Search" className="text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or navigate..."
            className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-lg"
          />
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          className="max-h-[400px] overflow-y-auto"
          tabIndex={-1}
        >
          {filteredItems.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500">
              <Icon name="SearchX" className="mx-auto mb-2 text-gray-400" size={32} />
              <p>No results found</p>
            </div>
          ) : query.trim() ? (
            // Flat list when searching
            <ul className="py-2">
              {filteredItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleSelect(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      index === selectedIndex ? 'bg-blue-50' : ''
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      className={
                        index === selectedIndex ? 'text-blue-600' : 'text-gray-400'
                      }
                      size={18}
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          index === selectedIndex ? 'text-blue-600' : 'text-gray-900'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.category}
                      </div>
                    </div>
                    <Icon
                      name="ArrowRight"
                      className="text-gray-400"
                      size={16}
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            // Grouped list when no query
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {category}
                </div>
                <ul>
                  {items.map((item, index) => {
                    const flatIndex = filteredItems.findIndex((i) => i.id === item.id)
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleSelect(item)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            flatIndex === selectedIndex ? 'bg-blue-50' : ''
                          }`}
                        >
                          <Icon
                            name={item.icon}
                            className={
                              flatIndex === selectedIndex
                                ? 'text-blue-600'
                                : 'text-gray-400'
                            }
                            size={18}
                          />
                          <span
                            className={
                              flatIndex === selectedIndex
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-900'
                            }
                          >
                            {item.label}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">
                ↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">
                Enter
              </kbd>
              <span>Select</span>
            </div>
          </div>
          <span>{filteredItems.length} results</span>
        </div>
      </div>
    </div>,
    document.body
  )
}

