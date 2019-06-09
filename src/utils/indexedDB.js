

const indexedDb = window.indexedDB || window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

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

/*
dbRequest.onupgradeneeded = function(event) {
  db = event.target.result;
  if (db) {
    db.transaction('posts').objectStore('posts').onerror = function () {
      db.createObjectStore('posts', { keyPath: 'id' });
    }
    db.transaction('sync-posts').objectStore('sync-posts').onerror = function () {
      db.createObjectStore('sync-posts', { keyPath: 'id' });
    }
  }
}
*/



export function writeData(st, data) {
    var tx = db.transaction(st, 'readwrite');
    var store = tx.objectStore(st)
    store.put(data)
    .onsuccess = function(event) {
      console.log('Item added!');
    };
}

export function deleteItemFromData(st, id) {
  if (db) {
    var request = db.transaction(st, "readwrite")
    .objectStore(st)
    .delete(id);
    request.onsuccess = function(event) {
      console.log('Item deleted!');
    };
  }
}

export function readAllData(st) {
  var objectStore = db.transaction(st).objectStore(st);
  var posts = [];
  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      posts.push(cursor.value);
      cursor.continue();
    }
    else {
      console.log("Got all posts: " + posts);
    }
  };

  return posts;
}

export function clearAllData(st) {
  var objectStore = db.transaction(st).objectStore(st);
  var posts = [];

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      posts.push(cursor.key);
      cursor.continue();
    }
    else {
      alert("Got all posts: " + posts);
    }
  };

  for (let postKey of posts) {
    var request = objectStore.delete(postKey);
    request.onsuccess = function(event) {
      console.log('Item' + postKey + 'deleted!');
    };
  }
}




/*
var dbPromise = openDB('posts-store', 1, function (db) {
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', {keyPath: 'id'});
  }
  if (!db.objectStoreNames.contains('sync-posts')) {
    db.createObjectStore('sync-posts', {keyPath: 'id'});
  }
});

function writeData(st, data) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore(st);
      store.put(data);
      return tx.complete;
    });
}

function readAllData(st) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readonly');
      var store = tx.objectStore(st);
      return store.getAll();
    });
}

function clearAllData(st) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore(st);
      store.clear();
      return tx.complete;
    });
}

function deleteItemFromData(st, id) {
  dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(function() {
      console.log('Item deleted!');
    });
}
*/


/*
import { openDB, deleteDB, wrap, unwrap } from 'idb';

var dbPromise = openDB('posts-store', 1, function (db) {
  console.log(db);
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', {keyPath: 'id'});
  }
  if (!db.objectStoreNames.contains('sync-posts')) {
    db.createObjectStore('sync-posts', {keyPath: 'id'});
  }
});

export function writeData(st, data) {
  console.log(process.env)
  console.log(dbPromise)
  return dbPromise
    .then(function(db) {
      console.log(db)
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore(st);
      store.put(data);
      return tx.complete;
    });
}

export function readAllData(st) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readonly');
      var store = tx.objectStore(st);
      return store.getAll();
    });
}

export function clearAllData(st) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore(st);
      store.clear();
      return tx.complete;
    });
}

export function deleteItemFromData(st, id) {
  dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(function() {
      console.log('Item deleted!');
    });
}

*/