<script setup>
import { computed } from "vue";

const props = defineProps({
  files: {
    type: Array,
    required: true,
  },
  emptyState: {
    type: Object,
    default: () => ({}),
  },
  selectable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits({
  fileClick: (file) => file,
  ctaClick: () => true,
});

const hasFiles = computed(() => props.files && props.files.length > 0);

function formatFileSize(bytes) {
  if (bytes === undefined || Number.isNaN(bytes)) return undefined;
  if (bytes === 0) return "0 o";
  const units = ["o", "Ko", "Mo", "Go", "To"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function formatDate(date) {
  if (!date) return undefined;
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return undefined;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function onFileClick(file) {
  emit("file-click", file);
}

function onEmptyCtaClick() {
  emit("ctaClick");
}
</script>

<template>
  <div class="listing-files">
    <header class="listing-files__header">
      <h2 class="listing-files__title">Fichiers</h2>
      <span v-if="hasFiles" class="listing-files__count">{{ files.length }} éléments</span>
    </header>

    <ul v-if="hasFiles" class="listing-files__items" role="list">
      <li
        v-for="file in files"
        :key="file.id"
        class="listing-files__item"
        :tabindex="selectable ? 0 : -1"
        role="button"
        @click="selectable ? onFileClick(file) : undefined"
        @keydown.enter.prevent="selectable ? onFileClick(file) : undefined"
        @keydown.space.prevent="selectable ? onFileClick(file) : undefined"
      >
        <div class="listing-files__thumbnail" aria-hidden="true">
          <img
            v-if="file.thumbnailUrl"
            :src="file.thumbnailUrl"
            :alt="`Vignette du fichier ${file.name}`"
          />
          <span v-else class="listing-files__icon">{{ file.type?.[0]?.toUpperCase() ?? "F" }}</span>
        </div>
        <div class="listing-files__meta">
          <p class="listing-files__name">{{ file.name }}</p>
          <div class="listing-files__details">
            <span v-if="file.type" class="listing-files__badge">{{ file.type }}</span>
            <span v-if="formatFileSize(file.size)" class="listing-files__detail">{{
              formatFileSize(file.size)
            }}</span>
            <span v-if="formatDate(file.updatedAt)" class="listing-files__detail">{{
              formatDate(file.updatedAt)
            }}</span>
          </div>
        </div>
      </li>
    </ul>

    <div v-else class="listing-files__empty" role="presentation">
      <div class="listing-files__empty-icon" aria-hidden="true">📁</div>
      <p class="listing-files__empty-title">
        {{ emptyState?.title ?? "Aucun fichier disponible" }}
      </p>
      <p v-if="emptyState?.description" class="listing-files__empty-description">
        {{ emptyState.description }}
      </p>
      <button
        v-if="emptyState?.ctaLabel"
        type="button"
        class="listing-files__empty-cta"
        @click="onEmptyCtaClick"
      >
        {{ emptyState.ctaLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.listing-files {
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.listing-files__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.listing-files__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2933;
}

.listing-files__count {
  color: #64748b;
  font-size: 0.9rem;
}

.listing-files__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.listing-files__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  background: #f8fafc;
  border-radius: 16px;
  padding: 0.9rem 1.2rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  cursor: default;
  outline: none;
}

.listing-files__item:focus-visible,
.listing-files__item:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(100, 116, 139, 0.25);
}

.listing-files__item[role="button"] {
  cursor: pointer;
}

.listing-files__thumbnail {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
}

.listing-files__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.listing-files__icon {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
}

.listing-files__meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.listing-files__name {
  margin: 0;
  font-weight: 600;
  color: #1f2933;
  font-size: 1rem;
  word-break: break-word;
}

.listing-files__details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  color: #475569;
  font-size: 0.85rem;
}

.listing-files__badge {
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.listing-files__detail {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.listing-files__empty {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  border: 2px dashed #cbd5f5;
  border-radius: 16px;
  color: #475569;
}

.listing-files__empty-icon {
  font-size: 2rem;
}

.listing-files__empty-title {
  font-weight: 600;
  margin: 0;
  color: #1f2933;
}

.listing-files__empty-description {
  margin: 0;
  max-width: 360px;
  line-height: 1.5;
}

.listing-files__empty-cta {
  border: none;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  border-radius: 999px;
  padding: 0.7rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.listing-files__empty-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.3);
}

.listing-files__empty-cta:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}
</style>

