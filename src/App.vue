<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <RouterLink to="/" class="logo">Infokiosque</RouterLink>
      <nav class="nav">
        <RouterLink to="/" class="nav__link">Accueil</RouterLink>
      </nav>
    </header>
    <RouterView />
    <footer class="footer">
      © {{ new Date().getFullYear() }} Infokiosque. Tous droits réservés.
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f8fafc;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem clamp(1.5rem, 5vw, 3rem);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
}

.logo {
  font-weight: 700;
  font-size: 1.2rem;
  color: #1d4ed8;
  text-decoration: none;
  letter-spacing: 0.04em;
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
