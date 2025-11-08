<script setup>
import { computed } from "vue";

</script>

<template>
  <div class="listing-files">
    <div class="post">
      zzz
    </div>
    <div class="post">
      zzz
    </div>
    <div class="post">
      zzz
    </div>
    <div class="post">
      zzz
    </div>
  </div>
</template>

<style scoped lang="scss">
.listing-files {
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  min-height: 100vh;
  .post {
    background-color: #fff;
    border: 1px solid #000;
    padding: 1rem;
  }
}

</style>

