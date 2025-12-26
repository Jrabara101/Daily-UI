import { useEffect } from 'react'

export function useSEO({ title, description, keywords, ogTitle, ogDescription, canonical }) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    if (description) {
      metaDescription.setAttribute('content', description)
    }

    // Update or create meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', keywords)
    }

    // Update Open Graph tags
    if (ogTitle) {
      let ogTitleTag = document.querySelector('meta[property="og:title"]')
      if (!ogTitleTag) {
        ogTitleTag = document.createElement('meta')
        ogTitleTag.setAttribute('property', 'og:title')
        document.head.appendChild(ogTitleTag)
      }
      ogTitleTag.setAttribute('content', ogTitle)
    }

    if (ogDescription) {
      let ogDescTag = document.querySelector('meta[property="og:description"]')
      if (!ogDescTag) {
        ogDescTag = document.createElement('meta')
        ogDescTag.setAttribute('property', 'og:description')
        document.head.appendChild(ogDescTag)
      }
      ogDescTag.setAttribute('content', ogDescription)
    }

    // Update canonical link
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]')
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.setAttribute('href', canonical)
    }

    // Add structured data
    let structuredData = document.querySelector('script[type="application/ld+json"]')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.setAttribute('type', 'application/ld+json')
      document.head.appendChild(structuredData)
    }
  }, [title, description, keywords, ogTitle, ogDescription, canonical])
}

