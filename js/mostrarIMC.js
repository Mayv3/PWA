let db;

abrirBaseDeDatos("IMCDatabase", 1)
  .then((database) => {
    db = database;
    return ultimoImc(db);
  })
  .then((ultimoRegistro) => {
    if (ultimoRegistro) {
      console.log("Último registro:", ultimoRegistro);
      calcularIMC(ultimoRegistro.peso, ultimoRegistro.altura);
    } else {
      console.log("No hay registros en la base de datos.");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function calcularIMC(peso, alturaCM) {
  if (!peso || !alturaCM) {
    console.log("Peso o altura no definidos.");
    return;
  }

  var altura = alturaCM / 100;
  var imc = peso / Math.pow(altura, 2);
  var mensaje = "";

  if (imc >= 18.5 && imc < 24.9) {
    mensaje = "Tu IMC es normal";
    document.body.classList.add("green");
  } else if (imc < 18.5) {
    mensaje = "Tu IMC está por debajo de lo normal";
    document.body.classList.add("red");
  } else {
    mensaje = "Tu IMC está por encima de lo normal";
    document.body.classList.add("red");
  }

  imc = Math.round(imc * 100) / 100;

  console.log("IMC:", imc.toFixed(1), mensaje);

  document.getElementById("resultadoIMC").innerText = `
  ${imc.toFixed(2)} - ${mensaje}`;

  actualizarIMCEnIndexedDB(imc);
}

function actualizarIMCEnIndexedDB(imc) {
  let transaction = db.transaction(["IMCStore"], "readwrite");
  let objectStore = transaction.objectStore("IMCStore");

  let getRequest = objectStore.openCursor(null, "prev");

  getRequest.onsuccess = function (event) {
    let cursor = event.target.result;

    if (cursor) {
      let updatedData = cursor.value;
      updatedData.imc = imc;

      let updateRequest = cursor.update(updatedData);

      updateRequest.onsuccess = function (event) {
        console.log("IMC actualizado correctamente en IndexedDB.");
        mostrarToast("Se ha guardado un registro", "green");
      };

      updateRequest.onerror = function (event) {
        console.error("Error al actualizar el IMC:", event.target.error);
      };
    } else {
      console.log("No se encontró ningún registro en la base de datos.");
    }
  };

  getRequest.onerror = function (event) {
    console.error("Error al obtener el último registro:", event.target.error);
  };
}
