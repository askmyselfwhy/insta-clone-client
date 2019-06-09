//importScripts('https://unpkg.com/idb?module');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
importScripts('/js/utils.js');

workbox.routing.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workbox.strategies.staleWhileRevalidate({
  cacheName: 'google-fonts',
  cacheExpiration: {
    maxEntries: 3,
    maxAgeSeconds: 60 * 60 * 24 * 30
  }
}));

workbox.routing.registerRoute(/.*(?:firebasestorage\.googleapis)\.com.*$/, workbox.strategies.staleWhileRevalidate({
  cacheName: 'post-images'
}));


workbox.routing.registerRoute('http://localhost:3012/posts', function(args) {
  return fetch(args.event.request)
    .then(function (res) {
      var clonedRes = res.clone();
      clearAllData('posts', function() {
        clonedRes.json().then(function (data) {
          for (var key in data) {
            const dataItem = data[key];
            writeData('posts', { id: dataItem._id, ...dataItem})
          }
        });
      })
      return res;
    });
});

workbox.routing.registerRoute(function (routeData) {
  return (routeData.event.request.headers.get('accept').includes('text/html'));
}, function(args) {
  return caches.match(args.event.request)
    .then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(args.event.request)
          .then(function (res) {
            return caches.open('dynamic')
              .then(function (cache) {
                cache.put(args.event.request.url, res.clone());
                return res;
              })
          })
          .catch(function (err) {
            return caches.match('/offline.html')
              .then(function (res) {
                return res;
              });
          });
      }
    })
});

workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "727099aa8e165c4216c0307c76e77188"
  },
  {
    "url": "js/utils.js",
    "revision": "b627073975cbdc921009bf72de287dcb"
  },
  {
    "url": "precache-manifest.0355b27dc7bf42a59020577da1c25b44.js",
    "revision": "0355b27dc7bf42a59020577da1c25b44"
  },
  {
    "url": "service-worker.js",
    "revision": "f2ea38c70715d31def8c178436665c74"
  },
  {
    "url": "static/css/2.33bbdc9a.chunk.css",
    "revision": "96d9a602d8f13557182ec8e045b29f1b"
  },
  {
    "url": "static/css/main.2f434df9.chunk.css",
    "revision": "bfa7c2f21d92fb4b143d99cd85cb6e7a"
  },
  {
    "url": "static/js/2.da03e1bf.chunk.js",
    "revision": "dd72ae01b059132406078648eeff5409"
  },
  {
    "url": "static/js/main.a24a5003.chunk.js",
    "revision": "3f8b0cb2bb85cc0e87877994580f2ffc"
  },
  {
    "url": "static/js/runtime~main.a8a9905a.js",
    "revision": "238c9148d722c1b6291779bd879837a1"
  }
]);

self.addEventListener('sync', function(event) {
  console.log('[Service Worker] Background syncing', event);
  if (event.tag === 'sync-new-posts') {
    console.log('[Service Worker] Syncing new Posts');
    event.waitUntil(
      readAllData('sync-posts', function(data) {
        for (var dt of data) {
          var postData = new FormData();
          postData.append('id', dt.id);
          postData.append('user_id', dt.user_id);
          postData.append('title', dt.title);
          postData.append('location', dt.location);
          postData.append('description', dt.description);
          postData.append('locationCoordinates', dt.locationCoordinates);
          postData.append(dt.id + '.png', dt.image_data, dt.id + '.png');

          fetch('http://localhost:3012/posts', {
            method: 'POST',
            headers: {
              ...dt.headers
            },
            body: postData
          })
          .then(function(res) {
            if (res.ok) {
              res.json()
                .then(function(resData) {
                  deleteItemFromData('sync-posts', resData.id);
                });
            }
          })
          .catch(function(err) {
            console.log('Error while sending data', err);
          });
        }
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var action = event.action;
  if (action === 'confirm') {
    notification.close();
  } else {
    console.log(action);
    event.waitUntil(
      clients.matchAll()
        .then(function(clis) {
          var client = clis.find(function(c) {
            return c.visibilityState === 'visible';
          });
          if (client !== undefined) {
            client.navigate(notification.data.url);
            client.focus();
          } else {
            clients.openWindow(notification.data.url);
          }
          notification.close();
        })
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log('Notification was closed', event);
});

self.addEventListener('push', function(event) {
  console.log('Push Notification received', event);
  var data = {title: 'New post!', description: 'New post was added!', openUrl: '/', tag: 'new-post'};
  if (event.data) {
    data = JSON.parse(event.data.text());
  }
  var options = {
    body: data.description,
    icon: '/icons/app-icon-96x96.png',
    badge: '/icons/app-icon-96x96.png',
    data: {
      ...(typeof data.tag === 'new-post' ? {
        url: data.openUrl
      } : {})
    }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
