const staticCacheName = 'site-static-v1'
const assets = [
	'.',
	'index.html',
	'app.js',
	'images/icon.png',
	'css/style.css',
	'images/icons/icon-128x128.png',
	'images/icons/icon-192x192.png'
]
// сщбытие install (вызывается при установке)
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			console.log('Кеширование ресурсов')
			cache.addAll(assets)
		})
	)
})

// событие activate (выбор версии кеша, обновление кеша)
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== staticCacheName)
				.map(key => caches.delete(key))
			);
		})
	)
})

// событие fetch (вызывается при любом запросе к серверу)
self.addEventListener('fetch', evt => {
	// если файл есть в кеше, то выдать из него. иначе обратиться к серверу
	evt.respondWith(
		caches.match(evt.request).then(cacheRes => {
			return cacheRes || fetch(evt.request)
		})
	)
})