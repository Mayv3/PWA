function mostrarUltimoRegistro(db) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(["ActividadStore"], "readonly");
    let objectStore = transaction.objectStore("ActividadStore");

    let request = objectStore.openCursor(null, "prev");

    request.onsuccess = function (event) {
      let cursor = event.target.result;
      if (cursor) {
        let registro = cursor.value;
        let caloriasQuemadasDiv = document.getElementById("caloriasQuemadas");
        caloriasQuemadasDiv.innerHTML = `
              <p>Tipo de Actividad: <span>${registro.tipoActividad}</span></p>
              <p>Duración: <span>${registro.duracion} minutos</span> </p>
              <p>Calorías Quemadas: <span>${registro.caloriasQuemadas?.toFixed(
                2
              )}</span></p>
              <p class="fs-2">Fecha: <span>${registro.fechaActividad}</span></p>
            `;
        resolve(registro);
      } else {
        let caloriasQuemadasDiv = document.getElementById("caloriasQuemadas");
        caloriasQuemadasDiv.innerHTML = `
              <p>No hay ningun registro guardado</p>
            `;
        resolve(null);
      }
    };

    request.onerror = function (event) {
      console.error("Error al obtener el último registro:", event.target.error);
      reject(event.target.error);
    };
  });
}
