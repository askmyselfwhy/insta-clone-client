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


workbox.routing.registerRoute('https://insta-clone-server1.herokuapp.com/posts', function(args) {
  return fetch(args.event.request)
    .then(function (res) {
      var clonedRes = res.clone();
      clearAllData('posts', function() {
        clonedRes.json().then(function (data) {
          for (var key in data) {
            let dataItem = data[key];
            dataItem.id = dataItem._id;
            writeData('posts', dataItem)
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

workbox.precaching.precacheAndRoute([]);

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

          let headers = new Headers();
          headers.append('Content-Type', 'multipart/form-data');
          headers.append('Accept', 'application/json');
          headers.append('Authorization', dt.headers.auth);
          headers.append('Origin','https://super-insta-clone.herokuapp.com/');

          fetch('https://insta-clone-server1.herokuapp.com/posts', {
            method: 'POST',
            body: postData,
            mode: 'cors',
            credentials: 'include',
            headers: headers
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
    data: typeof data.tag === 'new-post' ? { url: data.openUrl } : {}
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
