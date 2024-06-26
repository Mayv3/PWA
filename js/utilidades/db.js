function abrirBaseDeDatos(nombreDB, version, storeName) {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open(nombreDB, version);

    request.onerror = function (event) {
      console.error("Error al abrir la base de datos:", event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      console.log(`Almacén de objetos ${storeName} creado correctamente.`);
    };

    request.onsuccess = function (event) {
      let db = event.target.result;
      console.log(`Base de datos ${nombreDB} abierta correctamente.`);
      resolve(db);
    };
  });
}
