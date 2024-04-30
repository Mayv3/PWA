/* ------------------------------------ Calculadora de IMCs ------------------------------------- */

var imcs = [];

function calcularIMC(peso, alturaCM) {
    var altura = alturaCM / 100
    var imc = peso / Math.pow(altura, 2);
    var mensaje = "";
    var fecha = new Date();
    var fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

    if (imc > 20 && imc < 25) {
        mensaje = "Tu IMC es normal";
    } else if (imc < 20) {
        mensaje = "Tu IMC está por debajo de lo normal";
    } else {
        mensaje = "Tu IMC está por encima de lo normal";
    }

    var imcObjeto = {
        Peso: peso,
        Altura: altura,
        Imc: imc,
        Fecha: fechaFormateada,
        Mensaje: mensaje,
    };

    imcs.push(imcObjeto);

    return imcs;
}

let form = document.getElementById("imcForm");
let pesoInput = document.getElementById('peso');
let alturaInput = document.getElementById('altura');

pesoInput.addEventListener('input', ()=>{
    if(pesoInput.value.length > 3){
        pesoInput.value = pesoInput.value.slice(0,3) 
    }
    if(pesoInput.value < 0){
        pesoInput.value = 0;
    }
    if(pesoInput.value > 240){
        pesoInput.value = 240;
    }
})
alturaInput.addEventListener('input', ()=>{
    if(alturaInput.value.length > 3){
        alturaInput.value = alturaInput.value.slice(0,3) 
    }
    if(alturaInput.value > 200){
        alturaInput.value = 200;
    }
    if(alturaInput.value < 0){
        alturaInput.value = 0;
    }
    if(alturaInput.value.includes('.')){
        alturaInput.value = 0;
    }
})
form.addEventListener("submit", (e) => {
    e.preventDefault();

    let peso = parseFloat(document.getElementById("peso").value);
    let altura = parseFloat(document.getElementById("altura").value);
    

    if (peso <= 0 || altura <= 0) {
        return;
    }

    if (!/^\d+(\.\d+)?$/.test(altura)) {
        alert("Por favor, ingrese una altura válida.");
        return;
    }

    resultado = calcularIMC(peso, altura);
    mostrarImcs(imcs);
});


function mostrarImcs(imcs) {
    let lista = document.getElementById("listaIMCs");

    lista.innerHTML = "";

    const elementosPorScroll = 5;
    const alturaLi = 100; 
    
    imcs.slice(0, imcs.length).forEach(function (objet, index) {
        let li = document.createElement("li");
        li.classList.add(
            "list-group-item",
            "p-4",
            "bg-dark",
            "text-white",
            "border-0"
        );

        let divDatos = document.createElement("div");
        divDatos.classList.add("row", "gy-2");

        Object.keys(objet).forEach(function(key) {
            let datoDiv = document.createElement("div");
            datoDiv.classList.add("col-6");

            let valor = key === 'Imc' ? Math.round(parseFloat(objet[key])) : objet[key];
            
            if (key === 'Peso') {
                valor = `${valor} KG`;
            } else if (key === 'Altura') {
                valor = `${valor} M`;
            }

            datoDiv.innerHTML = `<span class="fw-bold">${key}:</span> ${valor}`;
            divDatos.appendChild(datoDiv);
        });

        let pIndex = document.createElement("span");
        pIndex.textContent = `${index + 1}`;
        pIndex.classList.add("badge", "bg-primary", "rounded-pill", "me-2");

        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("btn", "btn-sm", "position-absolute", "top-0", "end-0");
        btnEliminar.addEventListener("click", function() {
            imcs.splice(index, 1);
            mostrarImcs(imcs);
        });

        li.appendChild(pIndex);
        li.appendChild(divDatos);
        li.appendChild(btnEliminar);

        lista.appendChild(li);
    });

    const alturaMaxima = elementosPorScroll * alturaLi;
    lista.style.maxHeight = `${alturaMaxima}px`;

    lista.classList.add("hide-scrollbar");
}

 

