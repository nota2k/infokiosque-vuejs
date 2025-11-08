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
      <a :href="`https://papiers.pantagruweb.club/api/documents/${post.id}/preview/`" class="single-post__link" target="_blank">Voir plus</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.listing-files {
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  min-height: 100vh;
  
  .single-post {
    border: 1px solid #000;
    padding: 1rem;

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
    }
  }
}

</style>
