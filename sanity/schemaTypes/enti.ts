import { FaBuildingColumns } from "react-icons/fa6";

export default {
  name: "ente",
  title: "Enti",
  type: "document",
  icon: FaBuildingColumns,
  fields: [
    {
      name: "title",
      title: "Nome",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "image",
      title: "Immagine",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "description",
      title: "Descrizione",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Testo alternativo",
              type: "string",
              description: "Importante per l'accessibilità e SEO",
            },
            {
              name: "caption",
              title: "Didascalia",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "raggruppaInNavbar",
      title: "Raggruppa in navbar",
      type: "boolean",
      initialValue: true,
      description: "Se è attivo, l'ente viene raggruppato insieme agli altri nella voce 'Enti' della navbar. Altrimenti se si deve vedere in navbar deve essere inserito a mano.",
    },
    {
      name: "canPublishAlone",
      title: "Può pubblicare da solo",
      type: "boolean",
      initialValue: false,
      description: "Se attivo l'ente può pubblicare da solo eventi e notizie, senza comuni o altri enti principali associati. Flag usato solo per ricordarsi. Al momento non si usa nel codice.",
    },
    {
      name: "contacts",
      title: "Contatti",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Titolo (opzionale)",
              type: "string",
              description: "Es. 'Ufficio Anagrafe', 'Centralino', ecc.",
            },
            {
              name: "type",
              title: "Tipo",
              type: "string",
              options: {
                list: [
                  { title: "Email", value: "email" },
                  { title: "Telefono", value: "phone" },
                  { title: "Fax", value: "fax" },
                  { title: "WhatsApp", value: "whatsapp" },
                  { title: "Sito Web", value: "website" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "value",
              title: "Contatto",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "title", type: "type", value: "value" },
            prepare({ title, type, value }: any) {
              return { title: title || type, subtitle: value };
            },
          },
        },
      ],
    },
  ],
};