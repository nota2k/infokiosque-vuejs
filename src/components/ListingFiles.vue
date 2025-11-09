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

// Distribuer les items dans les colonnes de manière équilibrée
const column1Items = computed(() => {
  return renderItems.value.filter((item, index) => {
    // Distribuer environ 1/3 des items dans la colonne 1
    return index % 3 === 0;
  });
});

const column2Items = computed(() => {
  return renderItems.value.filter((item, index) => {
    // Distribuer environ 1/3 des items dans la colonne 2
    return index % 3 === 1;
  });
});

const column3Items = computed(() => {
  return renderItems.value.filter((item, index) => {
    // Distribuer environ 1/3 des items dans la colonne 3
    return index % 3 === 2;
  });
});

const masonryRef = ref(null);
const column1Ref = ref(null);
const column2Ref = ref(null);
const column3Ref = ref(null);
let rafId = null;
let isScrolling = false; // Flag pour éviter les boucles infinies lors de la synchronisation

const ROW_HEIGHT = 12;
const GAP = 24;

function applyMasonryLayout() {
  // Mettre à jour les IDs des posts en largeur double basés sur leur position
  nextTick(() => {
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
      firstColumnWidth = (containerWidth - gap * 2) * (2 / 4);
    } else if (columnCount === 2) {
      firstColumnWidth = (containerWidth - gap) * (2 / 3);
    } else {
      firstColumnWidth = 0;
    }

    container.querySelectorAll(".listing-files__item").forEach((item) => {
      const content =
        item.querySelector(".single-post") ?? item.querySelector(".placard");
      if (!content) return;

      // Détecter si l'élément est dans la première colonne (largeur double)
      if (columnCount > 1 && firstColumnWidth > 0) {
        const rect = item.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const itemLeft = rect.left - containerRect.left;
        const itemCenter = itemLeft + rect.width / 2;

        const isDoubleWidth = itemCenter <= firstColumnWidth;
        
        if (isDoubleWidth) {
          item.classList.add("listing-files__item--double-width");
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
        doubleWidthItems.value.clear();
      }
    });
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

function syncScroll(sourceColumn, targetColumns) {
  if (isScrolling) return;
  
  isScrolling = true;
  
  const sourceScrollTop = sourceColumn.scrollTop;
  const sourceScrollHeight = sourceColumn.scrollHeight;
  const sourceClientHeight = sourceColumn.clientHeight;
  const sourceMaxScroll = sourceScrollHeight - sourceClientHeight;
  
  // Calculer le pourcentage de scroll (0 = haut, 1 = bas)
  const scrollPercent = sourceMaxScroll > 0 ? sourceScrollTop / sourceMaxScroll : 0;
  
  // Appliquer le même pourcentage aux colonnes cibles
  targetColumns.forEach((targetColumn) => {
    if (!targetColumn || targetColumn === sourceColumn) return;
    
    const targetScrollHeight = targetColumn.scrollHeight;
    const targetClientHeight = targetColumn.clientHeight;
    const targetMaxScroll = targetScrollHeight - targetClientHeight;
    
    if (targetMaxScroll > 0) {
      targetColumn.scrollTop = targetMaxScroll * scrollPercent;
    }
  });
  
  requestAnimationFrame(() => {
    isScrolling = false;
  });
}

function setupSynchronizedScroll() {
  // Synchroniser uniquement les colonnes 2 et 3 (1fr) entre elles
  const column2 = column2Ref.value;
  const column3 = column3Ref.value;
  
  if (!column2 || !column3) return;
  
  // Quand la colonne 2 scroll, synchroniser la colonne 3
  column2.addEventListener("scroll", () => {
    syncScroll(column2, [column3]);
  });
  
  // Quand la colonne 3 scroll, synchroniser la colonne 2
  column3.addEventListener("scroll", () => {
    syncScroll(column3, [column2]);
  });
}

onMounted(() => {
  nextTick(() => {
    assignRandomIndexes();
    scheduleMasonryLayout();
    // Attendre un peu pour que les colonnes soient complètement rendues
    setTimeout(() => {
      setupSynchronizedScroll();
    }, 100);
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
    <!-- Colonne 1 - Largeur double, scroll vers le bas -->
    <div class="listing-files__column listing-files__column--first" ref="column1Ref">
      <div
        v-for="item in column1Items"
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
          :is-double-width="true"
        />
        <Placard v-else />
      </div>
    </div>

    <!-- Colonne 2 -->
    <div class="listing-files__column listing-files__column--second" ref="column2Ref">
      <div
        v-for="item in column2Items"
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
          :is-double-width="false"
        />
        <Placard v-else />
      </div>
    </div>

    <!-- Colonne 3 -->
    <div class="listing-files__column listing-files__column--third" ref="column3Ref">
      <div
        v-for="item in column3Items"
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
          :is-double-width="false"
        />
        <Placard v-else />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.listing-files {
  --masonry-gap: 1.5rem;

  display: grid;
  grid-template-columns: minmax(260px, 2fr) repeat(2, minmax(220px, 1fr));
  gap: var(--masonry-gap);
  max-height: 100vh;
  overflow: hidden;

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

.listing-files__column {
  display: flex;
  flex-direction: column;
  gap: var(--masonry-gap);
  overflow-y: auto;
  max-height: 100vh;
  // scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  // scroll-padding-top: 200px; // Espace supplémentaire en bas pour accéder au bouton

  // Masquer la scrollbar mais garder le scroll
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.listing-files__item {
  // scroll-snap-align: start;
  // scroll-snap-stop: always;
  flex-shrink: 0;
}

.listing-files__column {
  .listing-files__item:last-child {
    padding-bottom: 300px;
  }
}
</style>

