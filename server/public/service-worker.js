
self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open('app-cache').then(function (cache) {
        return cache.addAll([
          // Add paths to static assets you want to cache
          '/',
          '/style.css',
          '/chat.css',
          '/notfound.css',
          '/script.js',
          '/loginbundle.js',
          '/registerbundle.js',
          '/assets/bot.png',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  });
  