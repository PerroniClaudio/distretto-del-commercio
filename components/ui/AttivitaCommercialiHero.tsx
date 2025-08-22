"use client";

import {
  Hero,
  HeroBackground,
  HeroBody,
  HeroCategory,
  HeroTitle,
} from "design-react-kit";

import React from 'react'

function AttivitaCommercialiHero() {
  return (
    <Hero overlay="dark">
      <HeroBackground
        alt="Distretto del Commercio - Attività commerciali locali"
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Distretto del Commercio"
      />
      <HeroBody>
        <HeroCategory>Commercio</HeroCategory>
        <HeroTitle tag="h2">Attività Commerciali</HeroTitle>
        <p className="d-none d-lg-block font-sans-serif fs-5">
          Scopri le attività commerciali e le aziende di
          Pessano, Cambiago, Gessate, Bellinzago e Pozzuolo Martesana.
        </p>

      </HeroBody>
    </Hero>
  )
}

export default AttivitaCommercialiHero