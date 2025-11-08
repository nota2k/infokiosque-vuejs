import { ref } from "vue";
import { defineStore } from "pinia";

const PAPERLESS_API_URL = import.meta.env.VITE_PAPERLESS_API_URL;
const PAPERLESS_TOKEN = import.meta.env.VITE_PAPERLESS_TOKEN;

export const usePaperlessStore = defineStore("paperless", () => {
  const documents = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchDocuments(params = {}) {
    if (!PAPERLESS_API_URL || !PAPERLESS_TOKEN) {
      error.value = new Error(
        "Configuration Paperless manquante. Vérifiez vos variables d'environnement."
      );
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const baseUrl = new URL(`${PAPERLESS_API_URL.replace(/\/$/, "")}/documents/`);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          baseUrl.searchParams.set(key, value);
        }
      });

      const collected = [];
      let nextUrl = baseUrl.toString();

      while (nextUrl) {
        const response = await fetch(nextUrl, {
          headers: {
            Authorization: `Token ${PAPERLESS_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            `Erreur Paperless (${response.status}) : ${message || response.statusText}`
          );
        }

        const payload = await response.json();

        if (Array.isArray(payload?.results)) {
          collected.push(...payload.results);
          nextUrl = payload.next ?? null;
        } else if (Array.isArray(payload)) {
          collected.push(...payload);
          nextUrl = null;
        } else {
          nextUrl = null;
        }
      }

      documents.value = collected;
      // eslint-disable-next-line no-console
      // console.log("[Paperless] Documents récupérés :", documents.value);
    } catch (err) {
      error.value =
        err instanceof Error ? err : new Error("Échec de la récupération des documents Paperless.");
      documents.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
  };
});
