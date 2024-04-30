if ("serviceWorker" in navigator) {
     navigator.serviceWorker.register("/serviceworker.js");
}

let formulario = document.getElementById('formContacto'); 

formulario.addEventListener('submit', (e)=>{
     e.preventDefault()
})