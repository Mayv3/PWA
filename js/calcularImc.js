let db;
let form = document.getElementById("imcForm");
let pesoInput = document.getElementById("peso");
let alturaInput = document.getElementById("altura");

abrirBaseDeDatos("IMCDatabase", 1, "IMCStore")
  .then((database) => {
    db = database;
    console.log("Base de datos lista para operaciones.");
  })
  .catch((error) => {
    console.error("Error al abrir la base de datos:", error);
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let peso = parseFloat(pesoInput.value);
  let altura = parseFloat(alturaInput.value);

  if (peso <= 0 || altura <= 0 || !/^\d+(\.\d+)?$/.test(alturaInput.value)) {
    alert("Por favor, ingrese datos válidos.");
    return;
  }

  let data = {
    peso: peso,
    altura: altura,
    fecha: new Date().toLocaleDateString(),
    imc: null,
  };

  let transaction = db.transaction(["IMCStore"], "readwrite");
  let objectStore = transaction.objectStore("IMCStore");
  let request = objectStore.add(data);

  request.onsuccess = function (event) {
    console.log("Datos guardados correctamente en IndexedDB.");
    window.location.href = "mostrarIMC.html";
  };

  request.onerror = function (event) {
    console.error("Error al guardar los datos:", event.target.error);
  };
});

pesoInput.addEventListener("input", () => {
  if (pesoInput.value.length > 3) {
    pesoInput.value = pesoInput.value.slice(0, 3);
  }
  if (pesoInput.value < 0) {
    pesoInput.value = 0;
  }
  if (pesoInput.value > 240) {
    pesoInput.value = 240;
  }
});

alturaInput.addEventListener("input", () => {
  if (alturaInput.value.length > 3) {
    alturaInput.value = alturaInput.value.slice(0, 3);
  }
  if (alturaInput.value > 200) {
    alturaInput.value = 200;
  }
  if (alturaInput.value < 0) {
    alturaInput.value = 0;
  }
  if (alturaInput.value.includes(".")) {
    alturaInput.value = 0;
  }
});
