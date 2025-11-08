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

  &__tag {
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.12);
    color: $color-primary;
    font-weight: 500;
    font-size: 0.9rem;
  }
}

</style>

