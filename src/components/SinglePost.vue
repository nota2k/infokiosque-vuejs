<script setup>
import { computed } from "vue";

const props = defineProps({
  post: {
    type: Object,
    id: String,
    title: String,
    content: String,
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
      <h1 class="single-post__title">
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
  &__title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
    font-family: "Velvelyne", sans-serif;
    line-height: 1.2;
  }

  &__body {
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
