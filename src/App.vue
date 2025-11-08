<script setup>
import { RouterLink, RouterView } from "vue-router";
import logo from "@/assets/img/logo.svg";
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <RouterLink to="/" class="logo"><img class="logo__img" :src="logo" alt="Infokiosque" /></RouterLink>
    </header>
    <RouterView />
    <footer class="footer">
      © {{ new Date().getFullYear() }} Infokiosque. Tous droits réservés.
    </footer>
  </div>
</template>

<style scoped lang="scss">

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  top: -100px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(1.5rem, 5vw, 3rem);
  position: sticky;
  top: 10px;
  z-index: 10;
}

.logo {
  font-weight: 700;
  text-decoration: none;
  border-radius: 999px;
  border: 1px solid #000;
  padding: 1.3em;
  aspect-ratio: 1/1;
  max-width: 80px;
  height: 80px;
  z-index: 10;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo__img {
    width: 100%;
    object-fit: contain;
  }
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav__link {
  text-decoration: none;
  color: #1f2933;
  font-weight: 500;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav__link.router-link-active {
  background: #e2e8f0;
  color: #1d4ed8;
}

.footer {
  margin-top: auto;
  padding: 2rem clamp(1.5rem, 5vw, 3rem);
  text-align: center;
  font-size: 0.9rem;
  color: #475569;
}
</style>
