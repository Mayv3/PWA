let db;

abrirBaseDeDatos("ActividadDatabase", 1, "ActividadStore")
  .then((database) => {
    db = database;
    document
      .getElementById("tipoActividadForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const tipoActividad = document.getElementById("tipoActividad").value;
        let transaction = db.transaction(["ActividadStore"], "readwrite");
        let objectStore = transaction.objectStore("ActividadStore");

        objectStore.add({ tipoActividad: tipoActividad }).onsuccess = function (
          event
        ) {
          console.log("Tipo de actividad guardado.");
          window.location.href = "duracion.html";
        };
      });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
