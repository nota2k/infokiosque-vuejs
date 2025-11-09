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
import Placard from "@/components/Placard.vue";
import { usePaperlessStore } from "@/stores/paperless";

const paperlessStore = usePaperlessStore();

const posts = computed(() => paperlessStore.documents);
const bigTitleIndex = ref(null);
const placardIndex = ref(null);
const doubleWidthItems = ref(new Set());
const renderItems = computed(() => {
  const items = posts.value.map((post, index) => ({
    type: "post",
    post,
    index,
  }));

  if (
    placardIndex.value !== null &&
    placardIndex.value >= 0 &&
    placardIndex.value < items.length
  ) {
    items.splice(placardIndex.value + 1, 0, {
      type: "placard",
      key: `placard-after-${items[placardIndex.value].post.id}`,
    });
  }

  return items;
});

const masonryRef = ref(null);
let rafId = null;

const ROW_HEIGHT = 12;
const GAP = 24;

function applyMasonryLayout() {
  const container = masonryRef.value;
  if (!container) return;

  const gridStyles = window.getComputedStyle(container);
  const columnTemplate = gridStyles.gridTemplateColumns;
  const columnCount = columnTemplate.split(" ").length;
  const containerWidth = container.offsetWidth;
  const gap = parseFloat(gridStyles.gap) || 24;

  // Calculer la largeur de la première colonne selon le nombre de colonnes
  let firstColumnWidth;
  if (columnCount === 3) {
    // 2fr + 1fr + 1fr = 4fr total, première colonne = 2fr = 50%
    // Largeur de la première colonne SANS le gap après
    firstColumnWidth = (containerWidth - gap * 2) * (2 / 4);
  } else if (columnCount === 2) {
    // 2fr + 1fr = 3fr total, première colonne = 2fr = 66.67%
    // Largeur de la première colonne SANS le gap après
    firstColumnWidth = (containerWidth - gap) * (2 / 3);
  } else {
    // Une seule colonne ou colonnes égales - pas de colonne double
    firstColumnWidth = 0;
  }

  container.querySelectorAll(".listing-files__item").forEach((item) => {
    const content =
      item.querySelector(".single-post") ?? item.querySelector(".placard");
    if (!content) return;

    const height = content.offsetHeight;
    const span = Math.max(
      1,
      Math.ceil((height + GAP) / (ROW_HEIGHT + GAP))
    );

    item.style.setProperty("--masonry-span", span);

    // Détecter si l'élément est dans la première colonne (largeur double)
    if (columnCount > 1 && firstColumnWidth > 0) {
      const rect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const itemLeft = rect.left - containerRect.left;
      const itemCenter = itemLeft + rect.width / 2;

      // Si le centre de l'élément est dans la première colonne (largeur double)
      const isDoubleWidth = itemCenter <= firstColumnWidth;
      
      if (isDoubleWidth) {
        item.classList.add("listing-files__item--double-width");
        // Stocker l'ID du post pour passer la prop
        const postElement = item.querySelector(".single-post");
        if (postElement) {
          const postId = postElement.id;
          if (postId) {
            doubleWidthItems.value.add(postId);
          }
        }
      } else {
        item.classList.remove("listing-files__item--double-width");
        const postElement = item.querySelector(".single-post");
        if (postElement) {
          const postId = postElement.id;
          if (postId) {
            doubleWidthItems.value.delete(postId);
          }
        }
      }
    } else {
      item.classList.remove("listing-files__item--double-width");
      // Nettoyer tous les IDs si pas de colonne double
      doubleWidthItems.value.clear();
    }
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

function assignRandomIndexes() {
  if (posts.value.length > 1) {
    const upperBound = posts.value.length - 1;
    bigTitleIndex.value = Math.floor(Math.random() * upperBound) + 1;

    // Ensure placard index differs from bigTitleIndex when possible
    let candidate = Math.floor(Math.random() * upperBound) + 1;
    if (upperBound > 1) {
      while (candidate === bigTitleIndex.value) {
        candidate = Math.floor(Math.random() * upperBound) + 1;
      }
    }
    placardIndex.value = candidate;
  } else {
    bigTitleIndex.value = null;
    placardIndex.value = null;
  }
}

onMounted(() => {
  nextTick(() => {
    if (masonryRef.value) {
      masonryRef.value.style.setProperty("--masonry-row-height", `${ROW_HEIGHT}px`);
      masonryRef.value.style.setProperty("--masonry-gap", `${GAP}px`);
    }
    assignRandomIndexes();

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
      assignRandomIndexes();

      scheduleMasonryLayout();
    });
  },
  { deep: true }
);
</script>

<template>
  <div class="listing-files" ref="masonryRef">
    <div
      v-for="item in renderItems"
      :key="item.type === 'post' ? `post-${item.post.id}` : item.key"
      class="listing-files__item"
      :class="{
        'listing-files__item--placard': item.type === 'placard',
      }"
    >
      <SinglePost
        v-if="item.type === 'post'"
        :post="item.post"
        :is-big-title="item.index === bigTitleIndex"
        :is-double-width="doubleWidthItems.has(String(item.post.id))"
      />
      <Placard v-else />
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

