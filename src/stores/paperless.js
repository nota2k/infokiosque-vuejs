import { ref } from "vue";
import { defineStore } from "pinia";

const PAPERLESS_API_URL = import.meta.env.VITE_PAPERLESS_API_URL;
const PAPERLESS_TOKEN = import.meta.env.VITE_PAPERLESS_TOKEN;

export const usePaperlessStore = defineStore("paperless", () => {
  const documents = ref([]);
  const isLoading = ref(false);
  const tags = ref([]);
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

  function normalizeTagTitle(tag) {
    if (typeof tag === "string") return tag;
    if (typeof tag === "number") return String(tag);
    if (tag && typeof tag === "object") {
      if (typeof tag.title === "string") return tag.title;
      if (typeof tag.name === "string") return tag.name;
      if (typeof tag.label === "string") return tag.label;
      if (typeof tag.value === "string") return tag.value;
    }
    return null;
  }

  async function fetchTagTitleById(tagId) {
    const url = new URL(`${PAPERLESS_API_URL.replace(/\/$/, "")}/tags/`);
    url.searchParams.set("id", tagId);

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
      return normalizeTagTitle(payload.results[0]);
    }

    if (Array.isArray(payload) && payload.length > 0) {
      return normalizeTagTitle(payload[0]);
    }

    return normalizeTagTitle(payload);
  }

  async function fetchAllTags(params = {}) {
    try {
      error.value = null;
      tags.value = [];

      const shouldRefreshDocuments =
        Object.keys(params).length > 0 || documents.value.length === 0;

      if (shouldRefreshDocuments) {
        await fetchDocuments(params);
      }

      const tagIds = new Set();
      documents.value.forEach((doc) => {
        if (Array.isArray(doc?.tags)) {
          doc.tags.forEach((tagEntry) => {
            if (typeof tagEntry === "number" || typeof tagEntry === "string") {
              tagIds.add(tagEntry);
            } else if (tagEntry && typeof tagEntry === "object" && "id" in tagEntry) {
              tagIds.add(tagEntry.id);
            }
          });
        }
      });

      const titles = await Promise.all(
        Array.from(tagIds).map(async (tagId) => {
          try {
            return await fetchTagTitleById(tagId);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`[Paperless] Échec de récupération du tag ${tagId}`, err);
            return null;
          }
        })
      );

      const filtered = titles
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .map((value) => value.trim());

      tags.value = Array.from(new Set(filtered)).sort((a, b) =>
        a.localeCompare(b, "fr", { sensitivity: "base", numeric: true })
      );
    } catch (err) {
      error.value =
        err instanceof Error ? err : new Error("Échec de la récupération des tags Paperless.");
      tags.value = [];
    }
  }

  return {
    documents,
    tags,
    isLoading,
    error,
    fetchDocuments,
    fetchAllTags,
  };
});
