"use client";

import {
  Hero,
  HeroBackground,
  HeroBody,
  HeroButton,
  HeroCategory,
  HeroTitle,
} from "design-react-kit";

function HeroSection() {
  return (
    <Hero overlay="dark">
      <HeroBackground
        alt="Distretto del commercio - Attività commerciali locali"
        src="https://images.unsplash.com/photo-1556742393-d75f468bfcb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        title="Distretto del commercio"
      />
      <HeroBody>
        <HeroCategory>Notizie e Attività</HeroCategory>
        <HeroTitle tag="h2">Distretto del Commercio</HeroTitle>
        <p className="d-none d-lg-block font-sans-serif">
          Scopri le notizie e le novità delle aziende e attività commerciali di
          Pessano, Cambiago, Gessate, Bellinzago e Pozzuolo Martesana. Il tuo
          punto di riferimento per il commercio locale.
        </p>
        <HeroButton color="primary" outline>
          Leggi le ultime notizie
        </HeroButton>
      </HeroBody>
    </Hero>
  );
}
export default HeroSection;
