<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";

import ListingFiles from "@/components/ListingFiles.vue";
import { usePaperlessStore } from "@/stores/paperless.js";

const paperlessStore = usePaperlessStore();
const { documents, isLoading, error } = storeToRefs(paperlessStore);

const emptyState = computed(() => ({
  title: "Aucun document disponible",
  description: "Importez vos premiers fichiers pour les afficher ici.",
  ctaLabel: "Importer un document",
}));

onMounted(() => {
  paperlessStore.fetchDocuments();
});
</script>

<template>
  <main class="home">
    <h1 class="home__title">Infokiosque</h1>
    <div class="container">
      <ListingFiles :files="documents" :empty-state="emptyState" />
      <p v-if="isLoading" class="status status--loading">Chargement des documents…</p>
      <p v-else-if="error" class="status status--error">
        Une erreur est survenue lors du chargement des documents.
      </p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 4rem 1.5rem 6rem;
  color: #1f2933;

  .home__title {
    font-size: 4rem;
    font-weight: 500;
    text-align: center;
    font-family: "Bagnard", sans-serif;
  }
}

.container {
  max-width: 1300px;
  width: 100%;
  margin: 0 auto;
}

.status {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
  color: #475569;

  &.status--loading {
    color: $color-primary;
  }

  &.status--error {
    color: #dc2626;
  }
}
</style>

