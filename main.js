if ("serviceWorker" in navigator) {
     navigator.serviceWorker.register("/serviceworker.js");
}


function manejarEstadoConexion() {
     if (navigator.onLine) {
       console.log('El dispositivo está conectado a internet.');
     } else {
       console.log('El dispositivo está desconectado de internet.');
     }
   }
   
   window.addEventListener('online', manejarEstadoConexion);
   window.addEventListener('offline', manejarEstadoConexion);
   
   manejarEstadoConexion();
   

