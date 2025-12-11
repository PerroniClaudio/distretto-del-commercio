import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
// import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "./globals.scss";

export const metadata: Metadata = {  
  title: "Distretto del Commercio della Martesana",
  description: "Eventi e notizie del Distretto del Commercio della Martesana",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head></head>
      <body>
        {children}

        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}
