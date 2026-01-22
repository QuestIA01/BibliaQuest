"use strict";

/**
 * Bíblia Quest – Service Worker Seguro
 * Estratégia: Cache First (somente para arquivos locais)
 * Bloqueia cache e interceptação de domínios externos
 */

const CACHE_VERSION = "v2";
const CACHE_NAME = `biblia-quest-${CACHE_VERSION}`;

/**
 * Arquivos permitidos no cache
 * ⚠️ SOMENTE arquivos locais e confiáveis
 */
const FILES_TO_CACHE = [
  "./",
  "./menu.html",
  "./manifest.json",

  "./assets/favicon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

/* =========================
   INSTALL
   ========================= */
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

/* =========================
   ACTIVATE
   ========================= */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

/* =========================
   FETCH
   ========================= */
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  /**
   * 🔒 REGRA 1:
   * Nunca interceptar ou cachear domínios externos
   * (Mercado Pago, APIs, etc.)
   */
  if (url.origin !== self.location.origin) {
    return;
  }

  /**
   * 🔒 REGRA 2:
   * Apenas GET é permitido no cache
   */
  if (request.method !== "GET") {
    return;
  }

  /**
   * Estratégia: Cache First
   * - Offline seguro
   * - Sem cache dinâmico perigoso
   */
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(networkResponse => {
        /**
         * 🔒 REGRA 3:
         * Só cacheia respostas válidas e do mesmo domínio
         */
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseClone);
        });

        return networkResponse;
      });
    })
  );
});
