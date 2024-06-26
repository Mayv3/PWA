let db;

abrirBaseDeDatos("IMCDatabase", 1, "IMCStore")
  .then((database) => {
    db = database;
    return obtenerTodosLosRegistros();
  })
  .then((registros) => {
    mostrarRegistrosEnLista(registros);
  })
  .catch((error) => console.error("Error al obtener los registros:", error));

function obtenerTodosLosRegistros() {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(["IMCStore"], "readonly");
    let objectStore = transaction.objectStore("IMCStore");

    let registros = [];

    objectStore.openCursor().onsuccess = function (event) {
      let cursor = event.target.result;
      if (cursor) {
        registros.push({ id: cursor.key, ...cursor.value });
        cursor.continue();
      } else {
        console.log("Todos los registros obtenidos:", registros);
        resolve(registros);
      }
    };

    objectStore.openCursor().onerror = function (event) {
      console.error("Error al obtener los registros:", event.target.error);
      reject(event.target.error);
    };
  });
}

function mostrarRegistrosEnLista(registros) {
  let lista = document.getElementById("listaRegistros");
  lista.innerHTML = "";

  registros.forEach((registro) => {
    let listItem = document.createElement("li");
    listItem.className =
      "list-group-item d-flex justify-content-between align-items-center p-4 d-flex flex-column border-0";

    let imcClase = obtenerClaseIMC(registro.imc);
    listItem.classList.add(imcClase);

    listItem.setAttribute("data-id", registro.id);
    listItem.innerHTML = `
                          <div>
                            <p>Fecha: ${registro.fecha} </p>
                            <p>Altura: ${registro.altura} - Peso: ${registro.peso} - IMC: ${registro.imc}</p>
                          </div>
                          <div class="w-100">
                            <button class="btn btn-sm modificar">Modificar</button>
                            <button class="btn btn-sm eliminar rounded-left m-0 p-3 text-dark">X</button>
                          </div>`;
    lista.appendChild(listItem);

    listItem.querySelector(".modificar").addEventListener("click", function () {
      abrirModificarRegistroModal(registro.id, registro.peso, registro.altura);
    });

    listItem.querySelector(".eliminar").addEventListener("click", function () {
      eliminarRegistro(registro.id)
        .then(() => {
          let itemAEliminar = lista.querySelector(`[data-id="${registro.id}"]`);
          if (itemAEliminar) {
            lista.removeChild(itemAEliminar);
          }
        })
        .catch((error) =>
          console.error("Error al eliminar el registro:", error)
        );
    });
  });
}

function obtenerClaseIMC(imc) {
  if (imc >= 18.5 && imc < 25) {
    return "imc-medio";
  } else if (imc < 18.5) {
    return "imc-bajo";
  } else {
    return "imc-alto";
  }
}

function eliminarRegistro(id) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(["IMCStore"], "readwrite");
    let objectStore = transaction.objectStore("IMCStore");

    let deleteRequest = objectStore.delete(id);

    deleteRequest.onsuccess = function (event) {
      console.log(`Registro con id ${id} eliminado correctamente.`);
      mostrarToast("Registro eliminado correctamente", "red");
      resolve();
    };

    deleteRequest.onerror = function (event) {
      console.error("Error al eliminar el registro:", event.target.error);
      reject(event.target.error);
    };
  });
}

function abrirModificarRegistroModal(id, peso, altura) {
  $("#modificarRegistroModal").modal("show");
  document.getElementById("modificarPeso").value = peso;
  document.getElementById("modificarAltura").value = altura;
  document.getElementById("modificarId").value = id;

  let modificarPesoInput = document.getElementById("modificarPeso");
  let modificarAlturaInput = document.getElementById("modificarAltura");

  modificarPesoInput.addEventListener("input", () => {
    if (modificarPesoInput.value.length > 3) {
      modificarPesoInput.value = modificarPesoInput.value.slice(0, 3);
    }
    if (modificarPesoInput.value < 0) {
      modificarPesoInput.value = 0;
    }
    if (modificarPesoInput.value > 240) {
      modificarPesoInput.value = 240;
    }
  });

  modificarAlturaInput.addEventListener("input", () => {
    if (modificarAlturaInput.value.length > 3) {
      modificarAlturaInput.value = modificarAlturaInput.value.slice(0, 3);
    }
    if (modificarAlturaInput.value > 200) {
      modificarAlturaInput.value = 200;
    }
    if (modificarAlturaInput.value < 0) {
      modificarAlturaInput.value = 0;
    }
    if (modificarAlturaInput.value.includes(".")) {
      modificarAlturaInput.value = modificarAlturaInput.value.split(".")[0];
    }
  });
}

function modificarRegistro(id, peso, altura) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(["IMCStore"], "readwrite");
    let objectStore = transaction.objectStore("IMCStore");

    let getRequest = objectStore.get(parseInt(id));

    getRequest.onsuccess = function (event) {
      let data = event.target.result;
      data.peso = peso;
      data.altura = altura;
      data.imc = (peso / Math.pow(altura / 100, 2)).toFixed(2);
      data.fecha = new Date().toLocaleDateString();

      let updateRequest = objectStore.put(data);

      updateRequest.onsuccess = function (event) {
        console.log(`Registro con id ${id} modificado correctamente.`);
        actualizarElementoEnLista(id, peso, altura, data.imc, data.fecha);
        resolve();
      };

      updateRequest.onerror = function (event) {
        console.error("Error al modificar el registro:", event.target.error);
        reject(event.target.error);
      };
    };

    getRequest.onerror = function (event) {
      console.error("Error al obtener el registro:", event.target.error);
      reject(event.target.error);
    };
  });
}

function actualizarElementoEnLista() {
  obtenerTodosLosRegistros()
    .then((registros) => {
      mostrarRegistrosEnLista(registros);
    })
    .catch((error) => console.error("Error al obtener los registros:", error));
}

document
  .getElementById("modificarRegistroForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let id = document.getElementById("modificarId").value;
    let nuevoPeso = document.getElementById("modificarPeso").value;
    let nuevaAltura = document.getElementById("modificarAltura").value;
    mostrarToast("Registro modificado correctamente", "green");
    modificarRegistro(id, nuevoPeso, nuevaAltura)
      .then(() => {
        $("#modificarRegistroModal").modal("hide");
      })
      .catch((error) =>
        console.error("Error al modificar el registro:", error)
      );
  });
