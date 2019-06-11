

var indexedDb = self.indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;

var db;
var dbRequest = indexedDb.open("posts-store", 1);
dbRequest.onsuccess = function(event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('sync-posts')) {
    db.createObjectStore('sync-posts', { keyPath: 'id' });
  }
}
dbRequest.onupgradeneeded  = function(event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('sync-posts')) {
    db.createObjectStore('sync-posts', { keyPath: 'id' });
  }
}
dbRequest.onerror = function(event) {
  console.log("Database error: " + event.target.errorCode); 
}

function writeData(st, data) {
  if (db) {
    var tx = db.transaction(st, 'readwrite');
    var store = tx.objectStore(st);
    store.put(data)
    .onsuccess = function(event) {
      console.log('Item added!');
    };
  }
}

function deleteItemFromData(st, id) {
  if (db) {
    var tx = db.transaction(st, "readwrite");
    var store = tx.objectStore(st);
    store
    .delete(id)
    .onsuccess = function(event) {
      console.log('Item deleted!');
    };
  }
}

function readAllData(st, cb) {
  var objectStore = db.transaction(st).objectStore(st);
  var posts = [];

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      posts.push(cursor.value);
      cursor.continue();
    }
    else {
      cb(posts);
    }
  };
}

function clearAllData(st, cb) {
  var objectStore = db.transaction(st).objectStore(st);
  var posts = [];

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      posts.push(cursor.key);
      cursor.continue();
    }
  };

  for (let postKey of posts) {
    var request = objectStore.delete(postKey);
    request.onsuccess = function(event) {
      console.log('Item' + postKey + 'deleted!');
    };
  }
  cb();
}
