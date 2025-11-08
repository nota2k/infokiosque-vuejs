<script setup>
import {
  computed,
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import SinglePost from "@/components/SinglePost.vue";
import { usePaperlessStore } from "@/stores/paperless";

const paperlessStore = usePaperlessStore();

const posts = computed(() => paperlessStore.documents);

const masonryRef = ref(null);
let rafId = null;

const ROW_HEIGHT = 12;
const GAP = 24;

function applyMasonryLayout() {
  const container = masonryRef.value;
  if (!container) return;

  container.querySelectorAll(".listing-files__item").forEach((item) => {
    const content = item.querySelector(".single-post");
    if (!content) return;

    const height = content.offsetHeight;
    const span = Math.max(
      1,
      Math.ceil((height + GAP) / (ROW_HEIGHT + GAP))
    );

    item.style.setProperty("--masonry-span", span);
  });
}

function scheduleMasonryLayout() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }

  rafId = requestAnimationFrame(() => {
    applyMasonryLayout();
    rafId = null;
  });
}

function handleResize() {
  scheduleMasonryLayout();
}

onMounted(() => {
  nextTick(() => {
    if (masonryRef.value) {
      masonryRef.value.style.setProperty("--masonry-row-height", `${ROW_HEIGHT}px`);
      masonryRef.value.style.setProperty("--masonry-gap", `${GAP}px`);
    }
    scheduleMasonryLayout();
  });

  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
  window.removeEventListener("resize", handleResize);
});

watch(
  posts,
  () => {
    nextTick(() => {
      scheduleMasonryLayout();
    });
  },
  { deep: true }
);
</script>

<template>
  <div class="listing-files" ref="masonryRef">
    <div
      v-for="post in posts"
      :key="post.id"
      class="listing-files__item"
    >
      <SinglePost :post="post" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.listing-files {
  --masonry-row-height: 12px;
  --masonry-gap: 1.5rem;

  display: grid;
  grid-template-columns: minmax(260px, 2fr) repeat(2, minmax(220px, 1fr));
  grid-auto-rows: var(--masonry-row-height);
  grid-auto-flow: dense;
  gap: var(--masonry-gap);

  @media (max-width: 1200px) {
    grid-template-columns: minmax(260px, 2fr) minmax(220px, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.listing-files__item {
  grid-row-end: span var(--masonry-span, 1);
}

</style>

