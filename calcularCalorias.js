/* ------------------------------------ Calculadora de Calorias ------------------------------------- */


let caloriasForm = document.getElementById('formularioCalorias');

caloriasForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let edad = parseInt(document.getElementById("edadCal").value);
    let peso = parseFloat(document.getElementById("pesoCal").value);
    let altura = parseFloat(document.getElementById("alturaCal").value);
    let actividad = parseFloat(document.getElementById("actividad").value);

    if (edad <= 0 || edad > 100 || peso <= 0 || altura <= 0 || actividad <= 0) {
      alert("Por favor, complete todos los campos con valores válidos.");
      return;
    }

    let mb = 10 * peso + 6.25 * altura * 100 - 5 * edad;

    let calorias = mb * actividad;

    document.getElementById("resultado").innerHTML = "<p>Calorías necesarias por día: " + Math.round(calorias) + "</p>";
  });