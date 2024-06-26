let db;

abrirBaseDeDatos("ActividadDatabase", 1)
  .then((database) => {
    db = database;
    obtenerUltimoRegistro();
    setFechaPorDefecto();
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function obtenerUltimoRegistro() {
  let transaction = db.transaction(["ActividadStore"], "readonly");
  let objectStore = transaction.objectStore("ActividadStore");

  objectStore.openCursor(null, "prev").onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      let registro = cursor.value;
      document
        .getElementById("fechaActividadForm")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          const fechaActividad =
            document.getElementById("fechaActividad").value;

          const today = new Date().toISOString().split("T")[0];
          if (fechaActividad > today) {
            alert("La fecha de actividad no puede ser futura.");
            return;
          }

          let transaction = db.transaction(["ActividadStore"], "readwrite");
          let objectStore = transaction.objectStore("ActividadStore");

          registro.fechaActividad = fechaActividad;
          objectStore.put(registro).onsuccess = function (event) {
            console.log("Fecha de actividad guardada.");
            window.location.href = "caloriasQuemadas.html";
          };
        });
    }
  };
}

function setFechaPorDefecto() {
  const today = new Date().toISOString().split("T")[0];
  const fechaActividadInput = document.getElementById("fechaActividad");
  fechaActividadInput.value = today;
  fechaActividadInput.setAttribute("max", today);
}

document
  .getElementById("fechaActividad")
  .addEventListener("input", function () {
    const today = new Date().toISOString().split("T")[0];
    if (this.value > today) {
      alert("La fecha de actividad no puede ser futura.");
      this.value = today;
    }
  });
