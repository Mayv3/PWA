const app_cache = "app-cache";

const cache_assets = [
  "404.html",
  "calcularIMC.html",
  "index.html",
  "offline.html",
  "mostrarIMC.html",
  "historialIMC.html",
  "contacto.html",
  "tipoActividad.html",
  "duracion.html",
  "fechaActividad.html",
  "registrosActividad.html",
  "caloriasQuemadas.html",
  "site.webmanifest",

  "js/tipoActividad.js",
  "js/duracion.js",
  "js/fechaActividad.js",
  "js/caloriasQuemadas.js",
  "js/registrosActividad.js",
  "js/main.js",
  "js/calcularImc.js",
  "js/mostrarIMC.js",
  "js/formulario.js",
  "js/boostrap.js",
  "js/historialIMC.js",
  "js/utilidades/db.js",
  "js/utilidades/calcularCaloriasQuemadas.js",
  "js/utilidades/ultimoRegistro.js",
  "js/utilidades/ultimoImc.js",
  "js/utilidades/toast.js",

  "css/style.css",
  "css/boostrap.css",

  "img/imcBackground.jpg",
  "img/indexBackground.jpg",
  "img/actividad-fisica.png",
  "img/arrow-back.png",
  "img/calendar.png",
  "img/calorias.png",
  "img/carrot.png",
  "img/duracion.png",
  "img/hamburger-menu.png",
  "img/pencil.png",
  "img/registro-actividad.png",
  "img/tilde.png",
  "img/imgNotFound.webp",

  "icons/imcIcon.png",
  "icons/imcIcon-48x48.png",
  "icons/imcIcon-72x72.png",
  "icons/imcIcon-96x96.png",
  "icons/imcIcon-128x128.png",
  "icons/imcIcon-144x144.png",
  "icons/imcIcon-152x152.png",
  "icons/imcIcon-192x192.png",
  "icons/imcIcon-256x256.png",
  "icons/imcIcon-384x384.png",
  "icons/imcIcon-512x512.png",

  "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js",
  "https://code.jquery.com/jquery-3.5.1.slim.min.js",
  "https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js",
  "https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log("Service worker installed");

  event.waitUntil(
    caches.open(app_cache).then((cache) => {
      cache.addAll(cache_assets);
      console.log("Cache Guardado");
    })
  );
});

self.addEventListener("activate", (event) => {
  self.skipWaiting();
  console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((respuestas) => {
      if (respuestas) {
        return respuestas;
      }

      const request_original = event.request.clone();

      return fetch(request_original)
        .then((respuestas) => {
          if (!respuestas || respuestas.status != 200) {
            if (request_original.destination == "image") {
              return fetch("/img/imgNotFound.webp").then((placeHolder) => {
                return placeHolder;
              });
            } else {
              return fetch("404.html").then((err) => {
                return err;
              });
            }
          }

          if (request_original.method == "GET") {
            const nueva_info_cache = respuestas.clone();
            caches.open(app_cache).then((cache) => {
              cache.put(request_original, nueva_info_cache);
            });
          }

          return respuestas;
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
});
