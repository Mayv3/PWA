let db;

abrirBaseDeDatos("ActividadDatabase", 1, "ActividadStore")
  .then((database) => {
    db = database;
    obtenerTodosLosRegistros();
  })
  .catch((error) => console.error("Error:", error));

function mostrarRegistrosEnLista(registros) {
  const lista = document.getElementById("listaRegistros");
  lista.innerHTML = registros
    .map(
      (registro) =>
        `
      <li class="list-group-item bg-primary text-light p-5 border-bottom li-registro">
      <div class="d-flex flex-column">
        <div class="w-100">
          <div class="d-flex mb-4 align-items-center">
            <img class="icon" src="img/actividad-fisica.png" alt="Tipo de Actividad">
            <p class="mb-0 ml-2"><strong>Tipo de Actividad:</strong> ${
              registro.tipoActividad
            }</p>
          </div>
          <div class="d-flex mb-4 align-items-center">
            <img class="icon" src="img/duracion.png" alt="Duración">
            <p class="mb-0 ml-2"><strong>Duración:</strong> ${
              registro.duracion
            } minutos</p>
          </div>
          <div class="d-flex mb-4 align-items-center">
            <img class="icon" src="img/calorias.png" alt="Calorías Quemadas">
            <p class="mb-0 ml-2"><strong>Calorías Quemadas:</strong> ${Number(
              registro.caloriasQuemadas
            ).toFixed(0)}</p>
          </div>
          <div class="d-flex mb-4 align-items-center">
            <img class="icon" src="img/calendar.png" alt="Fecha">
            <p class="mb-0 ml-2"><strong>Fecha:</strong> ${
              registro.fechaActividad
            }</p>
          </div>
        </div>
        <div class="w-100">
          <button class="btn btn-danger eliminar py-3 px-4 text-dark border-0 rounded-bottom-left rounded-bottom-right" data-id="${
            registro.id
          }">X</button>
          <button class="btn p-3 w-100" data-toggle="modal" data-target="#editModal" data-id="${
            registro.id
          }">Modificar</button>
        </div>
      </div>
    </li>
    
  `
    )
    .join("");
}

function obtenerTodosLosRegistros() {
  const transaction = db.transaction(["ActividadStore"], "readonly");
  const objectStore = transaction.objectStore("ActividadStore");
  const registros = [];

  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      registros.push(cursor.value);
      cursor.continue();
    } else {
      mostrarRegistrosEnLista(registros);
    }
  };

  objectStore.openCursor().onerror = (event) =>
    console.error("Error al obtener los registros:", event.target.error);
}

function eliminarRegistro(id) {
  const transaction = db.transaction(["ActividadStore"], "readwrite");
  const objectStore = transaction.objectStore("ActividadStore");

  objectStore.delete(id).onsuccess = () => {
    console.log(`Registro con id ${id} eliminado`);
    obtenerTodosLosRegistros();
    mostrarToast("Se ha eliminado un registro", "red");
  };

  objectStore.delete(id).onerror = (event) =>
    console.error("Error al eliminar el registro:", event.target.error);
}
function abrirModalModificar(event) {
  const id = event.relatedTarget.getAttribute("data-id");
  const transaction = db.transaction(["ActividadStore"], "readonly");
  const objectStore = transaction.objectStore("ActividadStore");

  objectStore.get(Number(id)).onsuccess = (event) => {
    const registro = event.target.result;
    document.getElementById("tipoActividad").value = registro.tipoActividad;
    document.getElementById("duracion").value = registro.duracion;
    document.getElementById("fechaActividad").value = registro.fechaActividad;
    document.getElementById("registroId").value = registro.id;

    const today = new Date().toISOString().split("T")[0];
    const fechaActividadInput = document.getElementById("fechaActividad");
    fechaActividadInput.setAttribute("max", today);

    const duracionInput = document.getElementById("duracion");
    duracionInput.addEventListener("input", () => {
      if (duracionInput.value < 0) {
        duracionInput.value = 0;
      }
      if (duracionInput.value > 360) {
        duracionInput.value = 360;
      }
    });
  };

  objectStore.get(Number(id)).onerror = (event) =>
    console.error("Error al obtener el registro:", event.target.error);
}
function guardarCambios() {
  const id = Number(document.getElementById("registroId").value);
  const tipoActividad = document.getElementById("tipoActividad").value;
  const duracion = Number(document.getElementById("duracion").value);
  const fechaActividad = document.getElementById("fechaActividad").value;
  const caloriasQuemadas = calcularCaloriasQuemadas(tipoActividad, duracion);

  const updatedRecord = {
    id,
    tipoActividad,
    duracion,
    fechaActividad,
    caloriasQuemadas,
  };
  const transaction = db.transaction(["ActividadStore"], "readwrite");
  const objectStore = transaction.objectStore("ActividadStore");

  objectStore.put(updatedRecord).onsuccess = () => {
    console.log(`Registro con id ${id} actualizado`);
    obtenerTodosLosRegistros();
    mostrarToast("Se ha modificado un registro", "green");
    $("#editModal").modal("hide");
  };

  objectStore.put(updatedRecord).onerror = (event) =>
    console.error("Error al actualizar el registro:", event.target.error);
}

document.getElementById("listaRegistros").addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-danger")) {
    eliminarRegistro(Number(event.target.getAttribute("data-id")));
  }
});

$("#editModal").on("show.bs.modal", abrirModalModificar);

document
  .getElementById("saveChangesButton")
  .addEventListener("click", guardarCambios);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fechaActividad").value = new Date()
    .toISOString()
    .slice(0, 10);
});
