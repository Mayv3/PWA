function ultimoImc(db) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(["IMCStore"], "readonly");
    let objectStore = transaction.objectStore("IMCStore");

    let ultimoRegistro = objectStore.openCursor(null, "prev");

    ultimoRegistro.onsuccess = function (event) {
      let cursor = event.target.result;
      if (cursor) {
        resolve(cursor.value);
      } else {
        resolve(null);
      }
    };

    ultimoRegistro.onerror = function (event) {
      console.error("Error al obtener el último registro:", event.target.error);
      reject(event.target.error);
    };
  });
}
