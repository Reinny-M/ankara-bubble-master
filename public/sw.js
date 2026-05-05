// Service Worker for Ankara Bubble PWA
const CACHE_NAME = 'ankara-bubble-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  // Add other static assets as needed
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Cache installation failed:', error)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip external requests (Clerk, Convex, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        return fetch(event.request)
          .then((response) => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch((error) => {
            console.error('Fetch failed:', error)
            // Return a fallback response for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/') || new Response('Network error', { status: 408 })
            }
            throw error
          })
      })
      .catch((error) => {
        console.error('Cache match failed:', error)
        // Return a fallback response for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/') || new Response('Network error', { status: 408 })
        }
        throw error
      })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            // Deleting old cache
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
