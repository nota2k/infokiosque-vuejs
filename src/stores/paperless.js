import { ref } from "vue";
import { defineStore } from "pinia";

const PAPERLESS_API_URL = import.meta.env.VITE_PAPERLESS_API_URL;
const PAPERLESS_TOKEN = import.meta.env.VITE_PAPERLESS_TOKEN;

export const usePaperlessStore = defineStore("paperless", () => {
  const documents = ref([]);
  const isLoading = ref(false);
  const documentTypes = ref([]);
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
          nextUrl = payload.next
            ? new URL(payload.next, baseUrl).toString().replace(/^http:/, "https:")
            : null;
        } else if (Array.isArray(payload)) {
          collected.push(...payload);
          nextUrl = null;
        } else {
          nextUrl = null;
        }
      }

      documents.value = collected;
    } catch (err) {
      error.value =
        err instanceof Error ? err : new Error("Échec de la récupération des documents Paperless.");
      documents.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  function extractDocumentTypePayload(payload, fallbackId) {
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const id =
      typeof payload.id === "number" || typeof payload.id === "string"
        ? payload.id
        : fallbackId;
    const rawName =
      typeof payload.name === "string"
        ? payload.name
        : typeof payload.title === "string"
        ? payload.title
        : typeof payload.label === "string"
        ? payload.label
        : null;

    if (!rawName || !rawName.trim()) {
      return null;
    }

    return {
      id,
      name: rawName.trim(),
    };
  }

  async function fetchDocumentTypeById(documentTypeId) {
    const url = new URL(`${PAPERLESS_API_URL.replace(/\/$/, "")}/document_types/`);
    url.searchParams.set("id", documentTypeId);

    const response = await fetch(url.toString(), {
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

    if (Array.isArray(payload?.results) && payload.results.length > 0) {
      return extractDocumentTypePayload(payload.results[0], documentTypeId);
    }

    if (Array.isArray(payload) && payload.length > 0) {
      return extractDocumentTypePayload(payload[0], documentTypeId);
    }

    return extractDocumentTypePayload(payload, documentTypeId);
  }

  async function fetchAllDocumentTypes(params = {}) {
    try {
      error.value = null;
      documentTypes.value = [];
      const shouldRefreshDocuments =
        Object.keys(params).length > 0 || documents.value.length === 0;

      if (shouldRefreshDocuments) {
        await fetchDocuments(params);
      }

      const typeIds = new Set();
      documents.value.forEach((doc) => {
        const entry = doc?.document_type ?? doc?.document_type_id ?? doc?.document_type_pk;

        if (typeof entry === "number" || typeof entry === "string") {
          typeIds.add(entry);
        } else if (entry && typeof entry === "object") {
          if ("id" in entry && (typeof entry.id === "number" || typeof entry.id === "string")) {
            typeIds.add(entry.id);
          } else if ("pk" in entry && (typeof entry.pk === "number" || typeof entry.pk === "string")) {
            typeIds.add(entry.pk);
          }
        }
      });

      const fetched = await Promise.all(
        Array.from(typeIds).map(async (typeId) => {
          try {
            return await fetchDocumentTypeById(typeId);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(
              `[Paperless] Échec de récupération du type de document ${typeId}`,
              err
            );
            return null;
          }
        })
      );

      const registry = new Map();
      fetched
        .filter(
          (item) =>
            item &&
            (typeof item.id === "number" || typeof item.id === "string") &&
            typeof item.name === "string" &&
            item.name.trim().length > 0
        )
        .forEach((item) => {
          const idKey = String(item.id);
          if (!registry.has(idKey)) {
            registry.set(idKey, {
              id: item.id,
              name: item.name.trim(),
            });
          }
        });

      documentTypes.value = Array.from(registry.values()).sort((a, b) =>
        a.name.localeCompare(b.name, "fr", { sensitivity: "base", numeric: true })
      );
    } catch (err) {
      error.value =
        err instanceof Error ? err : new Error("Échec de la récupération des types de documents Paperless.");
      documentTypes.value = [];
    }
  }

  async function fetchDocumentsByDocumentType(documentTypeId) {
    if (!documentTypeId && documentTypeId !== 0) {
      await fetchDocuments();
      return;
    }

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
      baseUrl.searchParams.set("document_type__id", documentTypeId);

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
          nextUrl = payload.next
            ? new URL(payload.next, baseUrl).toString().replace(/^http:/, "https:")
            : null;
        } else if (Array.isArray(payload)) {
          collected.push(...payload);
          nextUrl = null;
        } else {
          nextUrl = null;
        }
      }

      documents.value = collected;
    } catch (err) {
      error.value =
        err instanceof Error
          ? err
          : new Error("Échec de la récupération des documents Paperless.");
      documents.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    documents,
    documentTypes,
    fetchDocumentsByDocumentType,
    isLoading,
    error,
    fetchDocuments,
    fetchAllDocumentTypes,
  };
});
