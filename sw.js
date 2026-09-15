const CACHE_NAME = "oficina-do-celular-v2";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((chaves) => {
      return Promise.all(
        chaves
          .filter((chave) => chave !== CACHE_NAME)
          .map((chave) => caches.delete(chave))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Não intercepta as requisições do Firebase.
  if (
    event.request.url.includes("firebase") ||
    event.request.url.includes("googleapis")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((resposta) => {
        const copia = resposta.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copia);
        });

        return resposta;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
