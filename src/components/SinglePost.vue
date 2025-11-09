<script setup>
import { computed } from "vue";
import { usePaperlessStore } from "@/stores/paperless";

const props = defineProps({
  post: {
    type: Object,
    id: String,
    title: String,
    content: String,
  },
  isBigTitle: {
    type: Boolean,
    default: false,
  },
  isDoubleWidth: {
    type: Boolean,
    default: false,
  },
});

const paperlessStore = usePaperlessStore();

function normalizeDocumentTypeId(entry) {
  if (typeof entry === "number" || typeof entry === "string") {
    return String(entry);
  }

  if (entry && typeof entry === "object") {
    if ("id" in entry && (typeof entry.id === "number" || typeof entry.id === "string")) {
      return String(entry.id);
    }
    if ("pk" in entry && (typeof entry.pk === "number" || typeof entry.pk === "string")) {
      return String(entry.pk);
    }
  }

  return null;
}

const documentTypeName = computed(() => {
  const directEntry = props.post?.document_type;

  if (directEntry && typeof directEntry === "object") {
    const raw =
      typeof directEntry.name === "string"
        ? directEntry.name
        : typeof directEntry.title === "string"
        ? directEntry.title
        : typeof directEntry.label === "string"
        ? directEntry.label
        : null;
    if (raw && raw.trim().length > 0) {
      return raw.trim();
    }
  }

  const fallbackId =
    normalizeDocumentTypeId(directEntry) ??
    normalizeDocumentTypeId(props.post?.document_type_id) ??
    normalizeDocumentTypeId(props.post?.document_type_pk);

  if (!fallbackId) {
    return null;
  }

  const found = paperlessStore.documentTypes.find(
    (type) => String(type?.id) === fallbackId
  );
  return found?.name ?? null;
});

const truncatedContent = computed(() => {
  const rawContent = props.post?.content ?? "";
  if (rawContent.length <= 600) {
    return rawContent;
  }
  return `${rawContent.slice(0, 600)}…`;
});

function normalizeClassName(name) {
  if (!name || typeof name !== "string") return null;
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, ""); // Supprimer les tirets en début et fin
}

const documentTypeClass = computed(() => {
  const name = documentTypeName.value;
  if (!name) return null;
  return normalizeClassName(name);
});

</script>

<template>
  <div class="single-post" :class="{ [`single-post--${documentTypeClass}`]: documentTypeClass }" :id="post.id">
    <div class="single-post__content">
      <p 
        :class="[
          'single-post__document-type',
          documentTypeClass && `single-post__document-type--${documentTypeClass}`,
          { 'single-post__document-type--big': props.isBigTitle }
        ]" 
        v-if="documentTypeName"
      >
        {{ documentTypeName }}
      </p>
      <h1
        :class="[
          'single-post__title',
          { 'single-post__title--big': props.isBigTitle },
        ]"
      >
        {{ post.title }}
      </h1>
      <div class="single-post__body" :class="{ 'single-post__body--double-width': props.isDoubleWidth }">
        <p>{{ truncatedContent }}</p>
      </div>
      <a class="read-more" :href="`https://papiers.pantagruweb.club/api/documents/${post.id}/preview/`" target="_blank">Lire</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.single-post {
  max-height: fit-content;
  margin-top: 20px;

  &__document-type {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    border: 1px solid #000;
    padding: 0.35rem 0.75rem;
    display: inline-block;
    letter-spacing: 0.06em;
  }

  &__title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    font-family: "Velvelyne", sans-serif;
    line-height: 1.2;
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    margin-top: 20px;
    color:$color-primary;
    inset: 0;
    border-bottom: 3px solid transparent;
    border-image-source: url("/line.svg");
    border-image-slice: 30 fill;
    border-image-repeat: repeat;
    z-index: -1;
    pointer-events: none;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      bottom: -15px;
      margin-bottom: 5px;
      border-bottom: 3px solid transparent;
      border-image-source: url("/line.svg");
      border-image-slice: 30 fill;
      border-image-repeat: repeat;
      pointer-events: none;
    }
  }

  &__title--big {
    font-size: 4vw;
    line-height: 1.1;
    text-transform: uppercase;
    color:$color-primary;
    font-family: "Aujournuit", sans-serif;
    word-wrap: break-word;
  }

  &__body {
    margin-top: 30px;
    font-size: 1rem;
    font-family: "Aujournuit", serif;
    line-height: 1.5;
    font-weight: 400;
    overflow: hidden;
    color:$color-primary;

    &--double-width {
      p {
        columns: 2;
        column-gap: 1rem;
      }

      @media (max-width: 900px) {
        p {
          columns: 1;
        }
      }
    }
  }

  .read-more {
    margin-top: 1.25rem;
    display: block;
    width: 100%;
    max-width: 200px;
    // border-radius:0px 0px 40px 40px;
    font-weight: 600;
    border: 1px solid #000;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    color: $color-primary;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover {
      background: $color-primary;
      color: #fff;
    }
  }
}

.single-post--livre {
  &::before {
    content: "";
    display: block;
    width:80px;
    height: 80px;
    float: left;
    background-image: url("book.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 1rem;
  }
}

.single-post--brochure {
  &::before {
    content: "";
    display: block;
    width:80px;
    height: 80px;
    float: left;
    background-image: url("app-photo.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 1rem;
  }
}

.single-post--article {
  &::before {
    content: "";
    display: block;
    width:80px;
    height: 80px;
    float: left;
    background-image: url("machine.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 1rem;
  }
}

.single-post--pamphlet {
  
  .single-post__body {
    &::before {
      content: "";
      display: block;
      width:80px;
      height: 80px;
      float: left;
      background-image: url("Plume.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  
}

.single-post--questionnaire {
  border: 2px solid $color-primary;
  padding: 2rem;
  text-align: center;

  .single-post__body {
    text-align: left;
  }

  .read-more {
    margin: 0 auto;
  }
}
</style>
