let db;

function guardarCaloriasQuemadas() {
  let transaction = db.transaction(["ActividadStore"], "readwrite");
  let objectStore = transaction.objectStore("ActividadStore");

  objectStore.openCursor(null, "prev").onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      let registro = cursor.value;
      registro.caloriasQuemadas = calcularCaloriasQuemadas(
        registro.tipoActividad,
        registro.duracion
      );
      objectStore.put(registro).onsuccess = function (event) {
        console.log("Calorías quemadas guardadas.");
        mostrarUltimoRegistro(db);
      };
    } else {
      console.log("No hay registros en la base de datos.");
    }
  };
  objectStore.openCursor().onerror = function (event) {
    console.error(
      "Error al guardar las calorías quemadas:",
      event.target.error
    );
  };
}

abrirBaseDeDatos("ActividadDatabase", 1)
  .then((database) => {
    db = database;
    guardarCaloriasQuemadas();
    mostrarUltimoRegistro(db);
    mostrarToast("Calorías quemadas guardadas.", "green");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
