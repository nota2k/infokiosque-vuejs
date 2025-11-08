<script setup>
import { computed, onMounted } from "vue";
import megaphone from "@/assets/img/random/megaphone.png";

</script>

<template>
  <div class="placard">
    <img class="placard__image" :src="megaphone" alt="Placard" />
    <div class="placard__content">
      <h2 class="placard__title">Envoyez la note !</h2>
      <p class="placard__description">Description</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.placard {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  border: 1px solid #000;
  justify-content: center;

  .placard__image {
    width: 50%;
    max-width: 110px;
    object-fit: cover;
  }

  .placard__content {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .placard__title {
      font-size: 2rem;
      font-weight: 600;
    }

    .placard__description {
      font-size: 1.2rem;
      font-weight: 400;
    }
  }
}

</style>

