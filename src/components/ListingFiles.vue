<script setup>
import { computed } from "vue";
import SinglePost from "@/components/SinglePost.vue";
import { usePaperlessStore } from "@/stores/paperless";

const paperlessStore = usePaperlessStore();

const posts = computed(() => paperlessStore.documents);
// console.log(posts.value);

</script>

<template>
  <div class="listing-files">
    <SinglePost v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<style scoped lang="scss">
.listing-files {
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  min-height: 100vh;
  .post {
    background-color: #fff;
    border: 1px solid #000;
    padding: 1rem;
  }
}

</style>

