export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

//opens DB connection, connects to object store (storeName) then perform 
//---a transaction using method and object values. Wrap it all in a promise
//---to make it easier working with IndexedDB's asynchronous nature
export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    //open connection to the DB 'shop-shop' w/the version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    //create variables to hold ref. to the DB, transaction (tx), & object store
    let db, tx, store;

    //if version has changed or this is first time, run this method & create the object stores
    request.onupgradeneeded = function (e) {
      const db = request.result;
      //create object store for each type of data & set PK to be '_id' of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    //handle any connection errors
    request.onerror = function (e) {
      console.log('There was an error');
    };

    //on DB open success
    request.onsuccess = function (e) {
      //save a ref. of the DB to the 'db' variable
      db = request.result;

      //open a transaction do whatever is passed into 'storeName' (must match)
      tx = db.transaction(storeName, 'readwrite');

      //save a ref. to that object store
      store = tx.objectStore(storeName);

      db.onerror = function (e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;

        case 'get':
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;

        case 'delete':
          store.delete(object._id);
          break;

        default:
          console.log('No valid method');
          break;
      }

      //close connection when transaction is complete
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}