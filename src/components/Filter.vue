<script setup>
import { computed, onMounted } from "vue";
import { usePaperlessStore } from "@/stores/paperless";

const paperlessStore = usePaperlessStore();

const tags = computed(() => paperlessStore.tags);

onMounted(async () => {
  if (!paperlessStore.tags.length) {
    await paperlessStore.fetchAllTags();
  }
});
</script>

<template>
  <div class="filter">
    <ul class="filter__tags">
      <li v-for="tag in tags" :key="tag" class="filter__tag">
        {{ tag }}
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
    border-radius: 999px;
    border: 1px solid #000;
    font-weight: 500;
    font-size: 0.9rem;
  }
}

</style>

