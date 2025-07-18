"use client";

import {
  Hero,
  HeroBackground,
  HeroBody,
  HeroCategory,
  HeroTitle,
} from "design-react-kit";

import React from 'react'

function EventsHero() {
  return (
    <Hero overlay="dark">
      <HeroBackground
        alt="Distretto del commercio - Attività commerciali locali"
        src="https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Distretto del commercio"
      />
      <HeroBody>
        <HeroCategory>Eventi</HeroCategory>
        <HeroTitle tag="h2">Eventi del distretto</HeroTitle>
        <p className="d-none d-lg-block font-sans-serif">
          Scopri gli eventi delle aziende e attività commerciali di
          Pessano, Cambiago, Gessate, Bellinzago e Pozzuolo Martesana. 
        </p>
        
      </HeroBody>
    </Hero>
  )
}

export default EventsHero