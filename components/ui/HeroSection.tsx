"use client";

import {
  Hero,
  HeroBackground,
  HeroBody,
  HeroButton,
  HeroCategory,
  HeroTitle,
} from "design-react-kit";
import Link from "next/link";

function HeroSection() {
  return (
    <Hero overlay="dark">
      <HeroBackground
        alt="Distretto del Commercio - Attività commerciali locali"
        src="https://images.unsplash.com/photo-1556742393-d75f468bfcb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        title="Distretto del Commercio"
      />
      <HeroBody>
        <HeroCategory>Notizie e Attività</HeroCategory>
        <HeroTitle tag="h2">Distretto del Commercio</HeroTitle>
        <p className="d-none d-lg-block font-sans-serif fs-5">
          Il Distretto, che rappresenterà un vero e proprio marchio di qualità negli eventi e nelle proposte dei 
          cinque Comuni di Pessano con Bornago, Cambiago, Gessate, Bellinzago Lombardo, Pozzuolo Martesana, si pone 
          come obiettivo quello di mettere in rete il patrimonio commerciale, culturale e storico di tutto il territorio.
        </p>
        <Link href="/notizie">
          <HeroButton color="secondary">
            Leggi le ultime notizie
          </HeroButton>
        </Link>
      </HeroBody>
    </Hero>
  );
}
export default HeroSection;
