const app_cache = "app-cache";

const cache_assets = [
  "index.html",
  "404.html",
  "calcularIMC.html",
  "calcularCalorias.html",
  "contacto.html",
  "main.js",
  "calcularImc.js",
  "calcularCalorias.js",
  "boostrap.js",
  "css/style.css",
  "css/boostrap.css",
  'img/indexBackground.jpg',
  "img/imcBackground.jpg",
  "img/contactoft.jpg",
  "img/imgNotFound.webp",
  "icons/imcIcon.png",
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
              return fetch("http://localhost:5500/404.html").then((err) => {
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
