import { FaStore } from "react-icons/fa";

export default {
  name: "attivita_commerciale",
  title: "Attività Commerciali",
  type: "document",
  icon: FaStore,
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
      name: "mainImage",
      title: "Foto",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "indirizzo",
      title: "Indirizzo",
      type: "object",
      fields: [
        {
          name: "via",
          title: "Via/Piazza",
          type: "string",
        },
        {
          name: "civico",
          title: "Numero Civico",
          type: "string",
        },
        {
          name: "cap",
          title: "CAP",
          type: "string",
        },
      ],
    },
    {
      name: "comune",
      title: "Comune",
      type: "reference",
      to: [{ type: "comune" }],
    },
    {
      name: "settori",
      title: "Settori",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "settore" }],
        },
      ],
    },
    {
      name: "apertaAlPubblico",
      title: "Aperta al pubblico",
      type: "boolean",
      initialValue: true,
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
            select: {
              title: "title",
              type: "type",
              value: "value",
            },
            prepare({ title, type, value }: any) {
              return {
                title: title || type,
                subtitle: value,
              };
            },
          },
        },
      ],
    },
  ],
};