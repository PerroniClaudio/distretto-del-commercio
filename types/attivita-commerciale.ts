import { PortableTextBlock } from "next-sanity";

export interface AttivitaCommercialeContatto {
  title?: string;
  type: 'email' | 'phone' | 'fax' | 'whatsapp' | 'website' | 'instagram' | 'facebook';
  value: string;
}

export interface AttivitaCommerciale {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: { current: string };
  description?: PortableTextBlock[];
  mainImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  indirizzo?: {
    via?: string;
    civico?: string;
    cap?: string;
  };
  comune?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  settori?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }>;
  apertaAlPubblico: boolean;
  contacts?: AttivitaCommercialeContatto[];
}