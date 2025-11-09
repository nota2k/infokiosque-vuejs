<script setup>
import { computed, onMounted, ref } from "vue";
import { usePaperlessStore } from "@/stores/paperless";

const paperlessStore = usePaperlessStore();

const documentTypes = computed(() => paperlessStore.documentTypes);
const selectedId = ref(null);

function extractDocumentTypeId(documentType) {
  if (
    typeof documentType?.id === "number" ||
    typeof documentType?.id === "string"
  ) {
    return documentType.id;
  }

  if (
    typeof documentType?.pk === "number" ||
    typeof documentType?.pk === "string"
  ) {
    return documentType.pk;
  }

  return null;
}

function isDocumentTypeSelected(documentType) {
  if (!selectedId.value) return false;
  const docTypeId = extractDocumentTypeId(documentType);
  if (docTypeId === null || docTypeId === undefined) return false;
  return selectedId.value === String(docTypeId);
}

async function handleSelect(documentType) {
  const rawId = extractDocumentTypeId(documentType);

  if (rawId === null || rawId === undefined) {
    selectedId.value = null;
    await paperlessStore.fetchDocuments();
    return;
  }

  const idAsString = String(rawId);
  const isAlreadySelected = selectedId.value === idAsString;

  selectedId.value = isAlreadySelected ? null : idAsString;

  if (selectedId.value === null) {
    await paperlessStore.fetchDocuments();
    return;
  }

  await paperlessStore.fetchDocumentsByDocumentType(rawId);
}

onMounted(async () => {
  if (!paperlessStore.documentTypes.length) {
    await paperlessStore.fetchAllDocumentTypes();
  }
});
</script>

<template>
  <div class="filter">
    <ul class="filter__tags">
      <li
        v-for="documentType in documentTypes"
        :key="documentType.id"
        class="filter__tag"
        :class="{
          'filter__tag--active': isDocumentTypeSelected(documentType),
        }"
        role="button"
        tabindex="0"
        @click="handleSelect(documentType)"
        @keyup.enter.prevent="handleSelect(documentType)"
        @keyup.space.prevent="handleSelect(documentType)"
      >
        {{ documentType.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.filter {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: $color-text;
}

.filter__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;

  .filter__tag {
    padding: 0.35rem 0.75rem;
    border: 1px solid #000;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;

    &--active {
      background-color: #000;
      color: #fff;
    }
  }
}

</style>

