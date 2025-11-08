<script setup>
import { computed } from "vue";

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
});


const truncatedContent = computed(() => {
  const rawContent = props.post?.content ?? "";
  if (rawContent.length <= 600) {
    return rawContent;
  }
  return `${rawContent.slice(0, 600)}…`;
});
</script>

<template>
  <div class="single-post" :id="post.id">
    <div class="single-post__content">
      <h1
        :class="[
          'single-post__title',
          { 'single-post__title--big': props.isBigTitle },
        ]"
      >
        {{ post.title }}
      </h1>
      <div class="single-post__body">
        {{ truncatedContent }}
      </div>
      <a class="read-more" :href="`https://papiers.pantagruweb.club/api/documents/${post.id}/preview/`" target="_blank">Lire</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
  
.single-post {
  max-height: fit-content;
  margin-top: 20px;

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
  }

  .read-more {
    margin-top: 1.25rem;
    display: block;
    width: 100%;
    font-weight: 600;
    border: 1px solid #000;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    color: #000;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover {
      background: #000;
      color: #fff;
    }
  }
  
}


</style>
