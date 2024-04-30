/* ------------------------------------ Calculadora de Calorias ------------------------------------- */


let caloriasForm = document.getElementById('formularioCalorias');

let edadInput = document.getElementById('edadCal')
let alturaInput = document.getElementById('alturaCal')
let pesoInput = document.getElementById('pesoCal')

edadInput.addEventListener('input', ()=> {
  if(edadInput.value > 100){
    edadInput.value = 100;
  }else if(edadInput.value < 0){
    edadInput.value = 0;
  }
})
pesoInput.addEventListener('input', ()=> {
  if(pesoInput.value > 200){
    pesoInput.value = 200;
  }else if(pesoInput.value < 0){
    pesoInput.value = 0;
  }
})
alturaInput.addEventListener('input', ()=> {
  if(alturaInput.value > 200){
    alturaInput.value = 200;
  }else if(alturaInput.value < 0){
    alturaInput.value = 0;
  }
  if(alturaInput.value.includes('.')){
    alturaInput.value = 0;
}
})

caloriasForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let edad = parseInt(document.getElementById("edadCal").value);
    let peso = parseFloat(document.getElementById("pesoCal").value);
    let altura = parseFloat(document.getElementById("alturaCal").value);
    let actividad = parseFloat(document.getElementById("actividad").value);

    let alturaCM = altura / 100

    if (edad <= 0 || edad > 100 || peso <= 0 || altura <= 0 || actividad <= 0) {
      document.getElementById("resultado").innerHTML = "<p>Ingrese los valores validos</p>";
      return;
    }

    let mb = 10 * peso + 6.25 * alturaCM *100 - 5 * edad;

    let calorias = mb * actividad;

    document.getElementById("resultado").innerHTML = "<p>Calorías necesarias por día: " + Math.round(calorias) + "</p>";
  });