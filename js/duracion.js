let db;

let duracionInput = document.getElementById("duracion");

function obtenerUltimoRegistro(db) {
  let transaction = db.transaction(["ActividadStore"], "readonly");
  let objectStore = transaction.objectStore("ActividadStore");

  objectStore.openCursor(null, "prev").onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      let registro = cursor.value;
      document
        .getElementById("duracionForm")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          const duracion = document.getElementById("duracion").value;

          let transaction = db.transaction(["ActividadStore"], "readwrite");
          let objectStore = transaction.objectStore("ActividadStore");

          registro.duracion = duracion;
          objectStore.put(registro).onsuccess = function (event) {
            console.log("Duración guardada.");
            window.location.href = "fechaActividad.html";
          };
        });
    }
  };
}

abrirBaseDeDatos("ActividadDatabase", 1, "ActividadStore")
  .then((database) => {
    db = database;
    obtenerUltimoRegistro(db);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

duracionInput.addEventListener("input", () => {
  if (duracionInput.value < 0) {
    duracionInput.value = 0;
  }
  if (duracionInput.value > 360) {
    duracionInput.value = 360;
  }
  if (duracionInput.value === "" || duracionInput.value === 0) {
    return;
  }
});
