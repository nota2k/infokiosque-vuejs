<template>
  <main class="home">
    <section class="hero">
      <div class="hero__content">
        <p class="tagline">Bienvenue sur Infokiosque</p>
        <h1 class="title">Centralisez et diffusez vos informations clés</h1>
        <p class="subtitle">
          Simplifiez la publication de contenus sur vos écrans, bornes et espaces d’accueil grâce à une
          interface intuitive et collaborative.
        </p>
        <div class="hero__actions">
          <button class="btn btn--primary">Découvrir la plateforme</button>
          <button class="btn btn--secondary">Demander une démo</button>
        </div>
      </div>
      <div class="hero__illustration" aria-hidden="true">
        <div class="screen">
          <div class="screen__header"></div>
          <div class="screen__body">
            <span class="screen__bar screen__bar--large"></span>
            <span class="screen__bar"></span>
            <span class="screen__bar screen__bar--small"></span>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <h2>Pourquoi choisir Infokiosque&nbsp;?</h2>
      <div class="features__grid">
        <article class="feature">
          <h3>Gestion centralisée</h3>
          <p>Pilotez tous vos points d’affichage depuis une interface unique et sécurisée.</p>
        </article>
        <article class="feature">
          <h3>Collaboration facilitée</h3>
          <p>Invitez vos équipes, attribuez des rôles et validez les contenus en quelques clics.</p>
        </article>
        <article class="feature">
          <h3>Statistiques en temps réel</h3>
          <p>Suivez la performance de vos campagnes et ajustez-les instantanément.</p>
        </article>
      </div>
    </section>

    <section class="cta">
      <div class="cta__content">
        <h2>Prêt à moderniser votre diffusion d’information&nbsp;?</h2>
        <p>Contactez-nous pour configurer votre première borne Infokiosque dès aujourd’hui.</p>
        <button class="btn btn--primary">Nous contacter</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 4rem 1.5rem 6rem;
  max-width: 1100px;
  margin: 0 auto;
  color: #1f2933;
}

.hero {
  display: grid;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tagline {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2d9cdb;
  margin: 0;
}

.title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  margin: 0;
  line-height: 1.15;
}

.subtitle {
  font-size: 1.05rem;
  line-height: 1.65;
  margin: 0;
  color: #475569;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn {
  border: none;
  border-radius: 999px;
  font-weight: 600;
  padding: 0.9rem 1.8rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}

.btn--primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.4);
}

.btn--secondary {
  background: #e2e8f0;
  color: #1f2933;
}

.btn--secondary:hover {
  background: #cbd5f5;
}

.hero__illustration {
  display: flex;
  justify-content: center;
}

.screen {
  width: min(100%, 340px);
  aspect-ratio: 4 / 3;
  background: linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.screen__header {
  height: 12px;
  background: #cbd5f5;
  border-radius: 999px;
}

.screen__body {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.screen__bar {
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  opacity: 0.65;
}

.screen__bar--large {
  height: 24px;
  opacity: 0.85;
}

.screen__bar--small {
  width: 70%;
  align-self: flex-start;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: center;
}

.features h2 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  margin: 0;
}

.features__grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 800px) {
  .features__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.feature {
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.feature h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2933;
}

.feature p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.cta {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  border-radius: 32px;
  padding: 3rem clamp(1.5rem, 5vw, 4rem);
  color: #ffffff;
  text-align: center;
  box-shadow: 0 20px 45px rgba(29, 78, 216, 0.4);
}

.cta__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.cta h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
}

.cta p {
  margin: 0;
  font-size: 1.05rem;
  max-width: 540px;
  line-height: 1.6;
}
</style>

