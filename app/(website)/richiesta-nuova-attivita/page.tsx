"use client";

import { useEffect } from "react";

export default function RichiestaNuovaAttivitaPage() {
  useEffect(() => {
    window.location.href =
      "mailto:commercio@comune.pessanoconbornago.mi.it?subject=Iscrizione%20Distretto%20Martesana";
  }, []);

  return null;
}
