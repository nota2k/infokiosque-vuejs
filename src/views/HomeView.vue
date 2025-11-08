<script setup>
import ListingFiles from "@/components/ListingFiles.vue";
</script>

<template>
  <main class="home">
    <h1>Infokiosque</h1>
    <div class="container">
      <ListingFiles/>
    </div>
  </main>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 4rem 1.5rem 6rem;
  color: #1f2933;
  font-family: "Velvelyne", serif;

  h1 {
    font-size: 4rem;
    font-weight: 500;
    text-align: center;
    font-family: "Bagnard", sans-serif;
  }
}

.container {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}
</style>

